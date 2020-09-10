const express = require("express");
const morgan = require("morgan");
const inspect = require("./inspect");

const { Statistics } = require("./models");
const { sendCountryDataBasedOnPhoneNumber, sendLatestNews, sendHomepage } = require("./send-message");
const STATS_SECRET = process.env.STATS_SECRET;

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

app.post("/news", async (req, res) => {
  if (req.body.statuses) {
    const { recipient_id, status } = req.body.statuses[0];
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
    const { recipient_id, status } = req.body.statuses[0];
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

app.post("/add-stats", async (req, res) => {
  if (req.body.secret === STATS_SECRET) {
    const required_keys = [
      "country_code", "updated", "new_cases", "cum_cases", "new_deaths", "cum_deaths"]
    for (var i = 0; i < 6; i++) {
      if (!(required_keys[i] in req.body)) {
        return res.status(400).send(`Missing "${required_keys[i]}" attribute`);
      }
    }
    stats = Statistics.create({
      country_code: req.body.country_code,
      country_code_2: req.body.country_code_2,
      updated: req.body.updated,
      new_cases: req.body.new_cases,
      cum_cases: req.body.cum_cases,
      new_deaths: req.body.new_deaths,
      cum_deaths: req.body.cum_deaths
    });
    return res.json({status:"ok"});
  } else {
    return res.status(403).send("Forbidden");
  }
});

module.exports = app;
