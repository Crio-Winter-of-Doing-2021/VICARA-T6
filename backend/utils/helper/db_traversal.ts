const Files = require("../../db/models/filesSchema");

export {};

async function traverseDirectory(
  parentID,
  folderString,
  directoryStructure,
  directoryNeededInResult = false
) {
  const result = await Files.find({ parent: parentID });

  for (let i = 0; i < result.length; i++) {
    const file = result[i];
    if (file.directory) {
      if (directoryNeededInResult) {
        directoryStructure.push({
          folderPath: folderString,
          fileName: file.name,
          fileKey: file._id.toString(),
        });
      }

      await traverseDirectory(
        file._id,
        folderString + file.name + "/",
        directoryStructure
      );
    } else {
      directoryStructure.push({
        folderPath: folderString,
        fileName: file.name,
        fileKey: file._id.toString(),
      });
    }
  }
}

module.exports = traverseDirectory;
