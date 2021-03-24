require('./db/connection')
const express = require('express');         // Express Web Server
const cors = require('cors')
const Files = require("./models/filesSchema");
const app = express(); // Initialize the express web server
const AWS = require("aws-sdk");

app.use(cors());

AWS.config.loadFromPath('./config.json');

async function traverseDirectory(parentID, folderString, directoryStructure) {

    // console.log("FOLDER STRING", folderString)
    const result = await Files.find({ parent: parentID });
    // console.log(result);

    for (let i = 0; i < result.length; i++) {
        const file = result[i]
        if (file.directory) {
            // console.log("It's a directory", file.name);
            await traverseDirectory(file._id, folderString + file.name + "/", directoryStructure)
        }
        else {
            directoryStructure.push({
                folderPath: folderString,
                fileName: file.name,
                fileKey: file._id.toString()
            })
            // console.log("It's a file", folderString + file.name);
        }
    }

}

app.get("/get_directory", async (req, res, next) => {
    let parentFolderID = "605b6a9e5b61062b78a8e432";
    let folderString = "New Folder/";
    var bucketName = 'vicara-t6';
    let directoryStructure = [];

    await traverseDirectory(parentFolderID, folderString, directoryStructure)

    console.log(directoryStructure);

    const s3 = new AWS.S3({ params: { Bucket: bucketName }, region: 'ap-south-1' });

    for (let i = 0; i < directoryStructure.length; i++) {
        const { fileName, fileKey, folderPath } = directoryStructure[i]

        const params = {
            Bucket: bucketName,
            CopySource: bucketName + '/' + fileKey,
            Key: folderPath + fileName
        };

        s3.copyObject(params, function (copyErr, copyData) {
            if (copyErr) {
                console.log(copyErr);
            }
            else {
                console.log('Copied: ', params.Key);
            }
        });

    }

    res.json({ "OK": 200 })
})

/**
 * Serve the basic index.html with upload form
 */
app.route('/').get((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<form action="upload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" multiple name="fileToUpload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});

const server = app.listen(3001, function () {
    console.log(`Listening on port ${server.address().port}`);
});
