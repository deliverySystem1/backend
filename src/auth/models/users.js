"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET || "secretstring";

const userModel = (sequelize, DataTypes) => {
  const model = sequelize.define("users", {
    username: { type: DataTypes.STRING, required: true, unique: true },
    password: { type: DataTypes.STRING, required: true },
    email: { type: DataTypes.STRING, required: true, unique: true },
    role: {
      type: DataTypes.ENUM("driver", "employee", "manager", "admin"),
      required: true,
      defaultValue: "driver",
    },
    // image: { type: DataTypes.TEXT },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign(
          { username: this.username, role: this.role, id: this.id },
          SECRET
        );
      },
      set(tokenObj) {
        let token = jwt.sign(tokenObj, SECRET);
        return token;
      },
    },
    capabilities: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          driver: ["read", "update"],
          employee: ["read", "create", "update", "delete"],
          manager: [
            "read",
            "create",
            "update",
            "delete",
            "readManager",
            "createManager",
            "updateManager",
            "deleteManager",
          ],
          admin: [
            "read",
            "create",
            "update",
            "delete",
            "readManager",
            "createManager",
            "updateManager",
            "deleteManager",
            "readAdmin",
            "createAdmin",
            "updateAdmin",
            "deleteAdmin",
          ],
        };
        return acl[this.role];
      },
    },
  });

  model.beforeCreate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username: username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return user;
    }
    throw new Error("Invalid User");
  };

  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, SECRET);
      const user = await this.findOne({
        where: { username: parsedToken.username },
      });
      if (user) {
        return user;
      }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return model;
};

module.exports = userModel;
