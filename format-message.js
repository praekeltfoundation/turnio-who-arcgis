const isonames = require("phone").iso3166_data;
const italian = require('localized-countries')('it')
const french = require('localized-countries')('fr')
const português = require('localized-countries')('pt')
const arabic = require('localized-countries')('ar')
const hindi = require('localized-countries')('hi')
const spanish = require('localized-countries')('es')


function formatMessage(countryData, globalData, languageCode) {
  var countryName = isonames.find(
    item => countryData.country_code === item.alpha3
  ).country_name;

  // The translations were writting for CET so we use that
  const date = new Date((new Date().getTime())+1 * 60 * 60 * 1000) ;

  switch (languageCode) {
    case "ITA":
      if (countryData.country_code_2) {
        countryName = italian.get(countryData.country_code_2)
      }
      return ita_template(countryName, countryData, globalData, date);
    case "FRA":
      if (countryData.country_code_2) {
        countryName = french.get(countryData.country_code_2)
      }
      return fra_template(countryName, countryData, globalData, date);
    case "POR":
      if (countryData.country_code_2) {
        countryName = português.get(countryData.country_code_2)
      }
      return por_template(countryName, countryData, globalData, date);
    case "ARA":
      if (countryData.country_code_2) {
        countryName = arabic.get(countryData.country_code_2)
      }
      return ara_template(countryName, countryData, globalData, date);
    case "HIN":
      if (countryData.country_code_2) {
        countryName = hindi.get(countryData.country_code_2)
      }
      return hin_template(countryName, countryData, globalData, date);
    case "SPA":
      if (countryData.country_code_2) {
        countryName = spanish.get(countryData.country_code_2)
      }
      return spa_template(countryName, countryData, globalData, date);
    default:
      return eng_template(countryName, countryData, globalData, date);
  }
};

const eng_template = (countryName, countryData, globalData, date) => `*Latest numbers* 🔢

_Data as reported by national authorities by ${
  date.toLocaleTimeString('ENG', {hour:"numeric", minute:"numeric"})
} CET ${
  date.toLocaleDateString('ENG', {day:"numeric", month:"long", year: "numeric"})
}_

Total (new) cases in last 24 hours

*${countryName}*
${countryData.cum_cases} confirmed cases (${
  countryData.new_cases
})
${countryData.cum_deaths} deaths (${countryData.new_deaths})

*Global* 
${globalData.cum_cases} confirmed cases (${globalData.new_cases})
${globalData.cum_deaths} deaths (${globalData.new_deaths})

*Novel Coronavirus (COVID-19) Situation dashboard*
This interactive dashboard/map provides the latest global numbers and numbers by country of COVID-19 cases on a daily basis. 
https://covid19.who.int/

*For country numbers, find the latest situation reports here:* https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports

📌 Reply 6 for News & Press
📌 Reply 0 for Menu
`;

const ita_template = (countryName, countryData, globalData, date) => `*Ultimi casi* 🔢

_Dati segnalati dalle autorità nazionali entro le ${
  date.toLocaleTimeString('ITA', {hour:"numeric", minute:"numeric"})
} CET ${
  date.toLocaleDateString('ITA', {day:"numeric", month:"long", year: "numeric"})
}_

Totale (nuovi) casi nelle ultime 24 ore

*${countryName}*
${countryData.cum_cases} confermati (${
    countryData.new_cases
  })
${countryData.cum_deaths} morti (${countryData.new_deaths})

*A livello globale*
${globalData.cum_cases} confermati (${globalData.new_cases})
${globalData.cum_deaths} morti (${globalData.new_deaths})

*Cruscotto situazione romanzo di Coronavirus (COVID-19)*
Questa dashboard / mappa interattiva fornisce gli ultimi numeri globali e numeri per paese di casi COVID-19 su base giornaliera.

*Per i numeri dei paesi, trova gli ultimi rapporti sulla situazione qui:* https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports
`;

const fra_template = (countryName, countryData, globalData, date) => `*Derniers chiffres* 🔢

_Données communiquées par les autorités nationales au plus tard le ${
  date.toLocaleDateString('FRA', {day:"numeric", month:"numeric", year: "numeric"})
} à ${
  date.toLocaleTimeString('FRA', {hour:"numeric"})
} ${
  date.toLocaleTimeString('FRA', {minute:"numeric"})
} CET_

total (nouveaux cas au cours des dernières 24 heures)

*${countryName}*
${countryData.cum_cases} cas confirmés (${
  countryData.new_cases
})
${countryData.cum_deaths} décès (${countryData.new_deaths})

*Au niveau mondial*
${globalData.cum_cases} cas confirmés (${globalData.new_cases})
${globalData.cum_deaths} décès (${globalData.new_deaths})

https://covid19.who.int/

*Tableau de bord de la situation du nouveau coronavirus (COVID-19)*
Cette carte interactive fournit quotidiennement les derniers chiffres mondiaux et par pays des cas de COVID-19.
https://covid19.who.int

*Pour les chiffres de chaque pays, les derniers rapports de situation se trouvent ici:* https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports/

📌 Tapez 6 pour Actualités et presse
📌 Tapez 0 pour le menu
`;

const por_template = (countryName, countryData, globalData, date) => `*Números atualizados* 🔢

_Dados comunicados pelas autoridades nacionais até às ${
  date.toLocaleTimeString('POR', {hour:"numeric", minute:"numeric"})
} CET de ${
  date.toLocaleDateString('POR', {day:"numeric"})
} de ${
  date.toLocaleDateString('POR', {month:"long"})
} de ${
  date.toLocaleDateString('POR', {year:"numeric"})
}_

Número total de casos (novos) nas últimas 24 horas

*${countryName}*
${countryData.cum_cases} confirmados (${
  countryData.new_cases
})
${countryData.cum_deaths} mortes (${countryData.new_deaths})

*Mundo*
${globalData.cum_cases} confirmados (${globalData.new_cases})
${globalData.cum_deaths} mortes (${globalData.new_deaths})

*Panorama da situação da doença causada pelo novo coronavírus (COVID-19)*
Diariamente, o panorama/mapa interativo fornece os números globais e os números por país mais recentes de casos de COVID-19. 
https://covid19.who.int (não disponível em português)

*Para obter os dados por país, acesse os relatórios de situação mais recentes aqui:* https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports/ (disponível somente em inglês)

📌 Responda 6 para Notícias
📌 Responda 0 para voltar ao Menu
`;

const ara_template = (countryName, countryData, globalData, date) => `*أحدث الأرقام* 🔢

_البيانات التي أبلغت عنها السلطات الوطنية بحلول الساعة ${
  date.toLocaleTimeString('ARA', {hour:"numeric", minute:"numeric"})
} بتوقيت وسط أوروبا ${
  date.toLocaleDateString('ARA', {day:"numeric", month:"long", year: "numeric"})
}_

إجمالي الحالات (الجديدة) في الـ 24 ساعة الماضية

*${countryName}*
${countryData.cum_cases} حالة (${
  countryData.new_cases
})
${countryData.cum_deaths} حالة وفاة (${countryData.new_deaths})

*عالميا*
${globalData.cum_cases} حالة (${globalData.new_cases})
${globalData.cum_deaths} حالة وفاة (${globalData.new_deaths})

توفر هذه الخريطة التفاعلية أداة متابعة لأحدث عدد حالات الإصابة بمرض كوفيد-19 على مستوى العالم وفي كل بلد بصفة يومية (لاحظ توقيت التحديث): https://covid19.who.int/

وتوفر هذه الخريطة التفاعلية أداة متابعة أخرى لأحدث عدد حالات الإصابة بمرض كوفيد-19 على مستوى إقليم شرق المتوسط بصفة يومية (لاحظ توقيت التحديث):
https://bit.ly/2UCPW2g

*للاطلاع على أحدث تقارير حالة باللغة الإنجليزية عن الوضع العالمي قم بزيارة الرابط التالي:* https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports/ 

*وللاطلاع على أحدث تقارير حالة لدول إقليم شرق المتوسط باللغة العربية قم بزيارة الرابط التالي:* http://www.emro.who.int/ar/health-topics/corona-virus/situation-reports.html

 📌 أرسل 6 للأخبار والبيانات الصحفية
 📌 أرسل 0 للقائمة الرئيسية
`;

const hin_template = (countryName, countryData, globalData, date) => `*मौजूदा संख्या* 🔢

_Data राष्ट्रीय अधिकारियों द्वारा ${
  date.toLocaleTimeString('HIN', {hour:"numeric", minute:"numeric"})
} सीईटी ${
  date.toLocaleDateString('HIN', {day:"numeric", month:"long", year: "numeric"})
}_ द्वारा रिपोर्ट की गई_

पिछले 24 घंटों में कुल (नए) मामले

*${countryName}*
${countryData.cum_cases} मामले (${
  countryData.new_cases
})
${countryData.cum_deaths} मौतें (${countryData.new_deaths})

*विश्व स्तर पर*
${globalData.cum_cases} मामले (${globalData.new_cases})
${globalData.cum_deaths} मौतें (${globalData.new_deaths})

*नावेल कोरोनावायरस (COVID-19) स्थिति डैशबोर्ड*
यह इंटरएक्टिव डैशबोर्ड / नक्शा विश्व और देशों में नावेल कोरोनावायरस (COVID-19) के संक्रमित व्यक्तियों की संख्या बताता है।
https://covid19.who.int

*देश में संक्रमित व्यक्तियों की मौजूदा संख्या यहाँ पर मिलेगी |*
https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports/

📌 6 से उत्तर दें समाचार और प्रेस के लिए 
📌 0 से उत्तर दें प्रथम सूची के लिए
`;

const spa_template = (countryName, countryData, globalData, date) => `*Últimas cifras* 🔢

_Datos según lo informado por las autoridades nacionales antes de las ${
  date.toLocaleTimeString('SPA', {hour:"numeric", minute:"numeric"})
} CET ${
  date.toLocaleDateString('SPA', {day:"numeric", month:"long", year: "numeric"})
}_

total (nuevos) casos en las últimas 24 horas

*${countryName}*
${countryData.cum_cases} confirmados (${
  countryData.new_cases
})
${countryData.cum_deaths} muertes (${countryData.new_deaths})

*Globalmente*
${globalData.cum_cases} confirmados (${globalData.new_cases})
${globalData.cum_deaths} muertes (${globalData.new_deaths})

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

function formatNewsMessage(newsList, whoNumber) {
  let msg = `*LATEST NEWS & PRESS*

`;
  if (newsList.items.length > 5) {
    newsList.items.length = 5;
  }
  newsList.items.forEach(item => {
    let description = item.contentSnippet;
    if (description.length > 300) {
      description = description.substring(0,description.indexOf(".", 100)+1)
    }
    msg += `• *${item.title}*
${description}
Read more here: ${item.link}

`});

  msg += `*More News*

*Situation reports:* Situation reports provide the latest updates on the novel coronavirus outbreak. https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports/

*Rolling Updates:* Rolling updates on coronavirus disease (COVID-19) sourced from across WHO media.
https://www.who.int/emergencies/diseases/novel-coronavirus-2019/events-as-they-happen

*News articles:* All news releases, statements and notes for the media.
https://www.who.int/emergencies/diseases/novel-coronavirus-2019/media-resources/news

*Press briefings:* Coronavirus disease (COVID-2019) press briefings including videos, audio and transcripts.
https://www.who.int/emergencies/diseases/novel-coronavirus-2019/media-resources/press-briefings

⏩ *SHARE* this service with this link: http://wa.me/${whoNumber}?text=hi

-----
📌 Reply *0* for *MENU*`;
return msg
};

module.exports = {
  formatMessage,
  formatNewsMessage
};
