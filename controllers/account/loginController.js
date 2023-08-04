const express = require("express");
const router = express.Router();
const { sendEmailConfirmation } = require("../email/emailSenderController");
const jwt = require("jsonwebtoken");
const { getUsers } = require("./UserController");

// Define a POST route for handling user login and authentication
router.post("/", async (req, res) => {
    try {
        const { username, password, rememberMe } = req.body;

        // Get the user with the provided username/email from the database
        let user = await getUsers(username);
        user = user[0];

        // Check if the user exists in the database
        if (!user) {
            console.log("Invalid username/email address!");
            return res.status(400).json({
                status: false,
                message: "Invalid username/email address and/or password!"
            });
        }

        // Verify the provided password against the user's stored password
        if (!await user.validPassword(String(password), String(user.dataValues.password))) {
            console.log("Invalid password");
            return res.status(400).json({
                status: false,
                message: "Invalid username/email address and/or password!"
            });
        }

        // Check if the user's account is not active (email verification required)
        if (!(user.email_verification)) {
            console.log("Non-active account, email verification required!");
            // Send an email verification link to the user's email address
            sendEmailConfirmation(user.email);
            return res.status(400).json({
                status: false,
                message: "Your account is not yet active. Please verify your email to activate your account via the link sent in your email!"
            });
        }

        // Generate a login token using JWT and set its expiration based on the 'rememberMe' option
        const email = user.email;
        let loginToken;
        if (rememberMe)
            loginToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
        else
            loginToken = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

        // Log a success message indicating the user has successfully logged in
        console.log(`${user.email} successfully logged in to his/her account!`);
        return res.status(200).json({
            status: true,
            message: "Log In Successful!",
            loginToken: loginToken
        });
    } catch (error) {
        // If any errors occur during the login process, catch the error, log it, and return an error response
        console.log(error);
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});

// Export the router
module.exports = router;
