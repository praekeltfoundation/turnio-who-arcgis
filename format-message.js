const isonames = require("phone").iso3166_data;

module.exports = function formatMessage(data) {
  const countryName = isonames.find(item => data.country_code === item.alpha3)
    .country_name;
  return `*Latest numbers*
_Latest data reported by national authorities to the World Health Organization_

*${countryName}*
${data.cum_cases} confirmed cases (${data.new_cases} reported today)
${data.cum_deaths} deaths (${data.new_deaths} reported today)

*Novel Coronavirus (COVID-19) Situation dashboard*
This interactive dashboard/map provides the latest global numbers and numbers by country of COVID-19 cases on a daily basis.
who.sprnklr.com

*For country numbers, find the latest situation reports here:* https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports
`;
};
