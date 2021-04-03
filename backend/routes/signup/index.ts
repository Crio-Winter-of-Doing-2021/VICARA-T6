const signup = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../../db/models/userSchema");

export {};

signup.post("/", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).send({ err: "Email is taken" });
  }

  const user = new User({ email, password });
  await user.save();

  // Generate JWT
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
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

  res.status(201).send(user);
});

module.exports = signup;
