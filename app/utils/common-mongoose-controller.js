const commonResponse = require('../utils/common-response');
const codes = require('../constants/constants');
const messages = require('../constants/messages');
const logger = require('fif-common-node-logger').Logger.getLogger();

class Controller {
  constructor(facade) {
    this.facade = facade;
  }

  async create(req, res, next) {
    try {
      const doc = await this.facade.create(req.body);

      if (next) {
        req.doc = doc.toObject();
        return next();
      }

      return commonResponse.setResponseWithOkWithMarshaller(res, codes.RESPONSE_OK_CREATED,
        messages.RESPONSE_OK_CREATED, doc, data => data);
    } catch (err) {

      if (err.code === codes.DUPLICATE_KEY_ERROR) {
        return commonResponse.setResponseWithError(res, codes.BAD_REQUEST_ERROR,
          messages.EXISTING_COUNTRY_KEY);
      }
      return commonResponse.setResponseWithError(res, codes.INTERNAL_ERROR,
        messages.INTERNAL_ERROR);
    }
  }

  find(req, res) {
    return this.facade
      .find(req.query)
      .then(collection => res.status(200).json(collection))
      .catch(err => res.send(err.status || codes.INTERNAL_ERROR, err.json || err));
  }

  async findOne(req, res, next) {
    try {
      const doc = await this.facade.findOne(req.query);

      if (!doc) {
        return commonResponse.setResponseWithError(res, codes.NOT_FOUND_ERROR,
          messages.MONGO_ENTITY_NOT_FOUND);
      }

      if (next) {
        req.doc = doc.toObject();
        return next();
      }

      return commonResponse.setResponseRaw(res, codes.RESPONSE_OK, doc);
    } catch (err) {
      return commonResponse.setResponseWithError(res, codes.INTERNAL_ERROR,
        messages.INTERNAL_ERROR);
    }
  }

  findById(req, res) {
    return this.facade
      .findById(req.params.id)
      .then((doc) => {
        if (!doc) {
          return res.sendStatus(codes.NOT_FOUND_ERROR);
        }
        return res.status(200).json(doc);
      })
      .catch(err => res.send(err.status || codes.INTERNAL_ERROR, err.json || err));
  }

  getUpdateOptions(executionParams) {
    const options = {};
    options.new = executionParams.new ? executionParams.new : false;
    options.multi = executionParams.multi ? executionParams.multi : false;
    return options;
  }

  async update(req, res, next) {
    try {
      req.executionParams = req.executionParams ? req.executionParams : {};

      const options = this.getUpdateOptions(req.executionParams);
      const results = await this.facade.update(req.query, req.body, options);

      if (results.n < 1) {
        return commonResponse.setResponseWithError(res, codes.NOT_FOUND_ERROR,
          messages.NOT_FOUND_ERROR);
      }

      if (results.nModified < 1) {
        return commonResponse.setResponseWithError(res, codes.RESPONSE_REDIRECTION_NO_MODIFIED,
          messages.RESPONSE_REDIRECTION_NO_MODIFIED);
      }

      let doc;
      if (req.executionParams.executeFind) {
        doc = results.nModified === 1
          ? doc = await this.facade.findOne(req.query)
          : doc = await this.facade.find(req.query);
        req.doc = doc.toObject();
      }

      if (next) {
        return next();
      }

      return doc
        ? commonResponse.setResponseWithOkWithMarshaller(res, codes.RESPONSE_OK,
          messages.RESPONSE_OK_MODIFIED, doc, data => data)
        : commonResponse.setResponseWithOk(res, codes.RESPONSE_OK, messages.RESPONSE_OK_MODIFIED);
    } catch (err) {
        return commonResponse.setResponseWithError(res, codes.INTERNAL_ERROR,
        messages.INTERNAL_ERROR);
    }
  }

  remove(req, res) {
    this.facade
      .remove({ _id: req.params.id })
      .then((doc) => {
        if (!doc) {
          return res.sendStatus(codes.NOT_FOUND_ERROR);
        }
        return res.sendStatus(codes.RESPONSE_OK_NO_CONTENT);
      })
      .catch(err => res.send(err.status || codes.INTERNAL_ERROR, err.json || err));
  }
}

module.exports = Controller;
