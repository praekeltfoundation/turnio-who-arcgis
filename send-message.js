const axios = require("axios");
const debug = require("debug")("turn");
const inspect = require("./inspect");
const phone = require("phone");

const TOKEN = process.env.TOKEN;

const { retrieveCountryData, retrieveGlobalData } = require("./retrieve-data");
const formatMessage = require("./format-message");

const client = axios.create({
  baseURL: "https://whatsapp.turn.io",
  timeout: 300,
  headers: { Authorization: `Bearer ${TOKEN}` }
});

function sendMessage(messageId, body, to) {
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
  const msg = formatMessage(countryData, globalData);
  inspect("formatted message:")(msg);
  return sendMessage(messageId, msg, user)
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
  sendMessage
};
