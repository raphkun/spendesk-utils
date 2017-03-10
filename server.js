var manifest = require('./package.json');
var express = require('express');
var multer = require('multer')
var fs = require('fs');
var Spendesk = require('./spendeskutils.js');

var upload = multer({dest: 'uploads/', fileFilter: function (req, file, cb) {
    cb(null, file.mimetype === 'application/pdf');
}}).single('file');

var app = express();

app.use(express.static('public'));

app.get('/api', function (req, res) {
    return res.send(manifest.name + ' ' + manifest.version);
});

app.post('/api/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            return res.status(500).send(err);
        }

        var uploadedFile = req.file;
        if (uploadedFile) {
            Spendesk.extractVATFromPDF(uploadedFile.path, [])
                .then(function (result) {
                    fs.unlink(uploadedFile.path);
                    return res.send(uploadedFile.originalname + ' : ' + result);
                })
                .fail(function (error) {
                    fs.unlink(uploadedFile.path);
                    return res.status(500).send(error);
                })
            ;
        } else {
            return res.status(500).send("File filtered");
        }
    })
});

app.listen(3000, function () {
    console.log('App listening on port 3000!');
});