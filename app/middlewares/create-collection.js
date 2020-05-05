const constants = require('../constants/constants');
const messages = require('../constants/messages');
const setResponseWithError = require('../utils/common-response').setResponseWithError;
const bigQueryUtils = require('../utils/big-query-utils');

module.exports.createCollection = (req, res) => {
    const country = req.headers['x-flow-country'];
    if (!country) {
      logger.error({ module: 'UserProfile', method: 'checkCountryMiddleware', error_code: constants.BAD_REQUEST_ERROR, description: messages.COUNTRY_NOT_FOUND, data_object: { country } });
      return setResponseWithError(res, constants.BAD_REQUEST_ERROR, messages.COUNTRY_NOT_FOUND);
    }
    if (validations.isValidCountry(country)) {
      req.headers['x-flow-country'] = req.headers['x-flow-country'].toLowerCase();
      return next();
    }
  
    logger.error({ module: 'UserProfile', method: 'checkCountryMiddleware', error_code: constants.BAD_REQUEST_ERROR, description: messages.NOK_COUNTRY, data_object: { country } });
    return setResponseWithError(res, constants.BAD_REQUEST_ERROR, messages.NOK_COUNTRY);
  };
  