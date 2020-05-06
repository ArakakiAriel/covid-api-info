
const {formatCertainDate} = require('../utils/date-util');

module.exports.getBasicStatistics = (req, res, next) => {
  let info = res.data;
  let totalConfirmedCases = 0;
  let totalActiveCases = 0;
  let totalRecovered = 0;
  let totalDeaths = 0;
  let totalClosedCases = 0;

  for(let i = 0; i < info.length; i++){
    totalConfirmedCases += info[i].total_confirmed;
    totalActiveCases += info[i].total_active_cases;
    totalRecovered += info[i].total_recovered;
    totalDeaths += info[i].total_deaths;
  }
  totalClosedCases = totalRecovered + totalDeaths;
  res.data = {};
  res.data = {
    date: formatCertainDate(req.date),
    confirmed_cases: totalConfirmedCases,
    active_cases: totalActiveCases,
    deaths_cases: totalDeaths,
    recovered_cases: totalRecovered,
    closed_cases: totalClosedCases
  }
  return next();
  };
  