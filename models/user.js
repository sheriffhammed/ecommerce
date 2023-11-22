'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    street: DataTypes.STRING,
    aprtment: DataTypes.STRING,
    city: DataTypes.STRING,
    zip: DataTypes.STRING,
    country: DataTypes.STRING,
    phone: DataTypes.STRING,
    refreshToken: DataTypes.TEXT,
    isAdmin: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    //User.hasOne(sequelize.define('Address'));
    User.hasMany(models.Category);
    User.hasMany(models.Order);
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      onDelete: 'CASCADE',
    });
  };
  return User;
};