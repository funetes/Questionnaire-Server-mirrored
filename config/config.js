require('dotenv').config();

const development =  {
    "username": process.env.USERNAME,
    "password": process.env.PASSWORD,
    "database": process.env.DEVDATABASE,
    "host": "127.0.0.1",
    "dialect": "mysql",
  }

const test =  {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  }

const production =  {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  }

module.exports = { development, production, test };