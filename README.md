# turn-who-arcgis

This service returns data on covid-19 cases from a local cache that is updated by an external ArcGIS server hosted by the WHO.

## Getting started

This service requires the following ENV variables:

>

    TOKEN=<your-turn-token>

It can be configured with the following optional ENV variables:

>

    DATABASE_URL="sqlite://cache.db
    SENTRY_DSN="<sentry-dsn>"
    DEBUG="turn*"

```bash
yarn
yarn sync # sync the database based on ENV or defaults
yarn start
```

## Using the docker image

To sync (migrate) the database

> docker run who-arcgis:latest migrate

To run the HTTP server

> docker run who-arcgis:latest run

To do both in one go

> docker run who-arcgis:latest migrate_and_run
