const AWS = require("aws-sdk");
require("dotenv").config();
const multer = require("multer");
const multerS3 = require("multer-s3");
const { getBucketPrefix } = require("./getBucketPrefix");
const fs = require("fs");

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID, // Your AWS Access Key ID
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY, // Your AWS Secret Access Key
});

const s3 = new AWS.S3();

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const modifiedFileName = `${getBucketPrefix(req)}${file.originalname}`;
      cb(null, modifiedFileName);
    },
  }),
});

module.exports = { uploadS3 };
