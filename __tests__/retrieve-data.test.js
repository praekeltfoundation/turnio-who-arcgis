const axios = require('axios')
const { retrieveFromArcGis, shouldNotHaveToUpdate } = require('../retrieve-data')

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
