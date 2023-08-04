const express = require("express");
const router = express.Router();
const { transporter } = require("../email/emailSenderController");
const { getUsers } = require("./UserController");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Define a POST route for handling the OTP request
router.post("/", async (req, res) => {
    try {
        const { email, OTP } = req.body;

        // Get the user with the provided email from the database
        let user = await getUsers(email);
        user = user[0];

        // Check if the email is registered in the system
        if (!user) {
            return res.status(400).json({
                status: false,
                message: "Unregistered email address"
            });
        }

        // Send the forget password link by calling the sendEmail function with the user's email and OTP
        sendEmail(user.email, OTP);

        return res.status(200).json({
            status: true,
            message: "Please check your email's inbox! We sent you the OTP code needed to reset your password!"
        });
    } catch (error) {
        // If any errors occur during the process, catch the error, log it, and return an error response
        console.log(error);
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});

// Export the router
module.exports = router;

// Define a function to send the forget password email
const sendEmail = (email, OTP) => {
    try {
        // Define the content of the email
        const mailContent = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "OPN.SYSTEM FORGOT PASSWORD",
            html: `<h1>Here is your OTP code to reset your account's password: ${OTP}.</h1>`
        };

        // Use the transporter to send the email
        transporter.sendMail(mailContent, (error, info) => {
            if (error) console.log(error);
            else console.log(`Successfully sent the forgot password email to ${email}`);
        });
    } catch (error) {
        console.log(error);
    }
};
