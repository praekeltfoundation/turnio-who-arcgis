const { Sequelize, Model, DataTypes } = require('sequelize');

const PG_PORT = process.env.PG_PORT || '5432'
const PG_ADDRESS = process.env.PG_ADDRESS || 'localhost'
const PG_DB_NAME = process.env.PG_DB_NAME || 'covid-stats'

const sequelize = new Sequelize(`postgres://${PG_ADDRESS}:${PG_PORT}/${PG_DB_NAME}`);

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
  sequelize: sequelize,
  Statistics: Statistics
}