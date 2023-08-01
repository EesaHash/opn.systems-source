const express = require("express");
const router = express.Router();
const { transporter } = require("../email/emailSenderController");
const { getUsers } = require("./UserController");
const jwt = require("jsonwebtoken");
require ("dotenv").config();

router.post("/", async (req, res) => {
    try{
        const {email, OTP} = req.body;
        let user  = await getUsers(email);
        user = user[0];
        // Check email input
        if(!user){
            return res.status(400).json({
                status: false,
                message: "Unregistered email address"
            });
        }
        // Send forget password link
        sendEmail(user.email, OTP);
        return res.status(200).json({
            status: true,
            message: "Please check your email's inbox! We sent you the OTP code needed to reset your password!"
        });
    }catch(error){
        console.log(error);
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});
module.exports = router;

const sendEmail = (email, OTP) => {
    try{
        const mailContent = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "OPN.SYSTEM FORGOT PASSWORD",
            html: `<h1>Here is your OTP code to reset your account's password: ${OTP}.</h1>`
        };
        transporter.sendMail(mailContent, (error, info) => {
            if(error) console.log(error);
            else console.log(`Successfully sent forgot password email to ${email}`);
        });
    }catch(error){
        console.log(error);
    }
};