
const {formatCertainDate, differenceBetweenDates} = require('../utils/date-util');

module.exports.getCountryCasesGrowth = (req, res, next) => {
  let info = res.data;
  let infoSize = info.length;
  let data = [];
  try {
    for(let i = 0; i < infoSize - 1; i++){
      let recentDate = info[i];
      let previousDate = info[i+1];
      let newConfirmedCases = recentDate.total.confirmed - previousDate.total.confirmed;
  
      let statistics = {
        country: recentDate.country,
        date: recentDate.updated_date,
        previous_date: previousDate.updated_date,
        new_confirmed_cases: newConfirmedCases,
        new_active_cases: recentDate.total.actives - previousDate.total.actives,
        new_recovered_cases: recentDate.total.recovered - previousDate.total.recovered,
        new_death_cases: recentDate.total.deaths - previousDate.total.deaths,
        growth_factor: (Math.log(newConfirmedCases) / Math.log(previousDate.total.actives)).toFixed(2),
        days_since_previous_update: differenceBetweenDates(recentDate.updated_date, previousDate.updated_date)
      };
  
      data.push(statistics);
    }
    if(infoSize == 1){

      data = [{
        "country": info[0].country,
        "date": info[0].updated_date,
        "previous_date": info[0].updated_date,
        "new_confirmed_cases": 0,
        "new_active_cases": 0,
        "new_recovered_cases": 0,
        "new_death_cases": 0,
        "growth_factor": "NaN",
        "days_since_previous_update": 0
      }];
    }
  } catch (error) {
    console.log(error);
  }
  

  res.data = {};
  res.data = data;
  return next();
};
  