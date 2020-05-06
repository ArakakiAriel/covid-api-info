//const controller = require('../app/controllers/country-controller');

module.exports = {
  middlewares: {
    getStatistics: process.env.NODE_CONTEXT_MIDDLEWARES_GET_STATISTICS || [
      'validate-year',
      'validate-month',
      'validate-day',
      'set-date',
      'get-cases-per-date',
      'get-basic-statistics',
      'show-result-raw'
    ],
    getStatisticsToday: process.env.NODE_CONTEXT_MIDDLEWARES_GET_STATISTICS_TODAY || [
      'set-date',
      'get-cases-per-date',
      'get-basic-statistics',
      'show-result-raw'
      // 'check-country-middleware',
      // 'validate-doc-type-middleware',
      // 'validate-doc-number-middleware',
      // 'confirm-user-profile-middleware',
      // (req, res, next) => controller.create(req, res, next),
      // 'delete-user-profile-redis-middleware'
    ],
    getInfoFromDatabase: process.env.NODE_CONTEXT_MIDDLEWARES_GET_USER_PROFILE_ID || [
      // 'validate-profile-id-middleware',
      // 'get-user-profile-by-id-middleware',
      // (req, res) => controller.findOne(req, res)
    ],
    getCasesToday: process.env.NODE_CONTEXT_MIDDLEWARES_GET_CASES || [
      'set-date',
      'get-cases-per-date',
      'show-result-raw'
    ],
    getCasesCertainDate: process.env.NODE_CONTEXT_MIDDLEWARES_GET_CASES || [
      'validate-year',
      'validate-month',
      'validate-day',
      'set-date',
      'get-cases-per-date',
      'show-result-raw'
    ],
    getCasesPerCountry: process.env.NODE_CONTEXT_MIDDLEWARES_GET_CASES_PER_COUNTRY || [
      'validate-country',
      'get-cases-per-country',
      'show-result-raw'
    ]
  }
};
