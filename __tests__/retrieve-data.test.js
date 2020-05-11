const axios = require("axios");
const {
  retrieveCountryStatsFromArcGis,
  shouldNotHaveToUpdate,
  retrieveContactLanguage
} = require("../retrieve-data");

const mockAxios = jest.genMockFromModule('axios')
mockAxios.create = jest.fn(() => mockAxios)

mockAxios.mockImplementation(() =>
  Promise.resolve(() => ({
    features: [{ attributes: {} }]
  }))
);

describe("retrieve data from cache or server", () => {
  it("should try to fetch data from arcGIS", async done => {
    const data = await retrieveCountryStatsFromArcGis("NLD");
    done();
  });
});

describe("retrieve data from cache or server", () => {
  it("should try to fetch data from arcGIS", async done => {
    const data = await retrieveCountryStatsFromArcGis("NLD");
    done();
  });

  it("should not update if less than 8 hours ago", () => {
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
    const oldDate = new Date(new Date() - 30000000);
    const oldMock = { ...mock, updatedAt: oldDate };
    expect(shouldNotHaveToUpdate(mock)).toBe(true);
    expect(shouldNotHaveToUpdate(oldMock)).toBe(false);
  });

  it("should get data from the database", () => {
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
