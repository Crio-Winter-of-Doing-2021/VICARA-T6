const router = require("express").Router();
const listDirectory = require("./list_directory");
const uploadFile = require("./upload_file");
const uploadFolder = require("./upload_folder");
const downloadFile = require("./download_file");
const downloadFolder = require("./download_folder");
const deleteFile = require("./delete_file");
const deleteFolder = require("./delete_folder");
const copyFiles = require("./copy_files");
const moveFiles = require("./move_files");
const recentFiles = require("./recent_files");
const starredFiles = require("./starred_files");
const searchFiles = require("./search_files");
const listParentDirectories = require("./list_parent_directories");
const createDirectoryStucture = require("./create_directory_stucture");

router.use("/list_directory", listDirectory);
router.use("/upload_file", uploadFile);
router.use("/upload_folder", uploadFolder);
router.use("/download_file", downloadFile);
router.use("/download_folder", downloadFolder);
router.use("/delete_file", deleteFile);
router.use("/delete_folder", deleteFolder);
router.use("/move_files", moveFiles);
router.use("/copy_files", copyFiles);
router.use("/recent_files", recentFiles);
router.use("/starred_files", starredFiles);
router.use("/search_files", searchFiles);
router.use("/list_parent_directories", listParentDirectories);
router.use("/create_directory_stucture", createDirectoryStucture);

router.get("/", (req, res) => {
  res.status(200).json({ message: "Connected!" });
});

module.exports = router;
