
const {formatCertainDate} = require('../utils/date-util');

module.exports.getBasicStatistics = (req, res, next) => {
  let info = res.data;
  let totalConfirmedCases = 0;
  let totalActiveCases = 0;
  let totalRecovered = 0;
  let totalDeaths = 0;
  let totalClosedCases = 0;

  for(let i = 0; i < info.length; i++){
    totalConfirmedCases += info[i].total.confirmed;
    totalActiveCases += info[i].total.actives;
    totalRecovered += info[i].total.recovered;
    totalDeaths += info[i].total.deaths;
  }
  totalClosedCases = totalRecovered + totalDeaths;
  res.data = {};
  res.data = {
    // total:{
    //   confirmed:
    //   actives:
    //   deaths:
    //   recovered:
    // }
    date: formatCertainDate(req.date),
    infected_countries: info.length,
    confirmed_cases: totalConfirmedCases,
    active_cases: totalActiveCases,
    deaths_cases: totalDeaths,
    recovered_cases: totalRecovered,
    closed_cases: totalClosedCases
  }
  return next();
  };
  