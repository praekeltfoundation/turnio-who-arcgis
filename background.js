const amqp = require('amqplib/callback_api');
const axios = require("axios");

const { sendWithDelay } = require("./send-message");

const TOKENS = JSON.parse(process.env.TOKENS);
const TURN_URL = process.env.TURN_URL;
const AMQP_URL = process.env.AMQP_URL;

function sendBackgroundedMsgsWithDelay(data) {
  msgId = data.messageId
  msgs = data.msgs
  user = data.user
  number = data.number
  delay = data.delay

  if (number === undefined) {
    number = "41798931892";
  }
  const token = TOKENS[number];
  const client = axios.create({
    baseURL: TURN_URL,
    timeout: 300,
    headers: { Authorization: `Bearer ${token}` }
  });
  return sendWithDelay(client, msgId, msgs, user, delay);
}

amqp.connect(AMQP_URL, function(err, conn) {
  conn.createChannel(function(err, ch) {
    const q = 'background';
    ch.assertQueue(q, { durable: true });
    
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, async function(obj) {
      console.log(" [x] Received %s", obj.content.toString());
      
      let data = JSON.parse(obj.content.toString());

      await sendBackgroundedMsgsWithDelay(data);
      ch.ack(obj);
      
    }, { noAck: false });
  });
});
