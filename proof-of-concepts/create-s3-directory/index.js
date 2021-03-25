require("./db/connection");
const express = require("express"); // Express Web Server
const cors = require("cors");
const Files = require("./models/filesSchema");
const app = express(); // Initialize the express web server
const AWS = require("aws-sdk");
const S3Zipper = require("./aws-s3-zipper");
const fs = require("fs")

app.use(cors());

AWS.config.loadFromPath("./config.json");

const config = {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: "ap-south-1",
    bucket: "vicara-t6",
};

const zipper = new S3Zipper(config);

async function traverseDirectory(parentID, folderString, directoryStructure) {
    // console.log("FOLDER STRING", folderString)
    const result = await Files.find({ parent: parentID });
    // console.log(result);

    for (let i = 0; i < result.length; i++) {
        const file = result[i];
        if (file.directory) {
            // console.log("It's a directory", file.name);
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
            // console.log("It's a file", folderString + file.name);
        }
    }
}

app.get("/get_directory", async (req, res, next) => {
    let parentFolderID = "605cb52e8957fa101007e74b";
    let folderString = "College/";
    var bucketName = "vicara-t6";
    let directoryStructure = [];

    await traverseDirectory(parentFolderID, folderString, directoryStructure);

    console.log(directoryStructure);

    const s3 = new AWS.S3({
        params: { Bucket: bucketName },
        region: "ap-south-1",
    });

    for (let i = 0; i < directoryStructure.length; i++) {
        const { fileName, fileKey, folderPath } = directoryStructure[i];

        const params = {
            Bucket: bucketName,
            CopySource: bucketName + "/" + fileKey,
            Key: folderPath + fileName,
        };

        s3.copyObject(params, function (copyErr, copyData) {
            if (copyErr) {
                console.log(copyErr);
            } else {
                console.log("Copied: ", params.Key);
            }
        });
    }

    res.json({ OK: 200 });
});


app.get("/download_directory", (req, res, next) => {
    console.log("YOU CALLED ME");
    res.set("content-type", "application/zip"); // optional
    zipper.streamZipDataTo(
        {
            pipe: res,
            folderName: "College",
            startKey: null, // could keep null
            recursive: true,
        },
        function (err, result) {
            if (err) console.error(err);
            else {
                console.log(result);
            }
        }
    );
});

app.get("/download_file", async (req, res, next) => {
    let fileID = "605b70815b61062b78a8e440";
    var bucketName = "vicara-t6";

    const s3 = new AWS.S3({
        params: { Bucket: bucketName },
        region: "ap-south-1",
    });

    const params = {
        Bucket: bucketName,
        Key: fileID,
    };

    s3.getObject(params, function (err, data) {
        if (err === null) {
            console.log(data);
            // res.attachment('file.png'); // or whatever your logic needs
            res.send(data.Body);
            // fs.writeFileSync('file.png', data.Body)
        } else {
            res.status(500).send(err);
        }
    });

    // res.json({ "OK": 200 })
});

/**
 * Serve the basic index.html with upload form
 */
app.route("/").get((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(
        '<form action="upload" method="post" enctype="multipart/form-data">'
    );
    res.write('<input type="file" multiple name="fileToUpload"><br>');
    res.write('<input type="submit">');
    res.write("</form>");
    return res.end();
});

const server = app.listen(3001, function () {
    console.log(`Listening on port ${server.address().port}`);
});
