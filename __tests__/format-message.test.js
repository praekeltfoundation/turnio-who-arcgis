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
    const mockGlobal = {
      id: "1",
      country_code: "Global",
      updated: date,
      new_cases: "3000",
      cum_cases: "70000",
      new_deaths: "200",
      cum_deaths: "4500",
      createdAt: date,
      updatedAt: date
    };
    const formattedExample = `*Latest numbers*
_Latest data reported by national authorities to the World Health Organization_

*South Africa*
1845 confirmed cases (96 reported today)
18 deaths (5 reported today)

*Global*
70000 confirmed cases (3000 reported today)
4500 deaths (200 reported today)

*Novel Coronavirus (COVID-19) Situation dashboard*
This interactive dashboard/map provides the latest global numbers and numbers by country of COVID-19 cases on a daily basis.
https://covid19.who.int/

*For country numbers, find the latest situation reports here:* https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports
`;
    expect(formatMsg(mockStatistic, mockGlobal)).toEqual(formattedExample);
  });
});
