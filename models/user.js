'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id_user: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.INTEGER
  }, {});
  User.associate = function (models) {
    // User.hasMany(models.Post, { foreignKey: 'id_user' });
  };
  return User;
};
