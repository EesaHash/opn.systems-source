const express = require("express");
const router = express.Router();
const { getUsers } = require("./UserController");
const { sendOTPCode } = require("../email/emailSenderController");
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
        await sendOTPCode(user.email, OTP);

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