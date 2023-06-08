const express = require ("express");
const router = express.Router();
const { connection } = require("./connectDatabase");
const { sendEmailConfirmation } = require("../emailController/emailSenderController");

router.post("/", async (req, res) => {
    try{
        const {username, email, password} = req.body;

        // Check for existing username
        if(await isExisted("username", String(username).toLowerCase())){
            return res.status(400).json({
                status: false,
                message: "Email already exists, please choose another email!"
            });
        }
        // Check for existing email
        if(await isExisted("email_address", String(email).toLowerCase())){
            return res.status(400).json({
                status: false,
                message: "Email already exists, please choose another email!"
            });
        }
        // Create new account
        const user = await createAccount(username, email, password);
        if(!user){
            return res.status(400).json({
                status: false,
                message: "Failed to create new user!"
            });
        }

        // Send Email Verification
        sendEmailConfirmation(email);

        return res.status(200).json({
            status: true,
            user: user,
            message: "Successfully created new user!"
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

const createAccount = async (username, email, password) => {
    try{
        const userID = await generateID("A");
        const user = {
            user_id: String(userID).toUpperCase(),
            username: String(username).toLowerCase(),
            email_address: String(email).toLowerCase(),
            password: password
        };
        const sql  = `INSERT INTO user_t VALUES ('${user.user_id}', '${user.email_address}', '${password}', 0, '${user.username}');`;
        return new Promise((resolve, reject) => {
            connection.query(sql, async (err) => {
                if(err){
                    console.log(err);
                    return reject(null);
                }else{
                    console.log(`Account: ${user.user_id} successfully created!`);
                    return resolve(user);
                }
            });
        });
    }catch(error){
        console.log(error);
    }
};


const generateID = async (accountType) => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    const characters = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"];
    // User ID format: UCCNNCCNNN
    let userID;
    do{
        userID = String(accountType).toUpperCase() + characters[randomNumber(26)] + characters[randomNumber(26)] + numbers[randomNumber(10)] + numbers[randomNumber(10)] + characters[randomNumber(26)] + characters[randomNumber(26)] + numbers[randomNumber(10)] + numbers[randomNumber(10)] + numbers[randomNumber(10)];
        userID = String(userID).toUpperCase();
    }while(await isExisted("user_id", userID));
    return userID;
};

const isExisted = (field, data) => {
    const sql = `SELECT * FROM user_t WHERE ${field} = '${String(data)}';`;
    
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return reject(true);
            }else{
                return resolve(result.rows.length > 0);
            }
        });
    });
};

const randomNumber = (n) => {
    return Math.floor(Math.random() * n);
};