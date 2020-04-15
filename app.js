const express = require("express");
const phone = require("phone");
const { retrieveData } = require("./retrieve-data");
const formatMessage = require("./format-message");

const app = express();

app.use(express.json());

app.post("/stats", async (req, res) => {
  const [number, countryCode] = phone(req.body.message.number);
  if (!number) {
    return res.json({ country: "unknown" });
  }
  retrieveData(countryCode)
    .then((data) => formatMessage(data))
    .then((msg) => res.json(msg));
});

module.exports = app;
