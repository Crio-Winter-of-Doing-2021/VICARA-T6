const signout = require("express").Router();

export {};

signout.post("/", async (req, res) => {
  req.session = null;
  res.send({});
});

module.exports = signout;
