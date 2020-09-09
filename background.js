const amqp = require('amqplib/callback_api');
const axios = require("axios");

const { sendWithDelay } = require("./send-message");

const TOKENS = JSON.parse(process.env.TOKENS);
const TURN_URL = process.env.TURN_URL;
const AMQP_URL = process.env.AMQP_URL;

let AMQP_PREFETCH_COUNT = process.env.AMQP_PREFETCH_COUNT;
if (AMQP_PREFETCH_COUNT === undefined) {
    AMQP_PREFETCH_COUNT = 10
  }

function sendBackgroundedMsgsWithDelay(data){
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

function channel(err, ch){
  const q = 'background';
  ch.assertQueue(q, { durable: true });
  ch.prefetch(AMQP_PREFETCH_COUNT);

  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
  ch.consume(q, async function(obj){
    console.log(" [x] Received %s", obj.content.toString());

    let data = JSON.parse(obj.content.toString());
    await sendBackgroundedMsgsWithDelay(data);

    ch.ack(obj);
  }, { noAck: false });
}

// Only start consumer if it was run from the command line (allows cleaner tests)
if (require.main === module) {
  amqp.connect(AMQP_URL, function(err, conn) {
    conn.createChannel(channel);
  });
}

module.exports = {
  sendBackgroundedMsgsWithDelay,
  channel
};
