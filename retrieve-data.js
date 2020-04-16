const axios = require("axios").default;
const debug = require("debug")("turn");
const { Statistics } = require("./models");

function shouldNotHaveToUpdate(dataObj) {
  const hourInMs = 60 * 60 * 1000;
  return Date.now() - new Date(dataObj.updatedAt) < hourInMs;
}

function retrieveData(countryCode) {
  return Statistics.findAll({
    where: {
      country_code: countryCode
    },
    order: [["updatedAt", "DESC"]]
  }).then(obj => {
    if (obj && shouldNotHaveToUpdate(obj)) {
      return obj;
    }

    return retrieveFromArcGis(countryCode)
      .then(data => {
        const features = data.features.sort(
          (a, b) => a.attributes.date_epicrv - b.attributes.date_epicrv
        );
        const latest = features.pop().attributes;
        return Statistics.create({
          country_code: countryCode,
          updated: latest.date_epicrv,
          new_cases: latest.NewCase,
          cum_cases: latest.CumCase,
          new_deaths: latest.NewDeath,
          cum_deaths: latest.CumDeath
        });
      })
      .catch(err => {
        console.error(err.response);
      });
  });
}

const query = country =>
  `query?where=ISO_3_CODE+%3D+'${country}'&returnGeometry=false&outFields=NewCase,CumCase,NewDeath,CumDeath,date_epicrv&f=json`;

const featureServerUrl =
  "https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/COVID19_hist_cases_adm0_v5_view/FeatureServer/0";

function retrieveFromArcGis(countryCode) {
  debug("retrieving from ArcGIS");
  return axios({
    method: "get",
    url: `${featureServerUrl}/${query(countryCode)}`
  }).then(res => res.data);
}

module.exports = {
  retrieveData: retrieveData,
  retrieveFromArcGis: retrieveFromArcGis,
  shouldNotHaveToUpdate: shouldNotHaveToUpdate
};
