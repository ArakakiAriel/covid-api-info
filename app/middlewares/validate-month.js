const constants = require('../constants/constants');
const messages = require('../constants/messages');
const {isNormalInteger} = require('../utils/utils')
const setResponseWithError = require('../utils/common-response').setResponseWithError;


module.exports.validateMonth = async (req, res, next) => {
    let month = req.params.month;
    if (month) {
        if(isNormalInteger(month)){
            month = parseInt(month);
            if(req.params.month <= 12){
                return next();
            }
            return setResponseWithError(res, constants.NOT_FOUND_ERROR, messages.INVALID_MONTH);
        }
        
        return setResponseWithError(res, constants.NOT_FOUND_ERROR, messages.INVALID_MONTH);
    }
    

    return setResponseWithError(res, constants.NOT_FOUND_ERROR, messages.MONTH_NOT_FOUND);
};
