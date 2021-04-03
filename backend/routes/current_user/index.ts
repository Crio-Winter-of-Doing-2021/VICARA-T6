const currentUser = require("express").Router();
const jwt = require("jsonwebtoken");

export {};

currentUser.get("/", async (req, res, next) => {
  if (!req.session?.jwt) {
    res.status(400).send({ err: "User not logged in" });
  }

  try {
    req.currentUser = jwt.verify(req.session.jwt, "hardikkhandelwal");
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.status(400).send({ err: "Session Expired" });
    }
  }

  res.send({ currentUser: req.currentUser || null });
});

module.exports = currentUser;
