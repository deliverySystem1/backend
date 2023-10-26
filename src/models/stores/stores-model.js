'use strict';

const storesModel = (sequelize, DataTypes) => sequelize.define('stores', {
  name: { type: DataTypes.STRING},
  location: { type: DataTypes.STRING},
  phoneNumber: { type: DataTypes.STRING},
  orderId: { type: DataTypes.INTEGER},
  income: { type: DataTypes.INTEGER},
  outcome: { type: DataTypes.INTEGER},
});

module.exports = storesModel;