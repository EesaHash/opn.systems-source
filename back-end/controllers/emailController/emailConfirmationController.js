const express = require("express");
const router = express.Router();
const { connection } = require("../accountController/connectDatabase");
const jwt = require("jsonwebtoken");
require ("dotenv").config();

router.get("/:token", (req, res) => {
    try{
        const token = req.params.token;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if(err) return res.sendStatus(403);
            const sql = `UPDATE user_t SET email_confirmation = 1 WHERE email = '${data.email}';`;
            connection.query(sql, (err, result) => {
                if(err){
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
        });
    }catch(error){
        res.send("error");
    }
});
module.exports = router;