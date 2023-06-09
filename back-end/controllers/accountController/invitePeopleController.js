const express = require("express");
const router = express.Router();
const { connection } = require("./connectDatabase");
const { transporter } = require("../emailController/emailSenderController");

router.post("/", async (req, res) => {
    try{
        const {emails, emailSource} = req.body;
        for(let i = 0; i < emails.length; ++i){
            const email = emails[i];
            let user = await getUser(email);
            user = user[0];
            if(!user){
                sendEmail(email, emailSource);
            }
        }
        return res.status(200).json({
            status: true,
            message: "Successfully sent invitation emails!"
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
    const inputEmail = String(email).toLowerCase();
    const sql = `SELECT * FROM  user_t WHERE email_address = '${inputEmail}';`
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

const sendEmail = (email, emailSource) => {
    try{
        const url = `${process.env.FRONTEND_URL}/signup`;
        const mailContent = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "OPN.SYSTEM INVITATION",
            html: `<h1>${emailSource} is inviting you to register to Opn.Systems.\nPlease follow the attached link to proceed</h1>`
        };
        transporter.sendMail(mailContent, (error, info) => {
            if(error) console.log(error);
            else console.log(`Successfully sent invitation email to ${email}`);
        });
    }catch(error){
        console.log(error);
    }
};