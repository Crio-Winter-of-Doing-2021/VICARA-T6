const currentUser = require("express").Router();
const currentUserMiddleware = require("../middleware");

export {};

currentUser.get(
  "/",
  currentUserMiddleware.currentUser,
  async (req, res, next) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

module.exports = currentUser;
