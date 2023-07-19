const express = require("express");
const router = express.Router();
const { sendEmailConfirmation } = require("../emailController/emailSenderController");
const jwt = require("jsonwebtoken");
const { getUsers } = require("./UserController");
const User = require("../../models/user");
const { updateAll } = require("../../security/encryptAll");

router.post("/", async (req, res) => {
    try{
        const {username, password, rememberMe} = req.body;
        let user  = await getUsers(username);
        user = user[0];

        // Check account existence
        if(!user){
            console.log("Invalid username/email address!");
            return res.status(400).json({
                status: false,
                message: "Invalid username/email address and/or password!"
            });
        }

        // Verify password
        if(await user.validPassword(String(password), String(user.dataValues.password))){
            console.log("Invalid password");
            return res.status(400).json({
                status: false,
                message: "Invalid username/email address and/or password!"
            });
        }

        // Check account's activations status and send email verification if it is not active
        if(!(user.email_verification)){
            console.log("Non-active account, email verification required!");
            sendEmailConfirmation((user.email));
            return res.status(400).json({
                status: false,
                message: "Your account is not yet active. Please verify your email to activate your account via the link sent in your email!"
            });
        }

        // Generate token and save the token (login credentials)
        const email = user.email;
        let loginToken;
        if(rememberMe)
            loginToken = jwt.sign(JSON.parse(`{"email":"${email}"}`), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
        else
            loginToken = jwt.sign(JSON.parse(`{"email":"${email}"}`), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        console.log(`${user.email} successfully login to his/her account!`);
        return res.status(200).json({
            status: true,
            message: "Log In Successfull!",
            loginToken: loginToken
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