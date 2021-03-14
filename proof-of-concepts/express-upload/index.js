const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(fileUpload());
// app.use('/public', express.static(__dirname + '/public'));


app.post('/upload', (req, res, next) => {
    console.log(req.files);
    // let imageFile = req.files.file;

    // imageFile.mv(`${__dirname}/public/${req.body.filename}.jpg`, function (err) {
    //     if (err) {
    //         return res.status(500).send(err);
    //     }

    //     res.json({ file: `public/${req.body.filename}.jpg` });
    // });

})

app.listen(3001, () => {
    console.log('3001');
});
