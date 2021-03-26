const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        acl: 'public-read',
        s3,
        bucket: 'vicara-t6',
        onError: function (err, next) {
            console.log('error', err);
            res.render('error');
        },
        key: function (req, file, cb) {
            console.log("UPLOADED NIGGER")
            req.file = file.originalname;
            cb(null, file.originalname);
        }
    })
});

module.exports = upload;