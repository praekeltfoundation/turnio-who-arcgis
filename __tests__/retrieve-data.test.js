<<<<<<< HEAD
const axios = require('axios')
const { retrieveFromArcGis, shouldNotHaveToUpdate } = require('../retrieve-data')
=======
const axios = require("axios");
const { retrieveFromArcGis } = require("../retrieve-data");
>>>>>>> 5796affbcb19df0f947f257d81993b22d4f59f2c

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

<<<<<<< HEAD
describe('retrieve data from cache or server', () => {
  it('should try to fetch data from arcGIS', async (done) => {
    const data = await retrieveFromArcGis("NLD")
    done()
  })

  it('should not update if less than 8 hours ago', () => {
    const date = new Date()
    const mock = {
      "id": 1,
      "country_code": "ZAF",
      "updated": date,
      "new_cases": 96,
      "cum_cases": 1845,
      "new_deaths": 5,
      "cum_deaths": 18,
      "createdAt": date,
      "updatedAt": date
    }
    const oldDate = new Date(new Date() - 30000000)
    const oldMock = {...mock, updated: oldDate}
    expect(shouldNotHaveToUpdate(mock)).toBe(true)
    expect(shouldNotHaveToUpdate(mock)).toBe(true)
  })

  it('should get data from the database', () => {
    const date = new Date()
    const mock = {
      "id": 1,
      "country_code": "ZAF",
      "updated": date,
      "new_cases": 96,
      "cum_cases": 1845,
      "new_deaths": 5,
      "cum_deaths": 18,
      "createdAt": date,
      "updatedAt": date
    }
  })
})
=======
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
>>>>>>> 5796affbcb19df0f947f257d81993b22d4f59f2c
