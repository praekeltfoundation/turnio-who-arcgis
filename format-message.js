const isonames = require("phone").iso3166_data;

module.exports = function formatMessage(countryData, globalData, languageCode) {
  const countryName = isonames.find(
    item => countryData.country_code === item.alpha3
  ).country_name;
  switch (languageCode) {
    case "ITA":
      return ita_template(countryName, countryData, globalData);
    default:
      return eng_template(countryName, countryData, globalData);
  }
};

const eng_template = (countryName, countryData, globalData) => `*Latest numbers*
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
https://covid19.who.int/

*For country numbers, find the latest situation reports here:* https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports
`;

const ita_template = (countryName, countryData, globalData) => `*Ultimi casi* 🔢
_Dati segnalati dalle autorità nazionali entro le 10:00 CET  X month 2020_

Totale (nuovi) casi nelle ultime 24 ore

*${countryName}*
${countryData.cum_cases} confermati (${
    countryData.new_cases
  })
${countryData.cum_deaths} morti (${countryData.new_deaths})

*A livello globale*
${globalData.cum_cases} confermati (${globalData.new_cases})
${globalData.cum_deaths} morti (${globalData.new_deaths})

*Cruscotto situazione romanzo di Coronavirus (COVID-19)*
Questa dashboard / mappa interattiva fornisce gli ultimi numeri globali e numeri per paese di casi COVID-19 su base giornaliera.

*Per i numeri dei paesi, trova gli ultimi rapporti sulla situazione qui:*
https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports
`;
