const constants = require('../constants/constants');
const messages = require('../constants/messages');
const {getFullDate} = require('../utils/date-util');
const {isNormalInteger} = require('../utils/utils')
const setResponseWithError = require('../utils/common-response').setResponseWithError;


module.exports.validateYear = async (req, res, next) => {
    let year = req.params.year;
    if (year) {
        if(isNormalInteger(year)){
            year = parseInt(year);
            if(req.params.year <= parseInt(todaysDate.year)){
                return next();
            }
            return setResponseWithError(res, constants.NOT_FOUND_ERROR, messages.INVALID_YEAR);
        }
        
        return setResponseWithError(res, constants.NOT_FOUND_ERROR, messages.INVALID_YEAR);
    }
    

    return setResponseWithError(res, constants.NOT_FOUND_ERROR, messages.YEAR_NOT_FOUND);
};
