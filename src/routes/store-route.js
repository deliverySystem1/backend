const express = require("express");
const storesRouter = express.Router();

const { stores } = require("../models/index");
const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

storesRouter.get("/stores", getAllStores);
storesRouter.post("/stores", bearerAuth, acl("create"), createStore);
storesRouter.put("/stores/:id", bearerAuth, acl("update"), updateStore);
storesRouter.delete("/stores/:id", bearerAuth, acl("delete"), deleterStore);

async function getAllStores(req, res) {
  let stores= await stores.get();
  res.status(200).json(stores);
}

async function createStore(req, res) {
  let storeData = req.body;
  let store = await stores.create(storeData);
  res.status(201).json(store);
}

async function updateStore(req, res) {
  let id = parseInt(req.params.id);
  let newData = req.body;
  let store = await stores.update(id, newData);
  res.status(201).json(store);
}
async function deleterStore(req, res) {
  let id = parseInt(req.params.id);
  let store = await stores.delete(id);
  res.status(204).json(store);
}

module.exports = storesRouter;
