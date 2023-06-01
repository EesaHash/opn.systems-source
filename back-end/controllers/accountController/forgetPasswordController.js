const express = require("express");
const router = express.Router();
const { connection } = require("./connectDatabase");
const { transporter } = require("../emailController/emailSenderController");

router.post("/", async (req, res) => {
    try{
        const {email} = req.body;
        // let user  = await getUser(email);
        // user = user[0];

        // Check email input
        // if(!user){
        //     return res.status(400).json({
        //         status: false,
        //         message: "Unregistered email address"
        //     });
        // }
        // Send forget password link
        sendEmail(String(email).toLowerCase(), "pass");
        return res.status(200).json({
            status: true,
            message: "Please check your email's inbox!"
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

const getUser = (email) => {
    const inputUsername = String(email).toLowerCase();
    const sql = `SELECT * FROM  user_t WHERE username = '${inputUsername}' OR email_address = '${inputUsername}';`
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(null);
            }else{
                return resolve(result.rows);
            }
        });
    });
};

const sendEmail = (email, password) => {
    try{
        const url = `${process.env.FRONTEND_URL}/signin`;
        const mailContent = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "OPN.SYSTEM FORGET PASSWORD",
            html: `The password for account: ${email} is '${password}'.\nNow you can go back and fill in your information ${url}.`
        };
        transporter.sendMail(mailContent, (error, info) => {
            if(error) console.log(error);
            else console.log(info.response);
        });
    }catch(error){
        console.log(error);
    }
};