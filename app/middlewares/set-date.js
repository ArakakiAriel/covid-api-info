const constants = require('../constants/constants');
const messages = require('../constants/messages');
const {getFullDate} = require('../utils/date-util');


module.exports.setDate = async (req, res, next) => {
    req.date = {};
    if (req.params.year && req.params.month && req.params.day) {
        req.date.year = req.params.year;
        req.date.month = req.params.month;
        req.date.day = req.params.day;
    }else{
        req.date = getFullDate();    
    }

    return next();
};
