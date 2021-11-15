const constants = require('../constants/constants');
const messages = require('../constants/messages');
const config = require('../config/config');
const RedisService = require('../services/redis/redis-service');
const {normalizeCountries} = require('../utils/utils');
const {formatCertainDate} = require('../utils/date-util');
var fs = require('fs');
const {BigQuery} = require('@google-cloud/bigquery');
const setResponseWithError = require('../utils/common-response').setResponseWithError;

const redis = new RedisService();

module.exports.getCasesPerDate = async (req, res, next) => {
    let formatedDate = formatCertainDate(req.date);
    global.globalCollectionName = `results-${formatedDate}`;
    console.log(globalCollectionName);
    let covidDataContent = await redis.getData(globalCollectionName);

    if(!covidDataContent){
        try {
            const bigqueryClient = new BigQuery();
            // The SQL query to run
            let normalizedCountriesCases = normalizeCountries(config.bigQuery.countries_to_normalize, "aux");
            let normalizedCountriesCases2 = normalizeCountries(config.bigQuery.countries_to_normalize, "c");
            const sqlQuery = `SELECT casea.country_region, casea.total_confirmed , casea.total_deaths, casea.updated_date, caseb.country_code, caseb.population,caseb.population_male, caseb.population_female, caseb.population_density, caseb.latitude, caseb.longitude  FROM (SELECT cases.country_region as country_region, SUM(COALESCE(cases.confirmed, 0)) as total_confirmed, 
            SUM(COALESCE(cases.deaths, 0)) as total_deaths,  MAX(cases.date) as updated_date
            FROM
                (SELECT ${normalizedCountriesCases} as country_region,aux.confirmed,aux.deaths,aux.date
                FROM \`bigquery-public-data.covid19_jhu_csse.summary\` aux) cases
            INNER JOIN (
                SELECT ${normalizedCountriesCases2} as country, MAX(c.date) as maxdate
                FROM	\`bigquery-public-data.covid19_jhu_csse.summary\` c
                WHERE c.date <= '${formatedDate}'
                GROUP BY country
            ) lcases ON upper(cases.country_region)  = upper(lcases.country) AND cases.date = lcases.maxdate
            GROUP BY country_region
            HAVING total_confirmed > 0
            ORDER BY total_confirmed desc) casea
            LEFT JOIN (
                SELECT upper(country_name) as country, country_code, population, population_male, population_female, population_density, latitude, longitude FROM \`bigquery-public-data.covid19_open_data.covid19_open_data\` WHERE aggregation_level = 0 AND date = '${formatedDate}'
            ) caseb ON upper(casea.country_region) = upper(caseb.country) 
            ORDER BY total_confirmed DESC;`;
            const options = {
            query: sqlQuery,
            // Location must match that of the dataset(s) referenced in the query.
            location: 'US',
            };
        
            console.log(sqlQuery);
            // Run the query
            const [globalCases] = await bigqueryClient.query(options);
            
            if(!globalCases){
                return setResponseWithError(res, constants.NOT_FOUND_ERROR, messages.NOT_RESULT_FOUND);
            }
            //Falta modificar esto ahora
            let globalConfirmedCases = 0;
                //let globalActiveCases = 0;
                //let globalRecovered = 0;
            let globalDeaths = 0;
            let globalConcernedPopulation = 0;
            let globalMaleConcernedPopulation = 0;
            let globalFemaleConcernedPopulation = 0;
            for(let i = 0; i < globalCases.length; i++){
                globalConfirmedCases += globalCases[i].total_confirmed;
                    //globalActiveCases += globalCases[i].total_active_cases;
                    //globalRecovered += globalCases[i].total_recovered;
                globalDeaths += globalCases[i].total_deaths;
                globalConcernedPopulation += globalCases[i].population;
                globalMaleConcernedPopulation  += globalCases[i].population_male;
                globalFemaleConcernedPopulation  += globalCases[i].population_female;
            }

            //Data normalizer
            for(let i = 0; i < globalCases.length; i++){
                globalCases[i].country_region = globalCases[i].country_region.toUpperCase();
                globalCases[i].position_in_table = i + 1;
                
                if(globalCases[i].population_density >= 1000){
                    globalCases[i].population_density = (globalCases[i].population_density /1000).toFixed(1)
                }
                    //let activeCases = (globalCases[i].total_active_cases == 0 ? globalCases[i].total_confirmed - globalCases[i].total_deaths - globalCases[i].total_recovered : globalCases[i].total_active_cases);

                globalCases[i].total = {
                    confirmed : globalCases[i].total_confirmed,
                        //actives: activeCases,
                    deaths: globalCases[i].total_deaths,
                        //recovered: globalCases[i].total_recovered
                }
                globalCases[i].percentage ={
                        //actives : `${(activeCases / globalCases[i].total_confirmed * 100).toFixed(2)}%`,
                    deaths : `${(globalCases[i].total_deaths / globalCases[i].total_confirmed * 100).toFixed(2)}%`,
                        //recovered : `${(globalCases[i].total_recovered / globalCases[i].total_confirmed * 100).toFixed(2)}%`,
                        //mortality_rate: `${(globalCases[i].total_deaths / (globalCases[i].total_deaths + globalCases[i].total_recovered) * 100).toFixed(2)}%`,
                };
                globalCases[i].global_percentage ={
                    confirmed : `${(globalCases[i].total_confirmed / globalConfirmedCases * 100).toFixed(2)}%`,
                        //actives : `${(activeCases / globalConfirmedCases * 100).toFixed(2)}%`,
                    deaths : `${(globalCases[i].total_deaths / globalConfirmedCases * 100).toFixed(2)}%`,
                        //recovered : `${(globalCases[i].total_recovered / globalConfirmedCases * 100).toFixed(2)}%`,
                    
                };

                //TODO realize why I did this
                delete globalCases[i].total_confirmed ;
                delete globalCases[i].total_active_cases;
                delete globalCases[i].total_deaths;
                delete globalCases[i].total_recovered;
                
                globalCases[i].coordinates = {
                    latitude: globalCases[i].latitude,
                    longitude: globalCases[i].longitude
                }

                if(globalCases[i].country_region == "DIAMOND PRINCESS"){
                    globalCases[i].coordinates = {
                        latitude: "35.41458",
                        longitude: "139.68203"
                    }
                }
                if(globalCases[i].country_region == "BELIZE"){
                    globalCases[i].coordinates = {
                        latitude: "17.1907805",
                        longitude: "-88.3596575"
                    }
                }
                delete globalCases[i].latitude;
                delete globalCases[i].longitude;

                let lastUpdate = globalCases[i].updated_date.value;
                delete globalCases[i].updated_date
                globalCases[i].updated_date = lastUpdate;
            };
            
            covidDataContent = JSON.stringify(globalCases);

            //Save on REDIS
            await redis.setData(globalCollectionName, covidDataContent, config.redisConfig.ttl);
        }catch (error) {
            console.log("ERROR:", error);
            return setResponseWithError(res, constants.INTERNAL_ERROR, messages.INTERNAL_ERROR);
        }

    }
    res.data = JSON.parse(covidDataContent);
    return next();
};
