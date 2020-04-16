const express = require("express");
const inspect = require("./inspect");

const { sendCountryDataBasedOnPhoneNumber } = require("./send-message");

const app = express();

app.use(express.json());

app.post("/stats", async (req, res) => {
  if (req.body.statuses) {
    const status = req.body.statuses[0];
    inspect("status message")(status);
    return res.json({ status: "ok" });
  }

  if (
    req.body.contacts &&
    req.body.messages &&
    req.body.contacts.length > 0 &&
    req.body.messages.length > 0
  ) {
    return sendCountryDataBasedOnPhoneNumber(req, res).then(() =>
      res.json({ status: "ok" })
    );
  } else {
    return res.status(501).send("sorry");
  }
});

module.exports = app;
