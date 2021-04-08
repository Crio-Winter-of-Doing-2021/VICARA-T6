import {File} from '../models/file.model';

async function traverseDirectory(
    parentId: string,
    folderString: string,
    directoryStructure: {}[],
    directoryNeededInResult = false
) {
    const result = await File.find({ parentId });

    for (let i = 0; i < result.length; i++) {
        const file = result[i];
        if (file.isDirectory) {
            if (directoryNeededInResult) {
                directoryStructure.push({
                    folderPath: folderString,
                    ...JSON.parse(JSON.stringify(file)),
                });
            }

            await traverseDirectory(
                file._id,
                folderString + file.fileName + "/",
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

export {traverseDirectory};
