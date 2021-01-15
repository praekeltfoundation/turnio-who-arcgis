const axios = require("axios");
const amqplib = require('amqplib');
const mockAmqplib = require('mock-amqplib');

// Mock amqp connection
process.env.AMQP_URL = "some-url";
amqplib.connect = mockAmqplib.connect;
const sendModule = require("../send-message");
const { sendHomepage, sendWithDelay } = require("../send-message");
const { Statistics } = require("../models");

jest.useFakeTimers();

// Mock api calls
jest.mock("axios");
const mockAxios = jest.genMockFromModule('axios')
mockAxios.create = jest.fn(() => mockAxios)

const mockRequest = () => {
  return {
    query: {},
    body:{
      contacts: [{
        profile: {
          name: "Kerry Fisher",
        },
      }],
      messages: [{
        context: {
          from: "sender_wa_id_of_context_message",
          group_id: "group_id_of_context_message",
          id: "message_id_of_context_message",
          mentions: ["wa_id1", "wa_id2"],
        },
      }],
    }
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Create a stats object that will be pulled from the db
const date = new Date();

describe("send homepage messages", () => {
  it("should fail for an unknown country", async () => {
    let req = mockRequest();
    req.body.contacts[0].wa_id="00015551234";
    const res = mockResponse();

    await sendHomepage(req, res);

    expect(res.json).toHaveBeenCalledWith({ country: "unknown" });
  });

  it("should send data to queue for known countries", async () => {
    const stats = Statistics.create({
      country_code: "ZAF",
      updated: date,
      new_cases: 96,
      cum_cases: 1845,
      new_deaths: 5,
      cum_deaths: 18,
      createdAt: date,
      updatedAt: date
    });

    let req = mockRequest();
    req.body.contacts[0].wa_id="27615551234";
    const res = mockResponse();

    await sendHomepage(req, res);

    const mock_conn = await amqplib.connect('some-url');
    const mock_ch = await mock_conn.createChannel();
    const obj = await mock_ch.get('background', { noAck: true });
    const data = JSON.parse(obj.content.toString())

    expect(data.msgs.length).toEqual(2);
    expect(data.delay).toEqual(2000);
    expect(data.user).toEqual("27615551234");
    expect(data.number).toEqual("41798931892");
  })
})

describe("send with delay", () => {
  it("should call send message for each message", async () => {
    const client = axios.create();
    mock_send = sendModule.sendMessage = jest.fn(() => {});

    await sendWithDelay(client, "msg_id", ["hi there", "how are you"], "27615551234", 2000);

    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 2000);

    // TODO: Get this mock check working.
    // expect(mock_send).toHaveBeenCalledTimes(2);
  });
})