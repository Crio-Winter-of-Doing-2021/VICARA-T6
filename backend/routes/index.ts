const router = require("express").Router();
const listDirectory = require("./list_directory");
const listParentDirectories = require("./list_parentDirectories");

router.use("/list_directory", listDirectory);
router.use("/list_parent_directories", listParentDirectories);

router.get("/", (req, res) => {
  res.status(200).json({ message: "Connected!" });
});

module.exports = router;
