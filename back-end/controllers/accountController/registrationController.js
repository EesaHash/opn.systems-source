const express = require ("express");
const router = express.Router();
const { sendEmailConfirmation } = require("../emailController/emailSenderController");
const { transporter } = require("../emailController/emailSenderController");
const User = require("../../models/user");
const { isEmailExist } = require("./UserController");

router.post("/", async (req, res) => {
    try{
        const {username, email, password, emails} = req.body;
        
        // Create new account
        const user = await createAccount(username, email, password);
        if(!user){
            return res.status(400).json({
                status: false,
                message: "Failed to create new user!"
            });
        }

        // Send Email Verification
        sendEmailConfirmation(email);

        // Send Email Invitation
        for(let i = 0; i < emails.length; ++i){
            const temp = emails[i];
            const emailExistence = await isEmailExist(temp);
            if(!emailExistence){
                sendEmail(temp, email);
            }
        }

        return res.status(200).json({
            status: true,
            user: user,
            message: "Successfully created new user!"
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

const createAccount = async (username, email, password) => {
    try{
        const user = {
            username: String(username).toLowerCase(),
            email: String(email).toLowerCase(),
            password: password
        };
        return await User.create({
            email: user.email,
            username: user.username,
            password: user.password
        });
    }catch(error){
        console.log(error);
    }
};

const sendEmail = (email, emailSource) => {
    try{
        const url = `${process.env.FRONTEND_URL}/signup`;
        const mailContent = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "OPN.SYSTEM INVITATION",
            html: `<h1>${emailSource} is inviting you to register to Opn.Systems.\nPlease follow the attached link to proceed\n${url}</h1>`
        };
        transporter.sendMail(mailContent, (error, info) => {
            if(error) console.log(error);
            else console.log(`Successfully sent invitation email to ${email}`);
        });
    }catch(error){
        console.log(error);
    }
};