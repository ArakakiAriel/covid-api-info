const Facade = require('../utils/common-mongoose-facade');
const countrySchema = require('../schemas/country-schema');

class countryFacade extends Facade {
    constructor(collectionName){
        this.collectionName = collectionName;
    }
}

module.exports = new countryFacade('country', countrySchema, this.collectionName);
