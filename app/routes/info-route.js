const Router = require('express').Router;
const timeout = require('connect-timeout');
const config = require('../config/config');
const {getBasicStatistics} = require('../actions/get-basic-statistics.js');

const router = Router();
router.get('/basic_statistics', timeout(`${config.timeouts.timer_default}`), getBasicStatistics);
//router.get('/basic_statistics/:year/:month/:date', timeout(`${config.timeouts.timer_default}`), getBasicStatistics);
//router.post('create', timeout(`${config.timeouts.timer_post_mongo}`), createCollection);

module.exports = router;
