const constants = require('../constants/constants');
const messages = require('../constants/messages');
const utils = require('../utils/utils');
const setResponseWithError = require('../utils/common-response').setResponseWithError;


module.exports.validateCountry = async (req, res, next) => {
    let country = req.params.country || req.headers['x-flow-country'];
    if (country) {
        if(utils.allLetter(country)){
            req.country = utils.normalizeCountryName(country)
            return next();
        }
        
        return setResponseWithError(res, constants.BAD_REQUEST_ERROR, messages.INVALID_COUNTRY);
    }
    

    return setResponseWithError(res, constants.NOT_FOUND_ERROR, messages.COUNTRY_NOT_FOUND);
};
