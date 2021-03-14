const express = require('express');
const multer = require('multer');
const path = require('path');
const exphbs = require('express-handlebars');
const AWS = require("aws-sdk");

const app = express();

app.use(express.static(__dirname + '/public'));

app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

AWS.config.loadFromPath('./config.json');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'fu/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


app.get('/', (req, res) => {
    return res.render('index', { layout: false });
});

app.post('/upload', (req, res) => {
    console.log(req.files);
    let upload = multer({ storage: storage }).array('multiple_images');

    upload(req, res, function (err) {
        console.log(req.files);
        const files = req.files;

        // Loop through all the uploaded images and display them on frontend
        res.json({ files }).status(200)
    });
});

app.listen(3001, () => {
    console.log('Express server listening on port 3001');
});