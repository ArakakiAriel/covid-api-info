
const {subtractDay} = require('../utils/date-util');

module.exports.setNextDate = (req, res, next) => {

    if(!req.arrayOfStatistics){
        req.arrayOfStatistics = [];
    }
    req.arrayOfStatistics.push(res.data);

    let newDate = subtractDay(1,res.data.date);
    req.params = {};
    req.params.year = newDate.year;
    req.params.month = newDate.month;
    req.params.day = newDate.day;
  
    return next();
};
  