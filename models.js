const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE_URL || "sqlite://cache.db"
);

class Statistics extends Model {}
Statistics.init(
  {
    country_code: DataTypes.STRING,
    country_code_2: DataTypes.STRING, // Iso-2 country code
    updated: DataTypes.DATE,
    new_cases: DataTypes.INTEGER,
    cum_cases: DataTypes.INTEGER,
    new_deaths: DataTypes.INTEGER,
    cum_deaths: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "statistics",
    indexes: [
      {
        using: "BTREE",
        fields: ["country_code"],
      },
      {
        using: "BTREE",
        fields: ["updated"],
      },
    ],
  }
);

module.exports = {
  sequelize: sequelize,
  Statistics: Statistics,
};
