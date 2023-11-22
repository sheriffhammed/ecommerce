'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING,
    color: DataTypes.STRING,
    icon: DataTypes.STRING,
    image: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    dateCreated: DataTypes.DATE
  }, {});
  Category.associate = function(models) {
    // associations can be defined here
    Category.belongsTo(models.User);
    Category.hasMany(models.Product);
  };
  return Category;
};