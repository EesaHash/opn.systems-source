const express = require("express");
const router = express.Router();
const { sendEmailConfirmation } = require("../email/emailSenderController");
const { transporter } = require("../email/emailSenderController");
const User = require("../../models/user");
const { isEmailExist } = require("./UserController");

// Define a POST route for handling user registration and account creation
router.post("/", async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, emails } = req.body;
        
        // Create a new account with the provided user details
        const user = await createAccount(username, email, password, firstName, lastName);
        
        // Check if the account creation was successful
        if (!user) {
            return res.status(400).json({
                status: false,
                message: "Failed to create new user!"
            });
        }

        // Send email verification to the user's email address
        sendEmailConfirmation(email);

        // Send email invitations to the provided list of email addresses
        for (let i = 0; i < emails.length; ++i) {
            const temp = emails[i];
            // Check if the email address already exists in the system
            const emailExistence = await isEmailExist(temp);
            if (!emailExistence) {
                // If the email address does not exist, send an email invitation
                sendEmail(temp, email);
            }
        }

        // Return a success response with the user details and a success message
        return res.status(200).json({
            status: true,
            user: user,
            message: "Successfully created new user!"
        });
    } catch (error) {
        // If any errors occur during the account creation process, catch the error, log it, and return an error response
        console.log(error);
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});

// Export the router
module.exports = router;


/**
 * Create a new user account in the database.
 * @param {string} username - The username for the new user.
 * @param {string} email - The email address for the new user.
 * @param {string} password - The password for the new user.
 * @param {string} firstName - The first name of the new user.
 * @param {string} lastName - The last name of the new user.
 * @returns {object|null} - The created user object or null if there was an error.
 */
const createAccount = async (username, email, password, firstName, lastName) => {
    try {
        const user = {
            username: String(username).toLowerCase(),
            email: String(email).toLowerCase(),
            password: password,
            firstName: firstName,
            lastName: lastName
        };
        const createdUser = await User.create({
            email: user.email,
            username: user.username,
            password: user.password,
            first_name: user.firstName,
            last_name: user.lastName
        });
        return createdUser;
    } catch (error) {
        console.log(error);
        return null;
    }
};

/**
 * Send an email invitation to the provided email address.
 * @param {string} email - The email address of the recipient.
 * @param {string} emailSource - The source of the invitation.
 */
const sendEmail = (email, emailSource) => {
    try {
        const url = `${process.env.FRONTEND_URL}/signup`;
        const mailContent = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "OPN.SYSTEM INVITATION",
            html: `<h1>${emailSource} is inviting you to register to Opn.Systems.\nPlease follow the attached link to proceed\n${url}</h1>`
        };
        transporter.sendMail(mailContent, (error, info) => {
            if (error) console.log(error);
            else console.log(`Successfully sent invitation email to ${email}`);
        });
    } catch (error) {
        console.log(error);
    }
};
