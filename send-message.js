const axios = require("axios");
const debug = require("debug")("turn");

const TOKEN = process.env.TOKEN;

// const turnMsg = `https://whatsapp.turn.io/v1/messages`;
module.exports = function sendMessage(messageId, body, to) {
  debug(`sending message to ${to} in reply to ${messageId}`);

  return axios
    .create({
      baseURL: "https://whatsapp.turn.io",
      timeout: 300,
      headers: { Authorization: `Bearer ${TOKEN}` },
    })
    .post(
      "/v1/messages",
      {
        preview_url: false,
        recipient_type: "individual",
        to: to,
        type: "text",
        text: {
          body: body,
        },
      },
      {
        headers: {
          "X-Turn-In-Reply-To": messageId,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => response.json());
};
