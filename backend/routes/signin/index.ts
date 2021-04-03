const signin = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../../db/models/userSchema");

export {};

signin.post("/", async (req, res) => {
  console.log(req.session.jwt);

  const { email, password } = req.body;

  console.log(email, password);

  const existingUser = await User.findOne({ email, password });

  if (!existingUser) {
    console.log("Invalid Credentials");
    return res.status(400).send({ err: "User not found" });
  }

  // Generate JWT
  const userJwt = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
    },
    "hardikkhandelwal",
    {
      expiresIn: "4h",
    }
  );

  // Store it on cookie
  req.session = {
    jwt: userJwt,
  };

  return res.status(200).send(existingUser);
});

module.exports = signin;
