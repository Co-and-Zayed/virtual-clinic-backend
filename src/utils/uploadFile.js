const AWS = require("aws-sdk");
require("dotenv").config();
const multer = require('multer');
const fs = require("fs");

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,        // Your AWS Access Key ID
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,  // Your AWS Secret Access Key
    region: 'eu-west-3',                // Your AWS region
  });
  
const s3 = new AWS.S3();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save uploaded files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Rename files with a timestamp
    },
});

const upload = multer({ storage: storage }); 

// Construct an absolute file path based on the current module's location

const uploadFile = (originalName, buffer, successCallback, failureCallback) => {
    
    const filePath = __dirname.split("utils")[0] + "uploads" + '\\' + originalName;

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: originalName, // Use the original filename as the S3 object key
        Body: fs.readFileSync(filePath),
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.log(`File Upload Failed: ${err}`);
            failureCallback();
            return;
        } else {
            console.log(`File Upload Success`);
            successCallback();
        }
    });
}

module.exports = { upload, uploadFile };