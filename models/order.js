'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    orderItems: DataTypes.STRING,
    shippingAddress: DataTypes.TEXT,
    shippingAddress2: DataTypes.TEXT,
    city: DataTypes.STRING,
    zip: DataTypes.STRING,
    country: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    status: DataTypes.STRING,
    totalPrice: DataTypes.FLOAT,
    userId: DataTypes.INTEGER,
    dateCreated: DataTypes.DATE
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
    Order.hasMany(models.OrderItem);
    Order.belongsTo(models.User)
    //Order.belongsToMany(models.Product, {through : models.OrderItem});
  };
  return Order;
};