const express = require('express');
const phone = require('phone');

const {retrieveData} = require('./retrieve-data');
const formatMessage = require('./format-message');
const sendMessage = require('./send-message');

const app = express();

app.use(express.json());

app.post('/stats', async (req, res) => {
    
  const user = req.body.contacts[0].wa_id;
  const claimUuid = req.body.messages[0].id;
  const [number, countryCode] = phone(`+${user}`);
  if (!number) {
    return res.json({ country: "unknown" });
  }

  retrieveData(countryCode)
    .then(casesData => formatMessage(casesData))
    .then(msg => sendMessage(claimUuid, msg, user))
    .then(msgRes => console.log(msgRes))
    .catch(err => {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      }
    });
});

module.exports = app;
