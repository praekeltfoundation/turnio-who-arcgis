const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/covid-stats');

class Statistics extends Model {}
Statistics.init({
  country_code: DataTypes.STRING,
  updated: DataTypes.DATE,
  new_cases: DataTypes.INTEGER,
  cum_cases: DataTypes.INTEGER,
  new_deaths: DataTypes.INTEGER,
  cum_deaths: DataTypes.INTEGER
}, {sequelize, modelName: 'statistics'})

// class Country extends Model {}
// Country.init({
//   indexes: [
//     {
//       name: 'stats_index',
//       using: 'BTREE',
//       fields: ['statistics', {attribute: 'updated', order: 'DESC', length: 5}]
//     }
//   ],

//   name: DataTypes.STRING,
//   country_code: DataTypes.STRING,
//   statistics: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: Statistics,
//       key: 'id'
//     }
//   }
// }, { sequelize, modelName: 'country' });

// sequelize.sync()

module.exports = {
  // Country: Country,
  Statistics: Statistics
}