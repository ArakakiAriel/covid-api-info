const constants = require('../constants/constants');
const messages = require('../constants/messages');
const config = require('../config/config');
const RedisService = require('../services/redis/redis-service');
const {normalizeCountries} = require('../utils/utils');
const {BigQuery} = require('@google-cloud/bigquery');
const setResponseWithError = require('../utils/common-response').setResponseWithError;

const redis = new RedisService();

module.exports.getCasesPerCountry = async (req, res, next) => {
    let country = req.country;
    let key = `cases-${country.toLowerCase()}`;
    console.log(key);
    let countryDataContent = await redis.getData(key);

    if(!countryDataContent){
        try {
            const bigqueryClient = new BigQuery();
            // The SQL query to run
            let normalizedCountries = normalizeCountries(config.bigQuery.countries_to_normalize, 'cases');
            let sqlQuery = `SELECT ${normalizedCountries} AS country, (SUM(cases.latitude)/COUNT(cases.latitude)) as latitude, 
            (SUM(cases.longitude)/COUNT(cases.longitude)) as longitude, SUM(COALESCE(cases.confirmed, 0)) as total_confirmed, 
            SUM(COALESCE(cases.deaths, 0)) as total_deaths, SUM(COALESCE(cases.recovered, 0)) as total_recovered, 
            SUM(COALESCE(cases.active, 0)) as total_active_cases, cases.date as updated_date
            FROM \`bigquery-public-data.covid19_jhu_csse.summary\` cases
            WHERE  upper(${normalizedCountries}) =  '${country}'
            GROUP BY country, updated_date
            HAVING total_confirmed > 0
            ORDER BY country, updated_date desc;`;
            
            const options = {
            query: sqlQuery,
            // Location must match that of the dataset(s) referenced in the query.
            location: 'US',
            };
            
            console.log(sqlQuery);
            // Run the query
            const [globalCases] = await bigqueryClient.query(options);

            if(globalCases.length == 0){
                return setResponseWithError(res, constants.NOT_FOUND_ERROR, `No data where found for ${country}`);
            }

            for(let i = 0; i < globalCases.length; i++){
                globalCases[i].country = globalCases[i].country.toUpperCase();
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
                    recovered : `${(globalCases[i].total_recovered / globalCases[i].total_confirmed * 100).toFixed(2)}%`
                };
                delete globalCases[i].total_confirmed ;
                delete globalCases[i].total_active_cases;
                delete globalCases[i].total_deaths;
                delete globalCases[i].total_recovered;

                globalCases[i].coordinates = {
                    latitude: globalCases[i].latitude,
                    longitude: globalCases[i].longitude
                }
                delete globalCases[i].latitude;
                delete globalCases[i].longitude;

                let lastUpdate = globalCases[i].updated_date.value;
                delete globalCases[i].updated_date
                globalCases[i].updated_date = lastUpdate;
            };

            countryDataContent = JSON.stringify(globalCases);

            //Save on REDIS
            await redis.setData(key, countryDataContent, config.redisConfig.ttl);
        
        } catch (error) {
            console.log("ERROR:", error);
            return setResponseWithError(res, constants.INTERNAL_ERROR, messages.INTERNAL_ERROR);
        }
    }
    res.data = JSON.parse(countryDataContent);

    return next();
};
