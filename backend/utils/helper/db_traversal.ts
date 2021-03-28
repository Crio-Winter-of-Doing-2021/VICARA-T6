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
          ...JSON.parse(JSON.stringify(file)),
        });
      }

      await traverseDirectory(
        file._id,
        folderString + file.name + "/",
        directoryStructure,
        directoryNeededInResult
      );
    } else {
      directoryStructure.push({
        folderPath: folderString,
        ...JSON.parse(JSON.stringify(file)),
      });
    }
  }
}

module.exports = traverseDirectory;
