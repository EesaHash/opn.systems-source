const express = require("../../../front-end/node_modules/@types/express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
require("dotenv").config();

/**
 * Endpoint to handle email verification.
 *
 * @route GET /email-verification/:token
 * @param {string} token - The verification token received via email.
 * @returns {Object} - Redirects the user to the sign-in page or returns an error message.
 */
router.get("/:token", async (req, res) => {
    try {
        const token = req.params.token;
        // Verify the token using the secret key
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
            if (err) {
                return res.sendStatus(403); // Token verification failed
            }

            // Update the user's email_verification status to true in the database
            const user = await User.update(
                {
                    email_verification: true,
                },
                {
                    where: {
                        email: data.email,
                    },
                }
            );

            if (!user) {
                console.log(`Failed to confirm Account: ${data.email}!`);
                return res.status(400).json({
                    status: false,
                    message: "Failed to confirm email!",
                });
            } else {
                console.log(`Account: ${data.email} activated!`);
                // Redirect the user to the sign-in page after successful email verification
                return res.redirect(`${process.env.FRONTEND_URL}/signin`);
            }
        });
    } catch (error) {
        console.log(error);
        res.send("error");
    }
});

module.exports = router;
