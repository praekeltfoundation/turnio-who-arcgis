const express = require("express");
const morgan = require("morgan");
const inspect = require("./inspect");

const { sendCountryDataBasedOnPhoneNumber, sendLatestNews, sendHomepage } = require("./send-message");

const app = express();

app.use(express.json());
app.use(morgan("short"));

if (process.env.SENTRY_DSN) {
  const Sentry = require("@sentry/node");
  Sentry.init({ dsn: process.env.SENTRY_DSN });

  app.use(Sentry.Handlers.requestHandler()).use(Sentry.Handlers.errorHandler());
}

app.post("/stats", async (req, res) => {
  if (req.body.statuses) {
    const { message:{ recipient_id }, status } = req.body.statuses[0];
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

app.post("/news", async (req, res) => {
  if (req.body.statuses) {
    const { message:{ recipient_id }, status } = req.body.statuses[0];
    inspect("status message: ")(
      `recipient_id: ${recipient_id}, status: ${status}`
    );
    return res.json({ status: "ok" });
  } else if (req.body.messages) {
    return sendLatestNews(req, res).then(() =>
      res.json({ status: "ok" })
    );
  } else {
    return res.status(501).send("sorry");
  }
});

app.post("/homepage", async (req, res) => {
  if (req.body.statuses) {
    const { message:{ recipient_id }, status } = req.body.statuses[0];
    inspect("status message: ")(
      `recipient_id: ${recipient_id}, status: ${status}`
    );
    return res.json({ status: "ok" });
  } else if (req.body.messages) {
    return sendHomepage(req, res).then(() =>
      res.json({ status: "ok" })
    );
  } else {
    return res.status(501).send("sorry");
  }
});

module.exports = app;
