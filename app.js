const express = require("express");
const phone = require("phone");
const debug = require("debug")("turn");

const { retrieveData } = require("./retrieve-data");
const formatMessage = require("./format-message");
const sendMessage = require("./send-message");

const app = express();

const inspect = label => {
  return value => {
    debug(label, value);
    return value;
  };
};

app.use(express.json());

app.post("/stats", async (req, res) => {
  const user = req.body.contacts[0].wa_id;
  const messageId = req.body.messages[0].id;
  debug(`/stats called for ${user} with message id ${messageId}`);
  const [number, countryCode] = phone(`+${user}`);
  if (!number) {
    return res.json({ country: "unknown" });
  }
  debug(`The country code is: ${countryCode}`);

  retrieveData(countryCode)
    .then(inspect("cases data:"))
    .then(casesData => formatMessage(casesData))
    .then(inspect("formatted message:"))
    .then(msg => sendMessage(messageId, msg, user))
    .then(inspect("message response:"))
    .catch(err => {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      }
    });
});

module.exports = app;
