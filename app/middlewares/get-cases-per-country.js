const constants = require('../constants/constants');
const messages = require('../constants/messages');
const config = require('../config/config');
const RedisService = require('../services/redis/redis-service');
const {BigQuery} = require('@google-cloud/bigquery');
const setResponseWithError = require('../utils/common-response').setResponseWithError;

const redis = new RedisService();

module.exports.getCasesPerCountry = async (req, res, next) => {
    let country = req.country;
    let key = `cases-${country.toLowerCase()}`;
    console.log(key);
    let countryDataContent = await redis.getData(key);

    if(!countryDataContent){
        const bigqueryClient = new BigQuery();
        // The SQL query to run
        let sqlQuery = `SELECT IF(cases.country_region LIKE '%Korea%', 'South Korea', IF(upper(cases.country_region) = 'IRAN (ISLAMIC REPUBLIC OF)', 'Iran',  
        IF(upper(cases.country_region) = 'REPUBLIC OF IRELAND', 'IRELAND', 
        IF(cases.country_region = 'United Kingdom', 'UK', IF(upper(cases.country_region) = 'REPUBLIC OF MOLDOVA', 'MOLDOVA', cases.country_region))))) as country, (SUM(cases.latitude)/COUNT(cases.latitude)) as latitude, 
        (SUM(cases.longitude)/COUNT(cases.longitude)) as longitude, SUM(case when cases.confirmed is null then 0 else cases.confirmed end) as total_confirmed, 
        SUM(case when cases.deaths is null then 0 else cases.deaths end) as total_deaths, SUM(case when cases.recovered is null then 0 else cases.recovered end) as total_recovered, 
        SUM(case when cases.active is null then 0 else cases.active end) as total_active_cases, cases.date as updated_date
        FROM \`bigquery-public-data.covid19_jhu_csse.summary\` cases
        WHERE  upper(cases.country_region) =  '${country}'
        GROUP BY country, updated_date
        HAVING total_confirmed > 0
        ORDER BY country, updated_date desc;`;
        
    
        const options = {
        query: sqlQuery,
        // Location must match that of the dataset(s) referenced in the query.
        location: 'US',
        };
    
        // Run the query
        const [globalCases] = await bigqueryClient.query(options);

        if(globalCases.length == 0){
            return setResponseWithError(res, constants.NOT_FOUND_ERROR, `No data where found for ${country}`);
        }

    
        for(let i = 0; i < globalCases.length; i++){
            globalCases[i].country = globalCases[i].country.toUpperCase();
            let lastUpdate = globalCases[i].updated_date.value;
            globalCases[i].updated_date = {};
            globalCases[i].updated_date = lastUpdate;
        };

        countryDataContent = JSON.stringify(globalCases);

        //Save on REDIS
        await redis.setData(key, countryDataContent, config.redisConfig.ttl);
    }
    
    res.data = JSON.parse(countryDataContent);

    return next();
};
