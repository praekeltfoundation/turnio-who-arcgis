const sequelize = require("./models").sequelize;
// This will generate drop commands for existing data
// This currently acceptable since the models are only used for caching
sequelize.sync({ alter: true });
