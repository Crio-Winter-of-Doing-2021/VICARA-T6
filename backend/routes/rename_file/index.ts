const renameFile = require("express").Router();
const Files = require("../../db/models/filesSchema");

export {};

renameFile.post("/", async (req, res, next) => {
  console.log(req.body);
  const { id, name, parent } = req.body;

  try {
    //Check if file exists

    const exists = await Files.find({ name, parent });

    if (exists?.length) {
      res.status(400).send({
        err: "File Already exists with that name",
      });
    } else {
      const result = await Files.findByIdAndUpdate(id, { name });

      res.send(result);
    }
  } catch (error) {
    //Return empty folder in case of error
    res.send({
      err: "File Not Found",
    });
  }
});

module.exports = renameFile;
