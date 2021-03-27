const router = require("express").Router();
const listDirectory = require("./list_directory");
const listParentDirectories = require("./list_parent_directories");
const uploadFile = require("./upload_file");
const uploadFolder = require("./upload_folder");
const createDirectoryStucture = require("./create_directory_stucture");
const downloadFile = require("./download_file");
const downloadFolder = require("./download_folder");

router.use("/list_directory", listDirectory);
router.use("/list_parent_directories", listParentDirectories);
router.use("/upload_file", uploadFile);
router.use("/upload_folder", uploadFolder);
router.use("/download_file", downloadFile);
router.use("/download_folder", downloadFolder);
router.use("/create_directory_stucture", createDirectoryStucture);

router.get("/", (req, res) => {
  res.status(200).json({ message: "Connected!" });
});

module.exports = router;
