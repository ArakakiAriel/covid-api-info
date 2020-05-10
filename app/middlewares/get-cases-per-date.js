const constants = require('../constants/constants');
const messages = require('../constants/messages');
const config = require('../config/config');
const RedisService = require('../services/redis/redis-service');
const {normalizeCountriesbkp} = require('../utils/utils');
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
            let normalizedCountriesCases = normalizeCountriesbkp(config.bigQuery.countries_to_normalize, "cases");
            let normalizedCountriesC = normalizeCountriesbkp(config.bigQuery.countries_to_normalize, "c");
            const sqlQuery = `SELECT ${normalizedCountriesCases} as country, (SUM(cases.latitude)/COUNT(cases.latitude)) as latitude, 
            (SUM(cases.longitude)/COUNT(cases.longitude)) as longitude,SUM(COALESCE(cases.confirmed, 0)) as total_confirmed, 
            SUM(COALESCE(cases.deaths, 0)) as total_deaths, SUM(COALESCE(cases.recovered, 0)) as total_recovered, 
            SUM(COALESCE(cases.active, 0)) as total_active_cases, MAX(cases.date) as updated_date
            FROM
            \`bigquery-public-data.covid19_jhu_csse.summary\` cases
            INNER JOIN (
                SELECT ${normalizedCountriesC} as countryc, MAX(c.date) as maxdate
                FROM	\`bigquery-public-data.covid19_jhu_csse.summary\` c
                WHERE c.date <= '${formatedDate}'
                GROUP BY countryc
            ) lcases ON cases.country_region = lcases.countryc AND cases.date = lcases.maxdate
            GROUP BY country
            HAVING total_confirmed > 0
            ORDER BY total_confirmed desc;`;
        
            const options = {
            query: sqlQuery,
            // Location must match that of the dataset(s) referenced in the query.
            location: 'US',
            };
        
            // Run the query
            const [globalCases] = await bigqueryClient.query(options);
            
            if(!globalCases){
                return setResponseWithError(res, constants.NOT_FOUND_ERROR, messages.NOT_RESULT_FOUND);
            }

            let globalConfirmedCases = 0;
            let globalActiveCases = 0;
            let globalRecovered = 0;
            let globalDeaths = 0;
            for(let i = 0; i < globalCases.length; i++){
                globalConfirmedCases += globalCases[i].total_confirmed;
                globalActiveCases += globalCases[i].total_active_cases;
                globalRecovered += globalCases[i].total_recovered;
                globalDeaths += globalCases[i].total_deaths;
            }

            //Data normalizer
            for(let i = 0; i < globalCases.length; i++){
                globalCases[i].country = globalCases[i].country.toUpperCase();
                globalCases[i].position_in_table = i + 1;
                let activeCases = (globalCases[i].total_active_cases == 0 ? globalCases[i].total_confirmed - globalCases[i].total_deaths - globalCases[i].total_recovered : globalCases[i].total_active_cases);

                globalCases[i].total = {
                    confirmed : globalCases[i].total_confirmed,
                    actives: activeCases,
                    deaths: globalCases[i].total_deaths,
                    recovered: globalCases[i].total_recovered
                }
                globalCases[i].percentage ={
                    actives : `${(activeCases / globalCases[i].total_confirmed * 100).toFixed(2)}%`,
                    deaths : `${(globalCases[i].total_deaths / globalCases[i].total_confirmed * 100).toFixed(2)}%`,
                    recovered : `${(globalCases[i].total_recovered / globalCases[i].total_confirmed * 100).toFixed(2)}%`,
                    mortality_rate: `${(globalCases[i].total_deaths / (globalCases[i].total_deaths + globalCases[i].total_recovered) * 100).toFixed(2)}%`,
                };
                globalCases[i].global_percentage ={
                    confirmed : `${(globalCases[i].total_confirmed / globalConfirmedCases * 100).toFixed(2)}%`,
                    actives : `${(activeCases / globalConfirmedCases * 100).toFixed(2)}%`,
                    deaths : `${(globalCases[i].total_deaths / globalConfirmedCases * 100).toFixed(2)}%`,
                    recovered : `${(globalCases[i].total_recovered / globalConfirmedCases * 100).toFixed(2)}%`,
                    
                };
                delete globalCases[i].total_confirmed ;
                delete globalCases[i].total_active_cases;
                delete globalCases[i].total_deaths;
                delete globalCases[i].total_recovered;
                
                globalCases[i].location = {
                    latitude: globalCases[i].latitude,
                    longitude: globalCases[i].longitude
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
