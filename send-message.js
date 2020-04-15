const axios = require("axios").default;
const debug = require("debug")("turn");

const TOKEN = process.env.TOKEN;

const turnMsg = `https://whatsapp.turn.io/v1/messages`;
module.exports = function sendMessage(messageId, body, to) {
  debug(`sending message to ${to} in reply to ${messageId}`);
  return axios({
    method: "post",
    url: turnMsg,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "X-Turn-In-Reply-To": messageId,
      "Content-Type": "application/json"
    },
    body: {
      preview_url: false,
      recipient_type: "individual",
      to: to,
      type: "text",
      text: {
        body: body
      }
    }
  }).then(res => res.json());
};
