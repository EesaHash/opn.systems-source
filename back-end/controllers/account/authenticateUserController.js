const express = require ("express");
const router = express.Router();
const { isEmailExist, isUsernameExist } = require("./UserController");


/**
 * POST MAPPING for user authentication, checks for existing email/username then sends an indicative response.
 */
router.post("/", async (req, res) => {
    try{
        const {username, email} = req.body;

        // Check for existing email
        if(await isEmailExist(email)){
            return res.status(400).json({
                status: false,
                message: "Email already exists, please choose another email!"
            });
        }

        // Check for existing username
        if(await isUsernameExist(username)){
            return res.status(400).json({
                status: false,
                message: "Username already exists, please choose another email!"
            });
        }
        return res.status(200).json({
            status: true,
            message: "User is not registered yet!"
        });
    }catch(error){
        console.log(error);
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});
module.exports = router;