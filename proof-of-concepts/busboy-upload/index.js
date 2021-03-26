const express = require('express');         // Express Web Server
const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');             // Classic fs
const cors = require('cors')
const AWS = require("aws-sdk");
const PQueue = require("p-queue");

AWS.config.loadFromPath('./config.json');

const app = express(); // Initialize the express web server
app.use(cors());

app.use(busboy({
    highWaterMark: 10 * 1024 * 1024, // Set 20 MB buffer
})); // Insert the busboy middle-ware

const uploadPath = path.join(__dirname, 'fu/'); // Register the upload path

fs.ensureDir(uploadPath); // Make sure that he upload path exits

/**
 * Create route /upload which handles the post request
 */
app.route('/upload').post((req, res, next) => {

    const workQueue = new PQueue({ concurrency: 1 });

    async function handleError(fn) {
        workQueue.add(async () => {
            try {
                await fn();
            } catch (e) {
                console.log("REQUEST GOT CANCELLED")
                req.unpipe(busboy);
                workQueue.pause();
                next(e);
            }
        });
    }

    var uploadStartTime = new Date(),
        busboyFinishTime = null,
        s3UploadFinishTime = null;

    req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        handleError(() => {
            // process files
            console.log(`Upload of '${filename}' started`);

            console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

            let s3 = new AWS.S3({
                params: { Bucket: 'vicara-t6', Key: filename, Body: file },
                options: { partSize: 5 * 1024 * 1024, queueSize: 1 }   // 5 MB
            });

            s3.upload().on('httpUploadProgress', function (evt) {
                console.log(evt);
            }).send(function (err, data) {

                s3UploadFinishTime = new Date();

                if (busboyFinishTime && s3UploadFinishTime) {
                    console.log("FINAL CALL HERE");
                    res.json({
                        uploadStartTime: uploadStartTime,
                        busboyFinishTime: busboyFinishTime,
                        s3UploadFinishTime: s3UploadFinishTime
                    });
                }
                console.log(err, data);
            });
        });
    });

    req.busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        handleError(() => {
            console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        })
    });

    req.busboy.on('finish', function () {
        handleError(() => {
            // send response

            console.log('Done parsing form!');

            busboyFinishTime = new Date();

            if (busboyFinishTime && s3UploadFinishTime) {
                console.log({
                    uploadStartTime: uploadStartTime,
                    busboyFinishTime: busboyFinishTime,
                    s3UploadFinishTime: s3UploadFinishTime
                });
            }

        })
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
