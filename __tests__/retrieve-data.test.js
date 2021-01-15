const axios = require("axios");
const {
  retrieveCountryData,
  retrieveCountryStatsFromArcGis,
  retrieveGlobalStatsFromArcGis,
  shouldNotHaveToUpdate,
  lessThanADayOld,
  retrieveContactLanguage
} = require("../retrieve-data");
const { Statistics } = require("../models");

// Mock api calls
jest.mock("axios");
const mockAxios = jest.genMockFromModule('axios')
mockAxios.create = jest.fn(() => mockAxios)

describe("fetch data from arcGIS APIs", () => {
  beforeEach(async () => {
    await Statistics.destroy({truncate: true});
  });

  it("should add the country to the country query", async () => {
    axios.get.mockImplementation((url) => {
      if (url.indexOf("NLD") >= 0 ) {
        return Promise.resolve({ "data": {"message": "NLD present in url"}});
      } else {
        return Promise.resolve({ "data": {"message": "NLD not present in url"}});
      }});
    const data = await retrieveCountryStatsFromArcGis("NLD");
    expect(data.message).toBe("NLD present in url");
  });

  it("should add the date to the global query", async () => {
    // Mocks
    const mock_date = new Date('May 20, 2020 11:20:18')
    const spy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mock_date)

    axios.get.mockImplementation((url) => {
      if (url.indexOf("5/20/2020") >= 0 ) {
        return Promise.resolve({ "data": {"message": "Date present in url"}});
      } else {
        return Promise.resolve({ "data": {"message": "Date not present in url"}});
      }});

    const data = await retrieveGlobalStatsFromArcGis();

    expect(data.message).toBe("Date present in url");
    spy.mockRestore()
  });

  it("should not have to update if less than 1 hour old", () => {
    const date = new Date();
    const mock = {
      id: 1,
      country_code: "ZAF",
      updated: date,
      new_cases: 96,
      cum_cases: 1845,
      new_deaths: 5,
      cum_deaths: 18,
      createdAt: date,
      updatedAt: date
    };
    const oldDate = new Date(new Date() - 10000000);
    const oldMock = { ...mock, updatedAt: oldDate };
    expect(shouldNotHaveToUpdate(mock)).toBe(true);
    expect(shouldNotHaveToUpdate(oldMock)).toBe(false);
  });

  it("should only return true if the cache is less than a day old", () => {
    const date = new Date(new Date() - (80000000));
    const mock = {
      id: 1,
      country_code: "ZAF",
      updated: date,
      new_cases: 96,
      cum_cases: 1845,
      new_deaths: 5,
      cum_deaths: 18,
      createdAt: date,
      updatedAt: date
    };
    const oldDate = new Date(new Date() - (90000000));
    const oldMock = { ...mock, updatedAt: oldDate };
    expect(lessThanADayOld(mock)).toBe(true);
    expect(lessThanADayOld(oldMock)).toBe(false);
  });

  it("should get cached data from the database if less than an hour old", async () => {
    const date = new Date();
    const stats = await Statistics.create({
      country_code: "ZAF",
      updated: date,
      new_cases: 96,
      cum_cases: 1845,
      new_deaths: 5,
      cum_deaths: 18,
      createdAt: date,
      updatedAt: date
    });

    data = await retrieveCountryData("ZAF");
    expect(data.cum_cases).toBe(stats.cum_cases)
  });

  it("should pull data from arcGIS if the cache is empty", async () => {
    axios.get.mockImplementation((url) => {
        return Promise.resolve({"data": {"features": [{"attributes": {
          "ISO_2_CODE": "ZA",
          "date_epicrv": 1596326400000,
          "NewCase": 96,
          "CumCase": 1111,
          "NewDeath": 5,
          "CumDeath": 18
        }}]}});
      });
    data = await retrieveCountryData("ZAF");
    expect(data.cum_cases).toBe(1111)
  });

  it("should use yesterdays cached stats if new case numbers is empty", async () => {
    const date = new Date(new Date() - (70000000));
    const stats = await Statistics.create({
      country_code: "ZAF",
      updated: date,
      new_cases: 96,
      cum_cases: 2222,
      new_deaths: 5,
      cum_deaths: 18,
      createdAt: date,
      updatedAt: date
    }, {silent:true});
    axios.get.mockImplementation((url) => {
        return Promise.resolve({"data": {"features": [{"attributes": {
          "ISO_2_CODE": "ZA",
          "date_epicrv": 1596326400000,
          "NewCase": 0,
          "CumCase": 8888,
          "NewDeath": 0,
          "CumDeath": 4444
        }}]}});
      });
    data = await retrieveCountryData("ZAF");
    expect(data.cum_cases).toBe(2222)
  });

  it("should use yesterdays stats from arcGIS if cache and new case numbers empty", async () => {
    axios.get.mockImplementation((url) => {
        return Promise.resolve({"data": {"features": [{"attributes": {
          "ISO_2_CODE": "ZA",
          "date_epicrv": 1596326400000,
          "NewCase": 0,
          "CumCase": 8888,
          "NewDeath": 0,
          "CumDeath": 4444
        }}, {"attributes": {
          "ISO_2_CODE": "ZA",
          "date_epicrv": 1596240000000,
          "NewCase": 96,
          "CumCase": 5555,
          "NewDeath": 5,
          "CumDeath": 4444
        }}]}});
      });
    data = await retrieveCountryData("ZAF");
    expect(data.cum_cases).toBe(5555)
  });
});

describe("retrieve contact language from Turn", () => {
  it("should try to fetch Language from Turn", async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        "data": { "fields": { "language": "SPA"} }
      }),
    )

    const lang = await retrieveContactLanguage(mockAxios.create(), "+16315551234");
    expect(lang).toBe("SPA");
  });
  it("should return null for language if it doesn't exist", async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        "data": { "fields": { "location": null} }
      }),
    )

    const lang = await retrieveContactLanguage(mockAxios.create(), "+16315551234");
    expect(lang).toBeUndefined();
  });
});
