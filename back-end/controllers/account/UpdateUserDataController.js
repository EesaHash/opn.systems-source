const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const { getUsers } = require("./UserController");

/**
 * Route to handle updating user profile data.
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} - The HTTP response object with status and message.
 */
router.post("/", async (req, res) => {
    try {
        const { userData } = req.body;
        // Check if the user exists
        let user = await getUsers(userData.email);
        if (user.length < 1)
            throw "User not found!";

        // Check if the username already exists
        user = await getUsers(userData.username);
        if (user.length > 0) {
            user = user[0];
            if (user.email !== userData.email)
                throw "Username already exists, please choose another username!";
        }

        // Update user data
        await User.update({
            username: userData.username,
            first_name: userData.first_name,
            last_name: userData.last_name,
            password: userData.password
        }, { where: { email: userData.email } });

        console.log(`[SUCCESS] UPDATED USER PROFILE: ${userData.email}`);
        return res.status(200).json({
            status: true,
            message: "Successfully update profile!"
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});

module.exports = router;
