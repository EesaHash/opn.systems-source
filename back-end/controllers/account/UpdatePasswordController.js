const express = require ("express");
const router = express.Router();
const User = require("../../models/user");
const { getUsers } = require("./UserController");

router.post("/", async (req, res) => {
    try {
        const {email, passwordInput} = req.body;
        // Check if the user exists
        let user = await getUsers(email);
        if(user.length < 1)
            throw ("User not found!");

        // Validate old password
        user = user[0];
        if(!await user.validPassword(String(passwordInput.oldPassword), String(user.password)))
            throw ("Old password does not match!");

        // Update password
        await User.update({
            password: passwordInput.newPassword
        }, { where: {email}, individualHooks: true });
        console.log(`[SUCCESS] CHANGED PASSWORD FOR USER: ${email}`);
        return res.status(200).json({
            status: true,
            message: "Successfully update password!"
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