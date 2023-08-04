const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Create Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Send email verification link to the specified email address.
 *
 * @param {string} email - The recipient's email address.
 * @returns {void}
 */
const sendEmailConfirmation = (email) => {
    try {
        // Generate an access token with an expiration time of 1 hour
        const accessToken = jwt.sign(
            JSON.parse(`{"email":"${email}"}`),
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        // Create the verification URL using the generated access token
        const url = `${process.env.PORT_URL}/confirmation/${accessToken}`;

        // Compose the email content
        const mailContent = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "OPN.SYSTEM EMAIL VERIFICATION",
            html: `<h1>Please click the following link to activate your account (the link will only be available for 60 minutes): <a href="${url}">${url}</a></h1>`,
        };

        // Send the email using the configured transporter
        transporter.sendMail(mailContent, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log(`Successfully sent email verification to ${email}`);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = { transporter, sendEmailConfirmation };
