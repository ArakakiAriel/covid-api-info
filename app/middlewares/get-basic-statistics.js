
const {formatCertainDate} = require('../utils/date-util');

module.exports.getBasicStatistics = (req, res, next) => {
  let info = res.data;
  let totalConfirmedCases = 0;
  let totalActiveCases = 0;
  let totalRecovered = 0;
  let totalDeaths = 0;
  let totalClosedCases = 0;
  let updatedDate = info[0].updated_date;

  for(let i = 0; i < info.length; i++){
    totalConfirmedCases += info[i].total.confirmed;
    totalActiveCases += info[i].total.actives;
    totalRecovered += info[i].total.recovered;
    totalDeaths += info[i].total.deaths;
  }
  totalClosedCases = totalRecovered + totalDeaths;
  res.data = {};
  res.data = {
    infected_countries: info.length,
    total:{
      confirmed: totalConfirmedCases,
      actives: totalActiveCases,
      deaths: totalDeaths,
      recovered: totalRecovered,
      closed_cases: totalClosedCases
    },
    percentage: {
      actives : `${(totalActiveCases / totalConfirmedCases * 100).toFixed(2)}%`,
      deaths : `${(totalDeaths / totalConfirmedCases * 100).toFixed(2)}%`,
      recovered : `${(totalRecovered / totalConfirmedCases * 100).toFixed(2)}%`,
      closed_cases : `${(totalClosedCases / totalConfirmedCases * 100).toFixed(2)}%`,
      mortality_rate: `${(totalDeaths / (totalDeaths + totalRecovered) * 100).toFixed(2)}%`,
    },
    date: updatedDate,
  }
  return next();
  };
  