const constants = require('../constants/constants');
const messages = require('../constants/messages');
const setResponseRaw = require('../utils/common-response').setResponseRaw;
//const bigQueryUtils = require('../utils/big-query-utils');

module.exports.getBasicStatistics = (req, res) => {
  let year = req.params.year;
  let month = req.params.month;
  let day = req.params.day;
  
  if(year && month && day){
    return setResponseRaw(res, 200, {
      year,
      month,
      day
    });
  }


  return setResponseRaw(res, 200, {globalDate});
  };
  