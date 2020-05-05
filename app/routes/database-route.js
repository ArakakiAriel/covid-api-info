const Router = require('express').Router;
const timeout = require('connect-timeout');
const config = require('../config/config');
const context = require('../../context/default');
const getMiddlewares = require('../utils/get-middleware').getMiddlewares;

const router = Router();
router.get('/:year/:month/:day', timeout(`${config.timeouts.timer_default}`), getMiddlewares(context.middlewares.getStatistics));
//router.post('create', timeout(`${config.timeouts.timer_post_mongo}`), createCollection);

module.exports = router;
