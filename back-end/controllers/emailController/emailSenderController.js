const nodemailer = require("nodemailer");
require ("dotenv").config();
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmailConfirmation = (email) => {
    try{
        const accessToken = jwt.sign(JSON.parse(`{"email":"${email}"}`), process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        const url = `${process.env.PORT_URL}/confirmation/${accessToken}`;
        const mailContent = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "Subject Recommendation Forget Password",
            html: `Please click the following link to activate your account (the link will only be available for 60 minutes): <a href="${url}">${url}</a>`
        };
        transporter.sendMail(mailContent, (error, info) => {
            if(error) console.log(error);
            else console.log(info.response);
        });
    }catch(error){
        console.log(error);
    }
};

module.exports = { transporter, sendEmailConfirmation }