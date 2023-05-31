const express = require("express");
const router = express.Router();
const connection = require("./connectDatabase.js").connection;

router.post("/", async (req, res) => {
    try{
        const {username, password, rememberMe} = req.body;
        const user  = await getUser(username)[0];

        // Check account existence
        if(!user){
            console.log("Invalid username/email address!");
            return res.status(400).json({
                status: false,
                message: "Invalid username/email address and/or password!"
            });
        }

        // Verify password
        if(String(user.password) !== String(password)){
            console.log("Invalid password");
            return res.status(400).json({
                status: false,
                message: "Invalid username/email address and/or password!"
            });
        }

        // Generate token and save the token (login credentials)
        const userID = user.user_id;
        let loginToken;
        if(rememberMe)
            loginToken = jwt.sign(JSON.parse(`{"userID":"${userID}"}`), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
        else
            loginToken = jwt.sign(JSON.parse(`{"userID":"${userID}"}`), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        console.log(`${user.email_address} successfully login to his/her account!`);
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

const getUser = (username) => {
    const inputUsername = String(username).toLowerCase();
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