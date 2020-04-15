# turn-who-arcgis

This service returns data on covid-19 cases from a local cache that is updated by an external ArcGIS server hosted by the WHO.

## Getting started

This service assumes some ENV variables:

- PG_USER
- PG_PASSWORD
- PG_PORT
- PG_ADDRESS
- PG_DB_NAME

```bash
npm install
npm run sync # sync the database based on ENV or defaults
npm start
```
