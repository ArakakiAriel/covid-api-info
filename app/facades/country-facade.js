const Facade = require('../utils/common-mongoose-facade');
const countrySchema = require('../schemas/country-schema');

class countryFacade extends Facade {
    
}

module.exports = new countryFacade('country', countrySchema, globalCollectionName);
