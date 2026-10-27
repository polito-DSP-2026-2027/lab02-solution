'use strict';
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, './uploads'); },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9)
      + path.extname(file.originalname).toLowerCase());
  }
});

module.exports = storage;
