const Router = require('express').Router;
const timeout = require('connect-timeout');
const config = require('../config/config');
const context = require('../../context/default');
const getMiddlewares = require('../utils/get-middleware').getMiddlewares;

const router = Router();
router.get('/:year/:month/:day', timeout(`${config.timeouts.timer_query}`), getMiddlewares(context.middlewares.getCasesCertainDate));
router.get('/today', timeout(`${config.timeouts.timer_query}`), getMiddlewares(context.middlewares.getCasesToday));
router.get('/basic_statistics/:year/:month/:day', timeout(`${config.timeouts.timer_default}`), getMiddlewares(context.middlewares.getStatistics));
router.get('/basic_statistics', timeout(`${config.timeouts.timer_default}`), getMiddlewares(context.middlewares.getStatisticsToday));
//router.get('/:day/:month/:year', timeout(`${config.timeouts.timer_default}`), getMiddlewares(context.middlewares.getStatisticsToday));
//router.post('create', timeout(`${config.timeouts.timer_post_mongo}`), createCollection);

module.exports = router;
