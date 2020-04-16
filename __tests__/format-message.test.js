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
1845 confirmed cases (96)
18 deaths (5)
`;
    expect(formatMsg(mockStatistic)).toEqual(formattedExample);
  });
});
