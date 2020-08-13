const { formatMessage, formatNewsMessage, formatHomepageMessages } = require("../format-message");

const mock_date = new Date('May 20, 2020 11:20:18')
jest
  .spyOn(global, 'Date')
  .mockImplementation(() => mock_date)
const date = new Date();
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

describe("format-message tests", () => {
  it("should enter the data in to the ENG (default) template based on country_code", () => {
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
    expect(formatMessage(mockStatistic, mockGlobal)).toEqual(formattedExample);
  });
  it("should enter the data in to the ITA template based on country_code and language", () => {
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
    expect(formatMessage(mockStatistic, mockGlobal, "ITA")).toEqual(formattedExample);
  });
  it("should enter the data in to the FRA template based on country_code and language", () => {
    const formattedExample = `*Derniers chiffres* 🔢

_Données communiquées par les autorités nationales au plus tard le 20/05/2020 à 11 h 20 CET_

total (nouveaux cas au cours des dernières 24 heures)

*Afrique du Sud*
1845 cas confirmés (96)
18 décès (5)

*Au niveau mondial*
70000 cas confirmés (3000)
4500 décès (200)

https://covid19.who.int/

*Tableau de bord de la situation du nouveau coronavirus (COVID-19)*
Cette carte interactive fournit quotidiennement les derniers chiffres mondiaux et par pays des cas de COVID-19.
https://covid19.who.int

*Pour les chiffres de chaque pays, les derniers rapports de situation se trouvent ici:* https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports/

📌 Tapez 6 pour Actualités et presse
📌 Tapez 0 pour le menu
`;
    expect(formatMessage(mockStatistic, mockGlobal, "FRA")).toEqual(formattedExample);
  });
  it("should enter the data in to the POR template based on country_code and language", () => {
    const formattedExample = `*Números atualizados* 🔢

_Dados comunicados pelas autoridades nacionais até às 11:20 CET de 20 de maio de 2020_

Número total de casos (novos) nas últimas 24 horas

*África do Sul*
1845 confirmados (96)
18 mortes (5)

*Mundo*
70000 confirmados (3000)
4500 mortes (200)

*Panorama da situação da doença causada pelo novo coronavírus (COVID-19)*
Diariamente, o panorama/mapa interativo fornece os números globais e os números por país mais recentes de casos de COVID-19. 
https://covid19.who.int (não disponível em português)

*Para obter os dados por país, acesse os relatórios de situação mais recentes aqui:* https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports/ (disponível somente em inglês)

📌 Responda 6 para Notícias
📌 Responda 0 para voltar ao Menu
`;
    expect(formatMessage(mockStatistic, mockGlobal, "POR")).toEqual(formattedExample);
  });
  it("should enter the data in to the ARA template based on country_code and language", () => {
    const formattedExample = `*أحدث الأرقام* 🔢

_البيانات التي أبلغت عنها السلطات الوطنية بحلول الساعة ١١:٢٠ ص بتوقيت وسط أوروبا ٢٠ مايو ٢٠٢٠_

إجمالي الحالات (الجديدة) في الـ 24 ساعة الماضية

*جنوب أفريقيا*
1845 حالة (96)
18 حالة وفاة (5)

*عالميا*
70000 حالة (3000)
4500 حالة وفاة (200)

توفر هذه الخريطة التفاعلية أداة متابعة لأحدث عدد حالات الإصابة بمرض كوفيد-19 على مستوى العالم وفي كل بلد بصفة يومية (لاحظ توقيت التحديث): https://covid19.who.int/

وتوفر هذه الخريطة التفاعلية أداة متابعة أخرى لأحدث عدد حالات الإصابة بمرض كوفيد-19 على مستوى إقليم شرق المتوسط بصفة يومية (لاحظ توقيت التحديث):
https://bit.ly/2UCPW2g

*للاطلاع على أحدث تقارير حالة باللغة الإنجليزية عن الوضع العالمي قم بزيارة الرابط التالي:* https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports/ 

*وللاطلاع على أحدث تقارير حالة لدول إقليم شرق المتوسط باللغة العربية قم بزيارة الرابط التالي:* http://www.emro.who.int/ar/health-topics/corona-virus/situation-reports.html

 📌 أرسل 6 للأخبار والبيانات الصحفية
 📌 أرسل 0 للقائمة الرئيسية
`;
    expect(formatMessage(mockStatistic, mockGlobal, "ARA")).toEqual(formattedExample);
  });
  it("should enter the data in to the HIN template based on country_code and language", () => {
    const formattedExample = `*मौजूदा संख्या* 🔢

_Data राष्ट्रीय अधिकारियों द्वारा 11:20 am सीईटी 20 मई 2020_ द्वारा रिपोर्ट की गई_

पिछले 24 घंटों में कुल (नए) मामले

*दक्षिण अफ़्रीका*
1845 मामले (96)
18 मौतें (5)

*विश्व स्तर पर*
70000 मामले (3000)
4500 मौतें (200)

*नावेल कोरोनावायरस (COVID-19) स्थिति डैशबोर्ड*
यह इंटरएक्टिव डैशबोर्ड / नक्शा विश्व और देशों में नावेल कोरोनावायरस (COVID-19) के संक्रमित व्यक्तियों की संख्या बताता है।
https://covid19.who.int

*देश में संक्रमित व्यक्तियों की मौजूदा संख्या यहाँ पर मिलेगी |*
https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports/

📌 6 से उत्तर दें समाचार और प्रेस के लिए 
📌 0 से उत्तर दें प्रथम सूची के लिए
`;
    expect(formatMessage(mockStatistic, mockGlobal, "HIN")).toEqual(formattedExample);
  });
  it("should enter the data in to the SPA template based on country_code and language", () => {
    const formattedExample = `*Últimas cifras* 🔢

_Datos según lo informado por las autoridades nacionales antes de las 11:20 CET 20 de mayo de 2020_

total (nuevos) casos en las últimas 24 horas

*Sudáfrica*
1845 confirmados (96)
18 muertes (5)

*Globalmente*
70000 confirmados (3000)
4500 muertes (200)

Novedoso panel de control de situación del coronavirus (COVID-19)
Este tablero / mapa interactivo proporciona los últimos números globales y números por país de casos COVID-19 a diario. 
https://covid19.who.int/

*Distribución geográfica de la enfermedad por el coronavirus (COVID-19) en las Américas*
https://who.maps.arcgis.com/apps/webappviewer/index.html?id=2203b04c3a5f486685a15482a0d97a87&extent=-17277700.8881%2C-1043174.5225%2C-1770156.5897%2C6979655.9663%2C102100

*Para cifras por país, visite los últimos informes aquí:*
https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports/

📌 Escriba 6 para noticias y prensa
📌 Escriba 0 para volver al menú
`;
    expect(formatMessage(mockStatistic, mockGlobal, "SPA")).toEqual(formattedExample);
  });

  it("should add the share link into the news template", () => {
    const news_data = {
      "items": [{
        "title": "article 1",
        "link": "some_link",
        "contentSnippet": "some content",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      }]
    };
    formatted_msg = formatNewsMessage(news_data, "23432434234")

    expect(formatted_msg).toContain("http://wa.me/23432434234?text=hi");
  });
  it("should only add the latest 5 covid items into the news template", () => {
    const news_data = {
      "items": [{
        "title": "article 1",
        "link": "some_link",
        "contentSnippet": "some covid content",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      },{
        "title": "article 2",
        "link": "some_link",
        "contentSnippet": "some other content",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      },{
        "title": "article 3",
        "link": "some_link",
        "contentSnippet": "some Covid content",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      },{
        "title": "article 4",
        "link": "some_link",
        "contentSnippet": "some COVID content",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      },{
        "title": "article 5",
        "link": "some_link",
        "contentSnippet": "some covid content",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      },{
        "title": "article 6",
        "link": "some_link",
        "contentSnippet": "some covid content",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      },{
        "title": "article 7",
        "link": "some_link",
        "contentSnippet": "some covid content",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      }]
    };
    formatted_msg = formatNewsMessage(news_data, "23432434234")

    expect(formatted_msg).toContain("*article 1*");
    expect(formatted_msg).not.toContain("*article 2*");
    expect(formatted_msg).toContain("*article 3*");
    expect(formatted_msg).toContain("*article 4*");
    expect(formatted_msg).toContain("*article 5*");
    expect(formatted_msg).toContain("*article 6*");
    expect(formatted_msg).not.toContain("*article 7*");
  });
  it("should truncate the snippet if it is longer than 300 characters", () => {
    const news_data = {
      "items": [{
        "title": "article 1",
        "link": "some_link",
        "contentSnippet": "Lorem Ipsum is simply dummy text of the printing and typesetting industry COVID. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      }]
    };
    formatted_msg = formatNewsMessage(news_data, "23432434234")

    expect(formatted_msg).toContain("scrambled it to make a type specimen book.");
    expect(formatted_msg).not.toContain("It has survived not only five centuries,");
  });
  it("should truncate the snippet if it is longer than 300 without fullstop", () => {
    const news_data = {
      "items": [{
        "title": "article 1",
        "link": "some_link",
        "contentSnippet": "Lorem Ipsum is simply dummy text used by the printing and typesetting industry COVID. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      }]
    };
    formatted_msg = formatNewsMessage(news_data, "23432434234")

    expect(formatted_msg).toContain("it to make a type specimen");
    expect(formatted_msg).not.toContain("book It has survived not");
  });
  it("should truncate the snippet if it has a fullstop after the 300 character mark", () => {
    const news_data = {
      "items": [{
        "title": "article 1",
        "link": "some_link",
        "contentSnippet": "Lorem Ipsum is simply dummy text used by the printing and typesetting industry COVID Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially. unchanged",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      }]
    };
    formatted_msg = formatNewsMessage(news_data, "23432434234")

    expect(formatted_msg).toContain("it to make a type specimen");
    expect(formatted_msg).not.toContain("book It has survived not");
  });
  it("should decode escaped html", () => {
    const news_data = {
      "items": [{
        "title": "article&mdash;1",
        "link": "some_link",
        "contentSnippet": "Lorem&nbsp;Ipsum Covid",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      }]
    };
    formatted_msg = formatNewsMessage(news_data, "23432434234")

    expect(formatted_msg).toContain("article—1");
    expect(formatted_msg).toContain("Lorem Ipsum");
  });
  it("should remove the day and replace the 'Z' with 'UTC'", () => {
    const news_data = {
      "items": [{
        "title": "article 1",
        "link": "some_link",
        "contentSnippet": "some Covid content",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      }]
    };
    formatted_msg = formatNewsMessage(news_data, "23432434234")

    expect(formatted_msg).toContain("_09 Jun 2020 14:53:34 UTC_");
    expect(formatted_msg).not.toContain("Tue,");
  });
  it("should format the cases summary message", () => {
    const news_data = {
      "items": [{
        "title": "article 1",
        "link": "some_link",
        "contentSnippet": "some Covid content",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      }]
    };
    const formattedExample = `[🇿🇦] *South Africa Cases*
_Wednesday, 20 May 2020 10:20:18 UTC_
1845 confirmed cases (96▲)
18 deaths (5▲)
💡 _Reply *CASES* for detailed case report_`;
        expect(formatHomepageMessages(mockStatistic, news_data)[0]).toEqual(formattedExample);
  });
  it("should format the news summary message with 1 covid news items", () => {
    const news_data = {
      "items": [{
        "title": "article 1",
        "link": "https://some_link",
        "contentSnippet": "some covid content",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      },{
        "title": "article 2",
        "link": "https://some_link",
        "contentSnippet": "some other content",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      },{
        "title": "article 3",
        "link": "http://www.some_link",
        "contentSnippet": "some Covid content",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      },{
        "title": "article 4",
        "link": "some_link",
        "contentSnippet": "some COVID content",
        "pubDate": "Tue, 09 Jun 2020 14:53:34 Z"
      }]
    };
    const formattedExample = `[📰] *Newsfeed*

_09 Jun 2020 14:53:34 UTC_
*article 1*
[some_link]

💡 _Reply *NEWS* to read more_`;
        expect(formatHomepageMessages(mockStatistic, news_data)[1]).toEqual(formattedExample);
  });
});
