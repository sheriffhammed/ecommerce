'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    richDescription: DataTypes.STRING,
    image: DataTypes.STRING,
    images: DataTypes.STRING,
    brand: DataTypes.STRING,
    price: DataTypes.FLOAT,
    categoryId: DataTypes.INTEGER,
    countInStock: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    isFeatured: DataTypes.BOOLEAN,
    dateCreated: DataTypes.DATE
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsTo(models.Category);
    //Product.belongsToMany(models.Order, {through : models.OrderItem});
    Product.hasMany(models.OrderItem);
  };
  return Product;
};