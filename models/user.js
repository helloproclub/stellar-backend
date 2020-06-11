const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

const User = sequelize.define('users', {
  id_user: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  role: Sequelize.INTEGER
}, {
  freezeTableName: true
})

module.exports = User;
