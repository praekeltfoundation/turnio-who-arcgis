const isonames = require("phone").iso3166_data;

module.exports = function formatMessage(countryData, globalData) {
  const countryName = isonames.find(
    item => countryData.country_code === item.alpha3
  ).country_name;
  return `*Latest numbers*
_Latest data reported by national authorities to the World Health Organization_

*${countryName}*
${countryData.cum_cases} confirmed cases (${
    countryData.new_cases
  } reported today)
${countryData.cum_deaths} deaths (${countryData.new_deaths} reported today)

*Global*
${globalData.cum_cases} confirmed cases (${globalData.new_cases} reported today)
${globalData.cum_deaths} deaths (${globalData.new_deaths} reported today)

*Novel Coronavirus (COVID-19) Situation dashboard*
This interactive dashboard/map provides the latest global numbers and numbers by country of COVID-19 cases on a daily basis.
who.sprnklr.com

*For country numbers, find the latest situation reports here:* https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports
`;
};
