const axios = require("axios");
const { retrieveFromArcGis } = require("../retrieve-data");

jest.mock("axios");
axios.mockImplementation(() =>
  Promise.resolve(() => ({
    features: [{ attributes: {} }],
  }))
);

describe("retrieve data from cache or server", () => {
  it("should try to fetch data from arcGIS", async (done) => {
    const data = await retrieveFromArcGis("NLD");
    done();
  });

  it("should get data from the database", () => {
    const mock = {
      id: 1,
      country_code: "ZAF",
      updated: "2020-04-09T00:00:00.000Z",
      new_cases: 96,
      cum_cases: 1845,
      new_deaths: 5,
      cum_deaths: 18,
      createdAt: "2020-04-09T13:12:02.409Z",
      updatedAt: "2020-04-09T13:12:02.409Z",
    };
  });
});
