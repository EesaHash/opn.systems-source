const express = require("express");
const router = express.Router();
const { transporter } = require("../email/emailSenderController");
const { getUsers } = require("./UserController");

router.post("/", async (req, res) => {
    try{
        const {email} = req.body;
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
        sendEmail(user.email, user.password);
        return res.status(200).json({
            status: true,
            message: "Please check your email's inbox!"
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

const sendEmail = (email, password) => {
    try{
        const url = `${process.env.FRONTEND_URL}/signin`;
        const mailContent = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "OPN.SYSTEM FORGET PASSWORD",
            html: `<h1>The password for account: ${email} is '${password}'.\nNow you can go back and fill in your information ${url}.</h1>`
        };
        transporter.sendMail(mailContent, (error, info) => {
            if(error) console.log(error);
            else console.log(`Successfully sent forget password email to ${email}`);
        });
    }catch(error){
        console.log(error);
    }
};