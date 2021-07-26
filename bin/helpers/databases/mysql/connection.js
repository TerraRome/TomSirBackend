const Sequelize = require('sequelize');
const config = require('../../../configs/config');

const sequelize = new Sequelize(config.mysql.mysqlDb, config.mysql.mysqlUser, config.mysql.mysqlPassword, {
  host: config.mysql.mysqlHost,
  dialect: 'mysql',
  define: {
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  },
  logging: config.env === 'development' ? true : false,
  dialectOptions: {
    connectTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 30000
  }
});

// (async() => {
//   if(config.env === 'development') {
//     await sequelize.sync();
//   }
// })();

module.exports = sequelize;
