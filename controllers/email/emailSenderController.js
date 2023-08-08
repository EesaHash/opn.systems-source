const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// ===== CONFIGURATION TO GOOGLE APIS =====
const { google } = require("googleapis");
const clientID = "262257140186-5tjfcb64hsjbdnfb270ef87s7b03qj2t.apps.googleusercontent.com";
const clientSecret = "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";
const redirectURL = "https://developers.google.com/oauthplayground";
const refreshToken = "1//04Bj6z-NOpAIUCgYIARAAGAQSNwF-L9Irm24pEOtv4TsUGTKHQSwcOkBsEUfD18hQ-eo24EDRV5EqNpX_n_67Fe4yVm-L0lPSMbE";
const oAuth2Client = new google.auth.OAuth2(clientID, clientSecret, redirectURL);
oAuth2Client.setCredentials({ refresh_token: refreshToken });

// Create Nodemailer transporter configuration
let transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    // port: 587,
    // auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASS,
    // },
});
const setTransporter = async _ => {
    const token = await oAuth2Client.getAccessToken();
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL_USERNAME,
            clientId: clientID,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            accessToken: token
        }
    });
};

/**
 * Send email verification link to the specified email address.
 *
 * @param {string} email - The recipient's email address.
 * @returns {void}
 */
const sendEmailConfirmation = async (email) => {
    try {
        await setTransporter();
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

const sendOTPCode = async (email, OTP) => {
    try {
        await setTransporter();
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

module.exports = { transporter, sendEmailConfirmation, sendOTPCode };
