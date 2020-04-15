const axios = require('axios').default

const ENVIRONMENT = process.env.ENVIRONMENT || 'dev'
const conf = require(`./conf.${ENVIRONMENT}.json`)

const turnMsg = `https://whatsapp.turn.io/v1/messages`
module.exports = function sendMessage (claimUuid, body, to) {
  return axios({
    method: 'post',
    url: turnMsg,
    headers: {
      "Authorization": `Bearer ${conf.token}`,
      "X-Turn-Claim-Extend": claimUuid,
      "Content-Type": "application/json",
    },
    body: {
      "preview_url": false,
      "recipient_type": "individual",
      "to": to,
      "type": "text",
      "text": {
          "body": body
        }
    }
  })
  .then(res => res.json())
}