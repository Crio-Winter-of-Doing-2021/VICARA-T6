require('./db/connection')
const express = require('express');         // Express Web Server
const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');             // Classic fs
const cors = require('cors')
const bodyParser = require('body-parser')
const Files = require("./models/filesSchema");
const app = express(); // Initialize the express web server
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const ObjectId = require('mongoose').Types.ObjectId;
app.use(busboy({
    highWaterMark: 10 * 1024 * 1024, // Set 20 MB buffer
})); // Insert the busboy middle-ware

const uploadPath = path.join(__dirname, 'fu/'); // Register the upload path

fs.ensureDir(uploadPath); // Make sure that he upload path exits

app.post('/folders', async (req, res, next) => {
    let { ownerID, parentID } = req.body;

    const result = await Files.find({ owner: ownerID, parent: parentID })
    res.json(result);
})

/**
 * Create route /upload which handles the post request
 */
app.post('/upload', async (req, res, next) => {

    var uploadStartTime = new Date(),
        busboyFinishTime = null,
        s3UploadFinishTime = null;

    req.busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        console.log('Field [' + fieldname + ']: value: ' + val);
        console.log(fieldnameTruncated, valTruncated, encoding, mimetype)
    });


    req.busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
        // process files
        // console.log(`Upload of '${filename}' started`);
        console.log(fieldname, filename)

        file.on('end', function () {
            // console.log("LOL I'm ended")
            // res.json({ msg: "ENDED" })
        })

        file.on('data', function (data) {
        })

        let path = fieldname.replace(filename, "")?.split("/")?.filter(e => e.length)

        const ownerID = "605256109934f80db98712ea";
        let parentID = "605256109934f80db98712ea";
        const url = "https://google.com"

        if (path?.length) {

            if (ObjectId.isValid(path[0])) {
                parentID = path[0];
                path.shift()
            }

            console.log(path);

            //It's a folder

            const result = await Files.find({ name: filename, parent: parentID });

            if (result.length) {
                await Files.findByIdAndUpdate(result._id, { size: 1025 });
            }
            else {

                for (let i = 0; i < path.length; i++) {
                    const result = await Files.findOne({ name: path[i], parent: parentID });

                    if (result) {
                        console.log(result);
                        console.log("Folder already exists")
                        parentID = result._id;
                    }
                    else {
                        console.log("Create new folder entry")

                        const folder = new Files({
                            name: path[i],
                            directory: true,
                            parent: parentID,
                            owner: ownerID
                        })

                        const { _id: childFolderID } = await folder.save();
                        // await Files.findByIdAndUpdate(parentID, { children: [childFolderID] });
                        parentID = childFolderID;
                    }
                }

                const file = new Files({
                    name: filename,
                    directory: false,
                    owner: ownerID,
                    parent: parentID,
                    type: 'image',
                    extension: 'jpeg',
                    size: '1024',
                    url
                })

                await file.save();
                // const { _id: fileID, children: childrens } = await file.save();

                // await Files.findByIdAndUpdate(parentID, { children: [...childrens, fileID] })
            }
        }
        else {
            //It's a file
            console.log("FILE FOUNDED")
        }

        // let s3 = new AWS.S3({
        //     params: { Bucket: 'vicara-t6', Key: filename, Body: file },
        //     options: { partSize: 5 * 1024 * 1024, queueSize: 1 }   // 5 MB
        // });

        // s3.upload().on('httpUploadProgress', function (evt) {
        //     console.log(evt);
        // }).send(function (err, data) {

        //     s3UploadFinishTime = new Date();

        //     if (busboyFinishTime && s3UploadFinishTime) {
        //         console.log("FINAL CALL HERE");
        //         res.json({
        //             uploadStartTime: uploadStartTime,
        //             busboyFinishTime: busboyFinishTime,
        //             s3UploadFinishTime: s3UploadFinishTime
        //         });
        //     }
        //     console.log(err, data);
        // });
    });

    req.busboy.on('finish', function () {
        // send response
        console.log('Done parsing form!');
        res.status(200).json({ msg: "FINISHED" });


        busboyFinishTime = new Date();

        if (busboyFinishTime && s3UploadFinishTime) {
            console.log({
                uploadStartTime: uploadStartTime,
                busboyFinishTime: busboyFinishTime,
                s3UploadFinishTime: s3UploadFinishTime
            });
        }

    });

    return req.pipe(req.busboy); // Pipe it trough busboy
});


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
