const request = require("supertest");
process.env.PORT = 3333;
const app = require("../app");

jest.mock("../retrieve-data");
const retrieveModule = require("../retrieve-data");

retrieveModule.retrieveCountryData.mockImplementation(
  () => new Promise((bla) => console.log(bla))
);

describe("/stats endpoint", () => {
  it.skip("should call data retrieval based on a phonenumber", (done) => {
    const testMsg = {
      contacts: [
        {
          profile: {
            name: "Kerry Fisher",
          },
          wa_id: "16315551234",
        },
      ],
      messages: [
        {
          context: {
            from: "sender_wa_id_of_context_message",
            group_id: "group_id_of_context_message",
            id: "message_id_of_context_message",
            mentions: ["wa_id1", "wa_id2"],
          },
        },
      ],
    };
    request(app)
      .post("/stats")
      .send(testMsg)
      .set("Accept", "application/json")
      .expect(200, done);
  });
  it.skip("should not be able to retrieve the country code", (done) => {
    const testMsg = {
      message: {
        number: "+3161234567890",
        content: "country bla",
      },
    };
    request(app)
      .post("/stats")
      .send(testMsg)
      .set("Accept", "application/json")
      .expect(200, done)
      .expect({ country: "unknown" });
  });
  it("should successfully receive sent status", (done) => {
    const testMsg = {
      "statuses": [
        {
          "id": "ABGGFlA5FpafAgo6tHcNmNjXmuSf",
          "status": "sent",
          "timestamp": "1518694700",
          "message": {
            "recipient_id":"16315555555"
          }
        }
      ]
    };
    request(app)
      .post("/stats")
      .send(testMsg)
      .set("Accept", "application/json")
      .expect(200, done);
  });
  it("should successfully receive read status", (done) => {
    const testMsg = {
      "statuses": [
        {
          "id": "ABGGFlA5FpafAgo6tHcNmNjXmuSf",
          "status": "read",
          "timestamp": "1518694700",
          "message": {
            "recipient_id":"16315555555"
          }
        }
      ]
    };
    request(app)
      .post("/stats")
      .send(testMsg)
      .set("Accept", "application/json")
      .expect(200, done);
  });
});

describe("/news endpoint", () => {
  it("should successfully receive read status", (done) => {
    const testMsg = {
      "statuses": [
        {
          "id": "ABGGFlA5FpafAgo6tHcNmNjXmuSf",
          "status": "read",
          "timestamp": "1518694700",
          "message": {
            "recipient_id":"16315555555"
          }
        }
      ]
    };
    request(app)
      .post("/news")
      .send(testMsg)
      .set("Accept", "application/json")
      .expect(200, done);
  });
});
