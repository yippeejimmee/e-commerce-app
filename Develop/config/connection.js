require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = process.env.JAWSDB_URL
  //if JAWSDB_URL is utilized then set sequelize to  the new sequelize object for the MySQL database
  ?
  new Sequelize(process.env.JAWSDB_URL)

  //if not, then just run it as a local server with following information
  :
  new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
      decimalNumbers: true,
    },
  });

module.exports = sequelize;