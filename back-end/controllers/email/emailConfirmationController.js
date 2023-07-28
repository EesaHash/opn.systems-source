const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
require ("dotenv").config();

router.get("/:token", (req, res) => {
    try{
        const token = req.params.token;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
            if(err) return res.sendStatus(403);
            const user = await User.update(
            {
                email_verification: true
            }, {
                where: {
                    email: data.email
                }
            });
            if(!user){
                console.log(`Failed to confirm Account: ${data.email}!`);
                return res.status(400).json({
                    status: false,
                    message: "Failed to confirm email!"
                });
            }else{
                console.log(`Account: ${data.email} activated!`);
                return res.redirect(`${process.env.FRONTEND_URL}/signin`);
            }
        });
    }catch(error){
        res.send("error");
    }
});
module.exports = router;