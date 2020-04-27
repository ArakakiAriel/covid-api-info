const Router = require('express').Router;
const timeout = require('connect-timeout');
const config = require('../config/config');
const createCollection = require('../actions/create-collection');
const getCollection = require('../actions/get-collection.js');

const router = Router();
router.get('/:year/:month/:day', timeout(`${config.timeouts.timer_default}`), (req,res) => {});
//router.post('create', timeout(`${config.timeouts.timer_post_mongo}`), createCollection);

module.exports = router;
