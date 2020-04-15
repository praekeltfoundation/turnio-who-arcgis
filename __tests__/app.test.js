const request = require("supertest");
process.env.PORT = 3333;
const app = require("../app");

describe("/stats endpoint", () => {
  it("should retrieve data based on a phonenumber", (done) => {
    const testMsg = {
      "contacts": [{
          "profile": {
              "name": "Kerry Fisher"
          },
          "wa_id": "16315551234"
      }],
      "messages": [{
          "context": {
              "from": "sender_wa_id_of_context_message",
              "group_id": "group_id_of_context_message",
              "id": "message_id_of_context_message",
              "mentions": [ "wa_id1", "wa_id2" ]
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
  it("should not be able to retrieve the country code", (done) => {
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
});
