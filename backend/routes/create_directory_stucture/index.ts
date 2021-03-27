const createDirectoryStructure = require("express").Router();
const Files = require("../../db/models/filesSchema");

export {};

createDirectoryStructure.post("/", async (req, res, next) => {
  let { owner: ownerID, parent: parentID } = req.query;

  req.busboy.on(
    "field",
    async function (
      fieldname,
      val,
      fieldnameTruncated,
      valTruncated,
      encoding,
      mimetype
    ) {
      const output = {};
      let file_structure = {};
      let final_structure = {};
      let current;
      const files = JSON.parse(val);
      let tempID = parentID;
      let db_calls = 0;

      for (const { path } of files) {
        current = output;
        parentID = tempID;
        let childID;
        let files_string = "";

        for (const segment of path.split("/")) {
          //If segment not empty and not a File
          if (segment !== "" && !segment.includes(".")) {
            //If segment already in our HashMap we update the IDs
            if (segment in current) {
              files_string = files_string + "/" + segment;
              parentID = file_structure[segment];
              childID = parentID;
            }

            //If segment doesn't exist in our HashMap we create the
            //folder in moongodb and append the file_String variable
            //And also update the hashmap
            if (!(segment in current)) {
              current[segment] = {};

              const result = await Files.findOne({
                name: segment,
                parent: parentID,
              });

              //If folder already exists in our DB
              //Update the files_string, child and parent IDs
              if (result) {
                db_calls += 1;
                files_string = files_string + "/" + segment;
                file_structure[segment] = result._id;
                parentID = result._id;
                childID = parentID;
              } else {
                //Else create it and update the data
                const folder = new Files({
                  name: segment,
                  directory: true,
                  parent: parentID,
                  owner: ownerID,
                });

                const { _id } = await folder.save();
                files_string = files_string + "/" + segment;
                file_structure[segment] = _id;
                parentID = _id;
                childID = parentID;
              }
            }

            current = current[segment];
          }
        }

        final_structure[files_string] = childID;
      }

      console.log(final_structure);

      res.json({ result: final_structure }).status(200);
    }
  );

  req.pipe(req.busboy); // Pipe it trough busboy
});

module.exports = createDirectoryStructure;
