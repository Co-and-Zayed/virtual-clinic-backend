const { uploadFile } = require("../utils/uploadFile");

const getRoute = (req, res) => {
    return res.status(200).json({message: 'Success'});
};

const fileUploadRoute = (req, res) => {
    
    const { originalname, buffer } = req.file;

    uploadFile(originalname, buffer, () => {
        return res.status(200).json({ message: 'File Uploaded Successfully' });
    }, () => {
        return res.status(400).json({ message: 'File Upload Failure' });
    });
}

module.exports = { getRoute, fileUploadRoute }

const test = "tesssst"