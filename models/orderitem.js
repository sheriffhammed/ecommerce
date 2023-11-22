'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    productId: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
    dateCreated: DataTypes.DATE
  }, {});
  OrderItem.associate = function(models) {
    // associations can be defined here
   // OrderItem.belongsToMany(models.Order, { through : models.Product});
   OrderItem.belongsTo(models.Order);
   OrderItem.belongsTo(models.Product);
  };
  return OrderItem;
};