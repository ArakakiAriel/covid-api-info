
const {formatCertainDate, differenceBetweenDates} = require('../utils/date-util');

module.exports.getCountryCasesGrowth = (req, res, next) => {
  let info = res.data;
  let infoSize = info.length;
  let data = [];

  for(let i = 0; i < infoSize - 1; i++){
    let recentDate = info[i];
    let previousDate = info[i+1];

    let statistics = {
      country: recentDate.country,
      date: recentDate.updated_date,
      previous_date: previousDate.updated_date,
      new_confirmed_cases: recentDate.total.confirmed - previousDate.total.confirmed,
      new_active_cases: recentDate.total.actives - previousDate.total.actives,
      new_recovered_cases: recentDate.total.recovered - previousDate.total.recovered,
      new_death_cases: recentDate.total.deaths - previousDate.total.deaths,
      days_since_previous_update: differenceBetweenDates(recentDate.updated_date, previousDate.updated_date)
    };

    data.push(statistics);
  }

  res.data = {};
  res.data = data;
  return next();
};
  