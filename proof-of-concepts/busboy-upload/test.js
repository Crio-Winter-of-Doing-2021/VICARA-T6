const express = require('express');         // Express Web Server
const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');             // Classic fs
const cors = require('cors')
const AWS = require("aws-sdk");

AWS.config.loadFromPath('./config.json');

const app = express(); // Initialize the express web server
app.use(cors());

app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware

const uploadPath = path.join(__dirname, 'fu/'); // Register the upload path

fs.ensureDir(uploadPath); // Make sure that he upload path exits

/**
 * Create route /upload which handles the post request
 */
app.route('/upload').post((req, res, next) => {
    console.log(req.files);

    var uploadStartTime = new Date(),
        busboyFinishTime = null,
        s3UploadFinishTime = null;

    req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(`Upload of '${filename}' started`);

        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);


        // if (fieldname.includes("blob")) {
        //     s3 = new AWS.S3({
        //         params: { Bucket: 'vicara-t6', Key: filename + ".zip", Body: file },
        //         options: { partSize: 2 * 1024 * 1024, queueSize: 10 }   // 5 MB
        //     });
        // }
        // else {
        let s3 = new AWS.S3({
            params: { Bucket: 'vicara-t6', Key: filename, Body: file },
            options: { partSize: 2 * 1024 * 1024, queueSize: 10 }   // 5 MB
        });
        // }

        s3.upload().on('httpUploadProgress', function (evt) {
            console.log(evt);
        }).send(function (err, data) {
            s3UploadFinishTime = new Date();
            if (busboyFinishTime && s3UploadFinishTime) {
                res.json({
                    uploadStartTime: uploadStartTime,
                    busboyFinishTime: busboyFinishTime,
                    s3UploadFinishTime: s3UploadFinishTime
                });
            }
            console.log(err, data);
        });

    });

    req.busboy.on('finish', function () {
        console.log('Done parsing form!');
        busboyFinishTime = new Date();
        if (busboyFinishTime && s3UploadFinishTime) {
            res.json({
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
    res.write('<input type="file" webkitdirectory name="fileToUpload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});

const server = app.listen(3001, function () {
    console.log(`Listening on port ${server.address().port}`);
});
