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

app.post('/upload', async (req, res, next) => {

    var uploadStartTime = new Date(),
        busboyFinishTime = null,
        s3UploadFinishTime = null;


    req.busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
        const parentID = fieldname;
        const ownerID = "605256109934f80db98712ea";
        const url = "https://google.com"

        file.on('end', function () {
            // console.log("LOL I'm ended")
            // res.json({ msg: "ENDED" })
        })

        file.on('data', function (data) {
        })

        const new_file = new Files({
            name: filename,
            directory: false,
            owner: ownerID,
            parent: parentID,
            type: 'image',
            extension: 'jpeg',
            size: '1024',
            url
        })

        await new_file.save();
    });

    req.busboy.on('finish', function () {
        // send response
        console.log('Done parsing form!');
        res.status(200).json({ result: "OK" });


        busboyFinishTime = new Date();

        if (busboyFinishTime && s3UploadFinishTime) {
            console.log({
                uploadStartTime: uploadStartTime,
                busboyFinishTime: busboyFinishTime,
                s3UploadFinishTime: s3UploadFinishTime
            });
        }

    });

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
