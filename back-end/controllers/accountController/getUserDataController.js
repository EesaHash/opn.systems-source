const express = require ("express");
const { getUsers } = require("./UserController");
const router = express.Router();

router.post("/", async (req, res) => {
    try{
        const {email} = req.body;
        let user = await getUsers(email);
        user = user[0];
        if(!user){
            return res.status(400).json({
                status: false,
                message: "User is not registered yet!"
            });
        }
        console.log(`Successfully retrieve ${email} data`)
        return res.status(200).json({
            status: true,
            user: user
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