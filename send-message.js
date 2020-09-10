const axios = require("axios");
const debug = require("debug")("turn");
const inspect = require("./inspect");
const phone = require("phone");
const amqp = require('amqplib');

const { retrieveCountryData, retrieveGlobalData, retrieveContactLanguage, retrieveLatestNews } = require("./retrieve-data");
const { formatMessage, formatNewsMessage, formatHomepageMessages } = require("./format-message");

const TOKENS = JSON.parse(process.env.TOKENS);
const TURN_URL = process.env.TURN_URL;
const AMQP_URL = process.env.AMQP_URL;

var amqp_ch = amqp.connect(AMQP_URL).then(function(conn) {
  return conn.createChannel();
});

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

function sendWithDelay(client, messageId, msgs, user, delay) {
  msg = msgs.shift();

  return sendMessage(client, messageId, msg, user)
    .then(
      setTimeout(function() {
        if (msgs.length > 0) {
          return sendWithDelay(client, messageId, msgs, user, delay);
        }
      }, delay))
    .then(inspect("message response:"))
    .catch(err => {
      if (err.response) {
        inspect("error data")(err.response.data);
        inspect("error status")(err.response.status);
        inspect("error headers")(err.response.headers);
      }
    });
}

function sendToBackground(content) {
  amqp_ch.then(async function(ch) {
    const q = 'background';
    return ch.assertQueue(q, { durable: true })
      .then(function(ok) {
        ch.sendToQueue(q, Buffer.from(JSON.stringify(content)), { persistent: true });
        console.log("Message sent to queue : ", content);
      });
  });
}

async function sendHomepage(req, res) {
  var who_number = req.query.number;
  if (who_number === undefined) {
    who_number = "41798931892";
  }
  var delay = parseInt(req.query.delay, 10);
  if (delay === undefined || isNaN(delay) || delay > 20000) {
    delay = 2000;
  }

  const user = req.body.contacts[0].wa_id;
  const messageId = req.body.messages[0].id;
  debug(`/homepage called for ${user} with message id ${messageId}`);
  const [number, countryCode] = phone(`+${user}`);
  if (!number) {
    return res.json({ country: "unknown" });
  }
  debug(`The country code is: ${countryCode}`);

  const countryData = await retrieveCountryData(countryCode);
  const newsList = await retrieveLatestNews();

  const msgs = formatHomepageMessages(countryData, newsList);
  inspect("homepage stats message:")(msgs[0]);
  inspect("homepage news message:")(msgs[1]);

  return sendToBackground({
    "messageId":messageId,
    "msgs":msgs,
    "user":user,
    "number":who_number,
    "delay": delay
  })
}

module.exports = {
  sendCountryDataBasedOnPhoneNumber,
  sendMessage,
  sendLatestNews,
  sendHomepage,
  sendWithDelay
};
