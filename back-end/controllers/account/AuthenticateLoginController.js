const express = require("../../../front-end/node_modules/@types/express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { isEmailExist } = require("./UserController");
require ("dotenv").config();

/**
 * POST MAPPING for login authentication. Verifies the existence of an email in DB
 * JWT tokens are used for verification
 */

router.post("/", async (req, res) => {
    try{
        const token = req.body.token;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
            if(err){
                return res.status(403).json({
                    userID: "none"
                });
            }
            const checkID = await isEmailExist(data.email)
            if(!checkID){
                return res.status(403).json({
                    userID: "none"
                });
            }
            return res.status(200).json({
                userID: data.email
            });
        });
    }catch(error){
        console.log(error);
        return res.status(403).json({
            userID: "none"
        });
    }
});
module.exports = router;