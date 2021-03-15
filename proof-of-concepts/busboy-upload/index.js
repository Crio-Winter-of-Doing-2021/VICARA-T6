const express = require('express');         // Express Web Server
const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');             // Classic fs
const cors = require('cors')
const readBlob = require('read-blob');


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
    req.pipe(req.busboy); // Pipe it trough busboy

    req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(`Upload of '${filename, fieldname}' started`);
        // Create a write stream of the new file

        if (fieldname.includes("blob")) {
            console.log(fieldname)
            const fstream = fs.createWriteStream(path.join(uploadPath, fieldname + ".zip"));
            // Pipe it trough
            file.pipe(fstream);

            // On finish of the upload
            fstream.on('close', () => {

            });
        }
        else {
            const fstream = fs.createWriteStream(path.join(uploadPath, filename));
            // Pipe it trough
            file.pipe(fstream);

            // On finish of the upload
            fstream.on('close', () => {

            });
        }

    });

    req.busboy.on('finish', function () {
        console.log("DONE PARSING FORM")
        res.sendStatus(200);
    });
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
