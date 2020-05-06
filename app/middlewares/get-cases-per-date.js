const constants = require('../constants/constants');
const messages = require('../constants/messages');
const config = require('../config/config');
const RedisService = require('../services/redis/redis-service');
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
        const bigqueryClient = new BigQuery();
        // The SQL query to run
        const sqlQuery = `SELECT cases.country_region as country, (SUM(cases.latitude)/COUNT(cases.latitude)) as latitude, 
        (SUM(cases.longitude)/COUNT(cases.longitude)) as longitude, SUM(case when cases.confirmed is null then 0 else cases.confirmed end) as total_confirmed, 
        SUM(case when cases.deaths is null then 0 else cases.deaths end) as total_deaths, SUM(case when cases.recovered is null then 0 else cases.recovered end) as total_recovered, 
        SUM(case when cases.active is null then 0 else cases.active end) as total_active_cases, MAX(cases.date) as last_update
        FROM
        \`bigquery-public-data.covid19_jhu_csse.summary\` cases
        INNER JOIN (
            SELECT c.country_region, MAX(c.date) as maxdate
            FROM	\`bigquery-public-data.covid19_jhu_csse.summary\` c
            WHERE c.date <= '${formatedDate}'
            GROUP BY c.country_region
        ) lcases ON cases.country_region = lcases.country_region AND cases.date = lcases.maxdate
        GROUP BY cases.country_region
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

        //Data normalizer
        for(let i = 0; i < globalCases.length; i++){
            globalCases[i].country = globalCases[i].country.toUpperCase();
            globalCases[i].position_in_table = i + 1;
            let lastUpdate = globalCases[i].last_update.value;
            globalCases[i].last_update = {};
            globalCases[i].last_update = lastUpdate;
        };
        
        covidDataContent = JSON.stringify(globalCases);

        //Save on REDIS
        await redis.setData(globalCollectionName, covidDataContent, config.redisConfig.ttl);
    }
    
    res.data = JSON.parse(covidDataContent);

    return next();
};
