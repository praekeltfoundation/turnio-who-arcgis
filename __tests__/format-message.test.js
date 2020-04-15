const formatMsg = require("../format-message");

describe("format-message tests", () => {
  it("should enter the data in to the message based on country_code", () => {
    const date = new Date();
    const mockStatistic = {
      id: "1",
      country_code: "ZAF",
      updated: date,
      new_cases: "96",
      cum_cases: "1845",
      new_deaths: "5",
      cum_deaths: "18",
      createdAt: date,
      updatedAt: date
    };
    const formattedExample = `Total (new) cases in last 24 hours

*South Africa*
X confirmed cases: 1845
X deaths: 18

*Global*
X confirmed cases (Y)
X deaths (Y)
X countries, areas or territories with cases (Y)
`;
    expect(formatMsg(mockStatistic)).toEqual(formattedExample);
  });
});
