const constants = require('../constants/constants');
const messages = require('../constants/messages');
const {isNormalInteger} = require('../utils/utils')
const setResponseWithError = require('../utils/common-response').setResponseWithError;


module.exports.validateDay = async (req, res, next) => {
    let day = req.params.day;
    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    if (day) {
        if(isNormalInteger(day)){
            day = parseInt(day);
            if(req.params.day <= monthLength[parseInt(req.params.month) - 1]){
                return next();
            }
            return setResponseWithError(res, constants.NOT_FOUND_ERROR, messages.INVALID_DAY);
        }
        
        return setResponseWithError(res, constants.NOT_FOUND_ERROR, messages.INVALID_DAY);
    }
    

    return setResponseWithError(res, constants.NOT_FOUND_ERROR, messages.DAY_NOT_FOUND);
};
