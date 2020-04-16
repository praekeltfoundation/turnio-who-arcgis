const isonames = require("phone").iso3166_data;

module.exports = function formatMessage(data) {
  const countryName = isonames.find(item => data.country_code === item.alpha3)
    .country_name;
  return `Total (new) cases in last 24 hours

*${countryName}*
${data.cum_cases} confirmed cases (${data.new_cases})
${data.cum_deaths} deaths (${data.new_deaths})
`;
};
