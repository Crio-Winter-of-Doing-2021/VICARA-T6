require('./db/connection')
const express = require('express');         // Express Web Server
const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');             // Classic fs
const cors = require('cors')
const bodyParser = require('body-parser')
const Files = require("./models/filesSchema");
const app = express(); // Initialize the express web server
const AWS = require("aws-sdk");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboy({
    highWaterMark: 10 * 1024 * 1024, // Set 10 MB buffer
})); // Insert the busboy middle-ware

const ObjectId = require('mongoose').Types.ObjectId;

AWS.config.loadFromPath('./config.json');


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
app.post('/create_directory', async (req, res, next) => {

    const ownerID = "605256109934f80db98712ea";
    let parentID = "605256109934f80db98712ea";

    req.busboy.on('field', async function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {

        const output = {};
        let file_structure = {};
        let final_structure = {}
        let current;
        const files = JSON.parse(val)
        let tempID = parentID;
        let db_calls = 0;

        for (const { path } of files) {
            current = output;
            parentID = tempID;
            console.log(path)
            let childID;
            let files_string = "";

            for (const segment of path.split('/')) {

                if (segment !== '' && !segment.includes(".")) {

                    if (segment in current) {
                        console.log("HERE FOUND SEGMENT", segment, files_string);
                        files_string = files_string + "/" + segment;
                        parentID = file_structure[segment];
                        childID = parentID
                    }

                    if (!(segment in current)) {
                        current[segment] = {};
                        console.log("HERE NO SEGMENT", segment);

                        const result = await Files.findOne({ name: segment, parent: parentID });

                        if (result) {
                            console.log("FOLDER ALREADY EXISTS", segment);
                            db_calls += 1;
                            files_string = files_string + "/" + segment;
                            file_structure[segment] = result._id;
                            parentID = result._id;
                            childID = parentID
                        }
                        else {
                            const folder = new Files({
                                name: segment,
                                directory: true,
                                parent: parentID,
                                owner: ownerID
                            })

                            const { _id } = await folder.save();
                            files_string = files_string + "/" + segment;
                            file_structure[segment] = _id;
                            parentID = _id;
                            childID = parentID
                        }
                    }

                    current = current[segment];
                }
            }

            final_structure[files_string] = childID
        }

        console.log(final_structure);
        console.log({ db_calls });

        res.json({ result: final_structure }).status(200)
    });

    req.pipe(req.busboy); // Pipe it trough busboy
});

async function upload(filename, file) {
    let s3 = new AWS.S3({
        params: { Bucket: 'vicara-t6', Key: filename, Body: file },
        options: { partSize: 5 * 1024 * 1024, queueSize: 10 }   // 5 MB
    });

    try {

        const data = await s3.upload().on('httpUploadProgress', function (evt) {
            console.log(evt);
        }).promise()

        return Promise.resolve(data);

    } catch (error) {
        return Promise.reject(error)
    }
}

app.post('/upload', async (req, res, next) => {

    let uploadStartTime = new Date(),
        busboyFinishTime = null,
        s3UploadFinishTime = null;

    let filesCount = 0, finished = false;


    req.busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
        const parentID = fieldname;
        const ownerID = "605256109934f80db98712ea";

        //Check if file already exists
        const result = await Files.findOne({ parent: parentID, name: filename, owner: ownerID })

        if (result === null) {
            ++filesCount;
        }

        file.on('end', function () {
            console.log("LOL I'm ended")
            // res.json({ msg: "ENDED" })
        })

        file.on('data', function (data) {
        })


        if (result === null) {

            const new_file = new Files({
                name: filename,
                directory: false,
                owner: ownerID,
                parent: parentID,
                type: 'image',
                extension: 'jpeg',
                size: '1024'
            })

            upload(new_file._id.toString(), file).then(async (data) => {
                console.log(data);
                await new_file.save()
                await Files.findByIdAndUpdate(new_file._id, { url: data.Location })
                filesCount--
                console.log("ADDED");

                if (filesCount === 0 && finished) {
                    console.log("HOHOHO");
                    res.json("OK").status(200)
                }

            }).catch(async (err) => {
                console.log(err);
                console.log("REMOVED");
                filesCount--
            })
        }
        else {
            console.log("FILE ALREADY EXISTS");

            if (filesCount === 0 && finished) {
                console.log("HOHOHO");
                res.json("OK").status(200)
            }
        }

        console.log({ filesCount });


        if (busboyFinishTime && s3UploadFinishTime) {
            console.log("FINAL CALL HERE");
        }

    });

    req.busboy.on('finish', function () {
        // send response
        console.log('Done parsing form!');

        finished = true;


        busboyFinishTime = new Date();

        if (busboyFinishTime && s3UploadFinishTime) {
            console.log("HERE I AM");
            console.log({
                uploadStartTime: uploadStartTime,
                busboyFinishTime: busboyFinishTime,
                s3UploadFinishTime: s3UploadFinishTime
            });
        }

    });

    req.busboy.on('end', function () {
        console.log("WHO ENDED ME");
    })

    req.pipe(req.busboy); // Pipe it trough busboy
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
