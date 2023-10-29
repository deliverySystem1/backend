"use strict";

// const { db } = require("../models/index") ;
const express = require("express");
const authRouter = express.Router();
const { Op } = require("sequelize");
const { users } = require("../models/index");
const basicAuth = require("./middleware/basic.js");

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

authRouter.post("/signup",
// acl("createAdmin"),
async (req, res, next) => {
  try {
    let userRecord = await users.create(req.body);
    res.status(201).json(userRecord);
  } catch (e) {
    next(e.message);
  }
});


authRouter.post(
  "/register",
  bearerAuth,
  acl("createManager"),
  async (req, res, next) => {
    try {
      if (req.body.role === "driver" || req.body.role === "employee") {
        let userRecord = await users.create(req.body);
        res.status(201).json(userRecord);
      } else {
        res
          .status(400)
          .json({
            error: "Invalid role. Allowed roles are 'driver' and 'employee'",
          });
      }
    } catch (e) {
      next(e);
    }
  }
);

authRouter.post("/signin", basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token,
  };
  res.status(200).json(req.user);
});

authRouter.get("/allusers", bearerAuth, acl("readAdmin"), getAllUsers);
async function getAllUsers(req, res) {
  const allusers = await users.findAll();
  res.status(200).json(allusers);
}

authRouter.get("/allemployees", bearerAuth, acl("readManager"), getAllUsers);
async function getAllUsers(req, res) {
  const allusers = await users.findAll({
    where: { role: { [Op.ne]: "admin" } },
  });
  res.status(200).json(allusers);
}

// authRouter.get("/oneuser/:id", bearerAuth, acl("readUser"), getOneUsers);
// async function getOneUsers(req, res) {
//   let id = parseInt(req.params.id);
//   const user = await users.findOne({ where: { id: id } });
//   res.status(200).json({ username: user.username, image: user.image });
// }

module.exports = authRouter;
