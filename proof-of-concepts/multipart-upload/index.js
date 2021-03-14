
var express = require('express');
var multiparty = require('multiparty');
var format = require('util').format;

var app = module.exports = express();

app.get('/', function (req, res) {
    res.send('<form method="post" enctype="multipart/form-data">'
        + '<p>Image: <input type="file" name="image" /></p>'
        + '<p><input type="submit" value="Upload" /></p>'
        + '</form>');
});

app.post('/', function (req, res, next) {
    // create a form to begin parsing
    console.log(req)
    res.send("OK").status(200)
});

/* istanbul ignore next */
if (!module.parent) {
    app.listen(3002);
    console.log('Express started on port 3002');
}