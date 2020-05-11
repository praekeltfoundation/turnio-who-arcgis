const formatMsg = require("../format-message");

describe("format-message tests", () => {
  it("should enter the data in to the message based on country_code", () => {
    const date = new Date();
    const mock_date = new Date('May 20, 2020 11:20:18')
    jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mock_date)
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
    const formattedExample = `*Latest numbers* 🔢

_Data as reported by national authorities by 11:20 AM CET May 20, 2020_

Total (new) cases in last 24 hours

*South Africa*
1845 confirmed cases (96)
18 deaths (5)

*Global* 
70000 confirmed cases (3000)
4500 deaths (200)

*Novel Coronavirus (COVID-19) Situation dashboard*
This interactive dashboard/map provides the latest global numbers and numbers by country of COVID-19 cases on a daily basis. 
https://covid19.who.int/

*For country numbers, find the latest situation reports here:* https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports

📌 Reply 6 for News & Press
📌 Reply 0 for Menu
`;
    expect(formatMsg(mockStatistic, mockGlobal)).toEqual(formattedExample);
  });
});
