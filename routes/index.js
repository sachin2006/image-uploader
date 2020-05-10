var express = require('express');
var router = express.Router();
var helpers = require('../helpers/google-cloud-storage')
var multer = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    var filetype = '';
    if (file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    cb(null, 'ss_image_' + Date.now() + '.' + filetype);
  }
});
var upload = multer({ storage: storage });
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/upload/images", upload.array("images"), async (req, res) => {
  try {
    let filesArray = [];
    for (const file of req.files) {
      await helpers.copyFileToGCS(file).then(publicUrl => {
        console.log(publicUrl)
        fileJSONObj = { 'fileName': file.filename, 'fileUrl': publicUrl }
        filesArray.push(fileJSONObj);
      });
    }
    res.send(filesArray);
  } catch (error) {
    console.log(error);
    res.send(400);
  }
});
module.exports = router;


