const constants = require('../constants/constants');
const messages = require('../constants/messages');
const setResponseRaw = require('../utils/common-response').setResponseRaw;
//const bigQueryUtils = require('../utils/big-query-utils');

module.exports.getBasicStatistics = (req, res) => {
    
    return setResponseRaw(res, 200, {globalDate});
  };
  