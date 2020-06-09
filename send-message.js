const axios = require("axios");
const debug = require("debug")("turn");
const inspect = require("./inspect");
const phone = require("phone");

const TOKENS = JSON.parse(process.env.TOKENS);
const TURN_URL = process.env.TURN_URL;

const { retrieveCountryData, retrieveGlobalData, retrieveContactLanguage, retrieveLatestNews } = require("./retrieve-data");
const { formatMessage, formatNewsMessage } = require("./format-message");

function sendMessage(client, messageId, body, to) {
  debug(`sending message to ${to} in reply to ${messageId}`);

  return client
    .post(
      "/v1/messages",
      {
        preview_url: false,
        recipient_type: "individual",
        to: to,
        type: "text",
        text: {
          body: body
        }
      },
      {
        headers: {
          "X-Turn-In-Reply-To": messageId,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    )
    .then(response => response.json());
}

async function sendCountryDataBasedOnPhoneNumber(req, res) {
  var who_number = req.query.number;
  if (who_number === undefined) {
    who_number = "41798931892";
  }
  const token = TOKENS[who_number];
  const client = axios.create({
    baseURL: TURN_URL,
    timeout: 300,
    headers: { Authorization: `Bearer ${token}` }
  });

  const user = req.body.contacts[0].wa_id;
  const messageId = req.body.messages[0].id;
  debug(`/stats called for ${user} with message id ${messageId}`);
  const [number, countryCode] = phone(`+${user}`);
  if (!number) {
    return res.json({ country: "unknown" });
  }
  debug(`The country code is: ${countryCode}`);

  const countryData = await retrieveCountryData(countryCode);
  const globalData = await retrieveGlobalData(countryCode);
  const languageCode = await retrieveContactLanguage(client, user);
  const msg = formatMessage(countryData, globalData, languageCode);
  inspect("formatted message:")(msg);
  return sendMessage(client, messageId, msg, user)
    .then(inspect("message response:"))
    .catch(err => {
      if (err.response) {
        inspect("error data")(err.response.data);
        inspect("error status")(err.response.status);
        inspect("error headers")(err.response.headers);
      }
    });
}

async function sendLatestNews(req, res) {
  var who_number = req.query.number;
  if (who_number === undefined) {
    who_number = "41798931892";
  }
  const token = TOKENS[who_number];
  const client = axios.create({
    baseURL: TURN_URL,
    timeout: 300,
    headers: { Authorization: `Bearer ${token}` }
  });

  const user = req.body.contacts[0].wa_id;
  const messageId = req.body.messages[0].id;
  debug(`/news called for ${user} with message id ${messageId}`);

  const newsList = await retrieveLatestNews();
  const msg = formatNewsMessage(newsList, who_number);
  inspect("news message:")(msg);
  return sendMessage(client, messageId, msg, user)
    .then(inspect("message response:"))
    .catch(err => {
      if (err.response) {
        inspect("error data")(err.response.data);
        inspect("error status")(err.response.status);
        inspect("error headers")(err.response.headers);
      }
    });
}

module.exports = {
  sendCountryDataBasedOnPhoneNumber,
  sendMessage,
  sendLatestNews
};
