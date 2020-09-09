const amqplib = require('amqplib');
const mockAmqplib = require('mock-amqplib');

// Mock amqp connection
process.env.AMQP_URL = "amqp://localhost";
amqplib.connect = mockAmqplib.connect;

const background = require("../background");
const sendMessage = require("../send-message");

describe("background tasks", () => {
  it("should consume messages from the queue", async () => {
    data = {
      "messageId":"some-id",
      "msgs":["hi there", "how are you"],
      "user":"27615551234",
      "number":"41798931892",
      "delay": 2000
    }
    let spy = jest.spyOn(background, 'sendBackgroundedMsgsWithDelay');

    const mock_conn = await amqplib.connect('amqp://localhost');
    const mock_ch = await mock_conn.createChannel();
    await mock_ch.assertQueue('background', { durable: true });
    await mock_ch.sendToQueue('background', Buffer.from(JSON.stringify(data)), { persistent: true });
    expect(mock_ch.checkQueue('background')).toMatchObject({ queue: 'background', messageCount: 1 });

    await background.channel({}, mock_ch);

    expect(mock_ch.checkQueue('background')).toMatchObject({ queue: 'background', messageCount: 0 });
    // TODO: Get this check working.
    // expect(spy).toHaveBeenCalled();
  });
  it("should call sendWithDelay with a client and the data from the queue", async () => {
    data = {
      "messageId":"some-id",
      "msgs":["hi there", "how are you"],
      "user":"27615551234",
      "number":"41798931892",
      "delay": 2000
    }
    let spy = jest.spyOn(sendMessage,'sendWithDelay');

    await background.sendBackgroundedMsgsWithDelay(data);

    // TODO: Get this mock check working.
    // expect(spy).toHaveBeenCalled();
  });
})
