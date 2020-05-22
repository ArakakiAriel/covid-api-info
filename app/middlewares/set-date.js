const constants = require('../constants/constants');
const messages = require('../constants/messages');
const {getFullDate} = require('../utils/date-util');
const {removeFrontZeros} = require('../utils/utils')


module.exports.setDate = async (req, res, next) => {
    req.date = {};
    if (req.params.year && req.params.month && req.params.day) {
        let day = removeFrontZeros(req.params.day);
        let month = removeFrontZeros(req.params.month);
        let year = removeFrontZeros(req.params.year);
        
        req.date = getFullDate(day, month, year);

        console.log(req.date);
    }else{
        req.date = getFullDate();    
    }

    return next();
};
