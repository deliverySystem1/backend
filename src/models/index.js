"use strict";

const userModel = require("../auth/models/users");

const { Sequelize, DataTypes } = require("sequelize");

const ordersModel = require("./orders/orders-model.js");
const storesModel = require("./stores/stores-model.js");

const Collection = require("./collection.js");

const DATABASE_URL = process.env.DATABASE_URL || "sqlite:memory;";

const sequelize = new Sequelize(DATABASE_URL, { logging: false });

const user = userModel(sequelize, DataTypes);
const orders = ordersModel(sequelize, DataTypes);
const stores = storesModel(sequelize, DataTypes);

const ordersCollection = new Collection(orders);
const storesCollection = new Collection(stores);
const userCollection = new Collection(user);

user.hasMany(orders, {
  foreignKey: "driverId",
  sourceKey: "id",
});

orders.belongsTo(orders, {
  foreignKey: "driverId",
  targetKey: "id",
});


//---------
stores.hasMany(reel, {
  foreignKey: "storeId",
  sourceKey: "id",
});
orders.belongsTo(stores, {
  foreignKey: "storeId",
  targetKey: "id",
});


module.exports = {
  db: sequelize,
  userCollection: userCollection,
  orders: ordersCollection,
  stores: storesCollection,
  users: user,
};
