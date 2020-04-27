const messages = require('../constants/messages');

function setResponseWithError(res, status, message, code = messages.RESPONSE_NOK_STATUS_MESSAGE) {
  return res.status(status).send({ code, message });
}

function setResponseWithErrorCode(res, status, message) {
  return res.status(status).send({ status, message });
}

function setResponseWithOk(res, status, message, code = messages.RESPONSE_OK_STATUS_MESSAGE) {
  return res.status(status).send({ code, message });
}

function setResponseRaw(res, status, message) {
  return res.status(status).send(message);
}

module.exports.setResponseWithError = setResponseWithError;
module.exports.setResponseWithOk = setResponseWithOk;
module.exports.setResponseRaw = setResponseRaw;
module.exports.setResponseWithErrorCode = setResponseWithErrorCode;
