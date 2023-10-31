"use strict";

const ordersModel = (sequelize, DataTypes) =>
  sequelize.define(
    "orders",
    {
      orderName: { type: DataTypes.STRING },
      customerName: { type: DataTypes.TEXT },
      customerPhone: { type: DataTypes.TEXT },
      price: { type: DataTypes.FLOAT },
      location: { type: DataTypes.STRING },
      collectedCash: { type: DataTypes.FLOAT },
      status: { type: DataTypes.STRING },
      driverId: { type: DataTypes.INTEGER },
      storeId: { type: DataTypes.INTEGER },
      note: { type: DataTypes.TEXT },
      arrived:{type:DataTypes.BOOLEAN,  defaultValue: false},
      long: {
        type: DataTypes.FLOAT,
        required: true,
      },
      lat: {
        type: DataTypes.FLOAT,
        required: true,
      },
    },
    { timestamps: true }
  );

module.exports = ordersModel;
