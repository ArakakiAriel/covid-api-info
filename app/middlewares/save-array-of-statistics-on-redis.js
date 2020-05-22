const constants = require('../constants/constants');
const messages = require('../constants/messages');
const config = require('../config/config');
const RedisService = require('../services/redis/redis-service');
const {normalizeCountries} = require('../utils/utils');
const {BigQuery} = require('@google-cloud/bigquery');

const redis = new RedisService();

module.exports.saveArrayOfStatisticsOnRedis = async (req, res, next) => {
    
    let key = config.globalStatistics.redis_key;

    await redis.setData(key, JSON.stringify(req.arrayOfStatistics));
    res.data = req.arrayOfStatistics;

    return next();
};
