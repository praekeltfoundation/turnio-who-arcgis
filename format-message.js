const isonames = require("phone").iso3166_data;

module.exports = function formatMessage(data) {
  const countryName = isonames.find(item => data.country_code === item.alpha3)
    .country_name;
  return `Total (new) cases in last 24 hours

*${countryName}*
X confirmed cases: ${data.cum_cases}
X deaths: ${data.cum_deaths}

*Global*
X confirmed cases (Y)
X deaths (Y)
X countries, areas or territories with cases (Y)
`;
};
