const express = require("express");
const morgan = require("morgan");
const inspect = require("./inspect");

const { sendCountryDataBasedOnPhoneNumber } = require("./send-message");

const app = express();

app.use(express.json());
app.use(morgan("combined"));
app.post("/stats", async (req, res) => {
  if (req.body.statuses) {
    const { recipient_id, status } = req.body.statuses[0];
    inspect("status message: ")(
      `recipient_id: ${recipient_id}, status: ${status}`
    );
    return res.json({ status: "ok" });
  } else if (req.body.messages) {
    return sendCountryDataBasedOnPhoneNumber(req, res).then(() =>
      res.json({ status: "ok" })
    );
  } else {
    return res.status(501).send("sorry");
  }
});

module.exports = app;
