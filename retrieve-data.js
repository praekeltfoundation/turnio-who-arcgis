const axios = require("axios").default;
const debug = require("debug")("turn");
const { Op } = require("sequelize");
const Parser = require('rss-parser');
const parser = new Parser();

const { Statistics } = require("./models");

function shouldNotHaveToUpdate(dataObj) {
  const hourInMs = 60 * 60 * 1000;
  const diffMoreThanHour = new Date() - new Date(dataObj.updatedAt) < hourInMs;
  debug(`Difference is less than an hour: ${diffMoreThanHour}`);
  return diffMoreThanHour;
}

function lessThanADayOld(dataObj) {
  const dayInMs = 24 * 60 * 60 * 1000;
  const diffLessThanADay = new Date() - new Date(dataObj.updatedAt) < dayInMs;
  debug(`Difference is less than a day: ${diffLessThanADay}`);
  return diffLessThanADay;
}

function retrieveCountryData(countryCode) {
  return Statistics.findOne({
    where: {
      country_code: countryCode
    },
    order: [["updatedAt", "DESC"]]
  }).then(obj => {
    debug("Data from database", JSON.stringify(obj));
    if (obj && shouldNotHaveToUpdate(obj)) {
      return obj;
    }

    return retrieveCountryStatsFromArcGis(countryCode)
      .then(data => {
        const features = data.features.sort(
          (a, b) => a.attributes.date_epicrv - b.attributes.date_epicrv
        );
        const latest = features.pop().attributes;
        let yesterday = features.pop();
        if (yesterday) {
          yesterday = yesterday.attributes;
        }
        // If WHO probably hasn't updated their numbers for the day return 
        // our cached value or yesterday's value
        if (latest.NewCase==0 && latest.NewDeath==0)  {
          if (obj && lessThanADayOld(obj)) {
            return obj;
          }
          if (yesterday && yesterday.NewCase!=0) {
            return Statistics.create({
              country_code: countryCode,
              country_code_2: yesterday.ISO_2_CODE,
              updated: yesterday.date_epicrv,
              new_cases: yesterday.NewCase,
              cum_cases: yesterday.CumCase,
              new_deaths: yesterday.NewDeath,
              cum_deaths: yesterday.CumDeath
            });
          }
        }
        return Statistics.create({
          country_code: countryCode,
          country_code_2: latest.ISO_2_CODE,
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

function retrieveGlobalData() {
  return Statistics.findOne({
    where: {
      country_code: "Global",
      [Op.not]: {
        cum_cases: null
      }
    },
    order: [["updatedAt", "DESC"]]
  }).then(obj => {
    debug("Data from database", JSON.stringify(obj));
    if (obj && shouldNotHaveToUpdate(obj)) {
      return obj;
    }

    return retrieveGlobalStatsFromArcGis()
      .then(data => {
        const features = data.features.sort(
          (a, b) => a.attributes.date_epicrv - b.attributes.date_epicrv
        );
        const latest = features.pop().attributes;
        // Sometimes the endpoint gives us some strange data so if the cumulative cases
        // is empty or has gone down then use the cached value
        if (obj && (latest.CumCase === null || latest.CumCase < obj.cum_cases)){
          return obj;
        }
        return Statistics.create({
          country_code: "Global",
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

// This super fugly URL takes a statistic object as one of the parameters in a json format
// This statistic works because it takes as a parameter the update field: `date_epicrv`
/* [
  {"statisticType": "sum","onStatisticField": "CumCase","outStatisticFieldName": "CumCase"},
  {"statisticType": "sum","onStatisticField": "CumDeath","outStatisticFieldName": "CumDeath"},
  {"statisticType": "sum","onStatisticField": "NewCase","outStatisticFieldName": "NewCase"},
  {"statisticType": "sum","onStatisticField": "NewDeath","outStatisticFieldName": "NewDeath"}
]
*/

const globalStats = date =>
  `query?where=date_epicrv+%3D+'${date}'&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=NewCase%2CNewDeath%2Cdate_epicrv%2CADM0_name&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=%5B%7B%22statisticType%22%3A+%22sum%22%2C%22onStatisticField%22%3A+%22NewCase%22%2C%22outStatisticFieldName%22%3A+%22NewCase%22%7D%2C%0D%0A%7B%22statisticType%22%3A+%22sum%22%2C%22onStatisticField%22%3A+%22CumCase%22%2C%22outStatisticFieldName%22%3A+%22CumCase%22%7D%2C%0D%0A%7B%22statisticType%22%3A+%22sum%22%2C%22onStatisticField%22%3A+%22CumDeath%22%2C%22outStatisticFieldName%22%3A+%22CumDeath%22%7D%2C%7B%22statisticType%22%3A+%22sum%22%2C%22onStatisticField%22%3A+%22NewDeath%22%2C%22outStatisticFieldName%22%3A+%22NewDeath%22%7D%0D%0A%5D&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=`;

const query = country =>
  `query?where=ISO_3_CODE+%3D+'${country}'&returnGeometry=false&outFields=NewCase,CumCase,NewDeath,CumDeath,date_epicrv,ISO_2_CODE&f=json`;

const featureServerUrl =
  "https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/COVID_19_Historic_cases_by_country_pt_v7_view/FeatureServer/0";

function retrieveCountryStatsFromArcGis(countryCode) {
  debug("retrieving from ArcGIS");
  return axios.get(
    `${featureServerUrl}/${query(countryCode)}`
  ).then(res => res.data);
}

function retrieveGlobalStatsFromArcGis() {
  const usFormatDate = new Intl.DateTimeFormat("en-US").format(new Date());
  debug("retrieving from ArcGIS");
  return axios.get(
    `${featureServerUrl}/${globalStats(usFormatDate)}`
  ).then(res => res.data);
}

function retrieveContactLanguage(client, msisdn) {
  debug("retrieving contact from Turn");
  return client
    .get(
      `/v1/contacts/${msisdn}/profile`,
      {
        headers: {
          "Accept": "application/vnd.v1+json"
        },
      }).then(res => res.data.fields.language)
      .catch(err => {
        console.error(err.message);
      });
}

const rssFeedUrl = "https://www.who.int/rss-feeds/news-english.xml";

async function retrieveLatestNews() {
  debug("retrieving from RSS");
  return feed = await parser.parseURL(rssFeedUrl)
}

module.exports = {
  retrieveCountryData: retrieveCountryData,
  retrieveGlobalData: retrieveGlobalData,
  retrieveCountryStatsFromArcGis: retrieveCountryStatsFromArcGis,
  retrieveGlobalStatsFromArcGis: retrieveGlobalStatsFromArcGis,
  shouldNotHaveToUpdate: shouldNotHaveToUpdate,
  lessThanADayOld: lessThanADayOld,
  retrieveContactLanguage: retrieveContactLanguage,
  retrieveLatestNews: retrieveLatestNews
};
