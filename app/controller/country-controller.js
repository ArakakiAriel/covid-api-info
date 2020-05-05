const Controller = require('../utils/common-mongoose-controller');
const countryFacade = require('../facades/country-facade');

class CountryController extends Controller {
}

module.exports = new CountryController(countryFacade());
