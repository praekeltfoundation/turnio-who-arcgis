const formatMsg = require("../format-message");

describe("format-message tests", () => {
  it("should enter the data in to the ENG (default) template based on country_code", () => {
    const date = new Date();
    const mock_date = new Date('May 20, 2020 11:20:18')
    jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mock_date)
    const mockStatistic = {
      id: "1",
      country_code: "ZAF",
      country_code_2: "ZA",
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
  it("should enter the data in to the ITA template based on country_code and language", () => {
    const date = new Date();
    const mock_date = new Date('May 20, 2020 11:20:18')
    jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mock_date)
    const mockStatistic = {
      id: "1",
      country_code: "ZAF",
      country_code_2: "ZA",
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
    const formattedExample = `*Ultimi casi* 🔢

_Dati segnalati dalle autorità nazionali entro le 11:20 CET 20 maggio 2020_

Totale (nuovi) casi nelle ultime 24 ore

*Sudafrica*
1845 confermati (96)
18 morti (5)

*A livello globale*
70000 confermati (3000)
4500 morti (200)

*Cruscotto situazione romanzo di Coronavirus (COVID-19)*
Questa dashboard / mappa interattiva fornisce gli ultimi numeri globali e numeri per paese di casi COVID-19 su base giornaliera.

*Per i numeri dei paesi, trova gli ultimi rapporti sulla situazione qui:* https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports
`;
    expect(formatMsg(mockStatistic, mockGlobal, "ITA")).toEqual(formattedExample);
  });
});
