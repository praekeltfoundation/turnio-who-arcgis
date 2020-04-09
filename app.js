const express = require('express')
const phone = require('phone')

const app = express()

app.use(express.json())

app.post('/stats', (req, res) => {
  const phonenr = phone(req.body.message.number)
  console.log(req.body.message.number)
  console.log(phonenr)
  res.json({country: phonenr[1]})
  
})


const bent = require('bent')

const getJSON = bent('json')

let getObj = async () => await getJSON('https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/COVID19_hist_cases_adm0_v5_view/FeatureServer/0', {
  f: 'json',
  where: 'ADM0_NAME=Netherlands',
  outFields: 'NewCase,date_epicrv,CumCase,CumDeath,NewDeath'
})

((async () => console.log(() => getObj()))())

module.exports = app