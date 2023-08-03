const express = require ("../../../front-end/node_modules/@types/express");
const router = express.Router();
const User = require("../../models/user");
const { getUsers } = require("./UserController");

router.post("/", async (req, res) => {
    try {
        const {email, password} = req.body;
        // Check if the user exists
        let user = await getUsers(email);
        if(user.length < 1)
            throw ("User not found!");

        // Update password
        await User.update({
            password: password
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