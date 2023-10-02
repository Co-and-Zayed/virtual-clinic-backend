const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

const sendMail = (to, subject, text, successCallback, failureCallback) => {
    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(`Mail Service Error Occured: ${err}`);
            failureCallback();
            return;
        } else {
            callback();
        }
    });
}

module.exports = { sendMail };