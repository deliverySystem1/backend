const express = require("express");
const ordersRouter = express.Router();

const { orders } = require("../models/index");
const { userCollection } = require("../models/index");

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

ordersRouter.get("/orders", getOrders);
ordersRouter.get("/storeorders/:id", bearerAuth, acl("create"), getStoreOrders);
ordersRouter.get("/driverorders/:id", bearerAuth, acl("read"), getDriverOrders);
ordersRouter.post("/orders", bearerAuth, acl("create"), createOrder);
ordersRouter.put("/orders/:id", bearerAuth, acl("update"), updateOrder);
ordersRouter.delete("/orders/:id", bearerAuth, acl("delete"), deleterOrder);

async function getOrders(req, res) {
  let orderRecord = await orders.get();
  res.status(200).json(orderRecord);
}
//===========
async function getStoreOrders(req, res) {
  let storeId = parseInt(req.params.id);
  let orderRecord = await orders.get({ where: { storeId: storeId } });
  res.status(200).json(orderRecord);
}
async function getDriverOrders(req, res) {
  let driverId = parseInt(req.params.id);
  let orderRecord = await orders.get({ where: { driverId: driverId } });
  res.status(200).json(orderRecord);
}

async function createOrder(req, res) {
  let orderData = req.body;
  let orderRecord = await orders.create(orderData);
  res.status(201).json(orderRecord);
}

async function updateOrder(req, res) {
  let id = parseInt(req.params.id);
  let newOrderData = req.body;
  let orderRecord = await orders.update(id, newOrderData);
  res.status(201).json(orderRecord);
}
async function deleterOrder(req, res) {
  let id = parseInt(req.params.id);
  let orderRecord = await orders.delete(id);
  res.status(204).json(orderRecord);
}

module.exports = ordersRouter;
