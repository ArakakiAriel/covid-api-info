const constants = require('../constants/constants');
const config = require('../config/config');
const RedisService = require('../services/redis/redis-service');
const setResponseRaw = require('../utils/common-response').setResponseRaw;
const redis = new RedisService();

//Validate if exist a redis data saved. If exist it will response with the data saved, else it will run the other middlewares.
module.exports.validateArrayOfStatistics = async (req, res, next) => {
    
    let key = config.globalStatistics.redis_key;
    
    let arrayOfStatistics;// = await redis.getData(key);

    if(arrayOfStatistics){
        let response = JSON.parse(arrayOfStatistics);
        return setResponseRaw(res, constants.RESPONSE_OK, response);
    }
    return next();
};
