const router = require("express").Router();
const listDirectory = require("./list_directory");

router.use("/list_directory", listDirectory);

router.get("/", (req, res) => {
  res.status(200).json({ message: "Connected!" });
});

module.exports = router;
