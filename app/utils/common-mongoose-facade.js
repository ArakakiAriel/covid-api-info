const mongoose = require('mongoose');

class Facade {
  constructor(name, schema, collectionName) {
    this.Model = mongoose.model(name, schema, collectionName);
  }

  create(body) {
    const model = new this.Model(body);
    return model.save();
  }

  find(...args) {
    return this.Model.find(...args).exec();
  }

  findOne(...args) {
    return this.Model.findOne(...args).exec();
  }

  findById(...args) {
    return this.Model.findById(...args).exec();
  }

  update(...args) {
    return this.Model.updateOne(...args).exec();
  }

  remove(...args) {
    return this.Model.remove(...args).exec();
  }

  findOnePopulate(...args) {
    return this.Model.findOne(args[0])
      .populate(args[1])
      .exec();
  }
}

module.exports = Facade;
