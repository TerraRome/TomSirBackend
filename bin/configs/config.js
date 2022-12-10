require('dotenv').config();

const config = {
  env: 'development',
  hostname: 'localhost',
  port: 3000,
  secretKeyJwt: '588dc9c8-4c3c-4aa6-9fc8-e72f8cb1022c',
  secretKeyJwtRefresh: 'ca3cfaf9-c598-4ebb-a3de-9f97fbcef19b',
  // baseUrl: 'https://tomsir.fopini.id',
  baseUrl: 'https://bda0-180-254-65-170.ngrok.io',
  mysql: {
    mysqlDb: 'db_tomsir',
    mysqlHost: 'localhost',
    mysqlUser: 'root',
    mysqlPassword: ''
  },
};

module.exports = config;

