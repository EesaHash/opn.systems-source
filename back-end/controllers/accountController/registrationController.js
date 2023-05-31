const express = require ("express");
const router = express.Router();
const connection = require("./connectDatabase.js").connection;

router.post("/", async (req, res) => {
    try{
        const {email, password, firstName, lastName, contactNumber, dob} = req.body;
        // Check for existing email
        if(await isExisted("email_address", String(email).toLowerCase())){
            return res.status(400).json({
                status: false,
                message: "Email already exists, please choose another email!"
            });
        }
        // Create new account
        const user = await createAccount(email, password, firstName, lastName, contactNumber, dob);
        if(!user){
            return res.status(400).json({
                status: false,
                message: "Failed to create new user!"
            });
        }
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

const createAccount = async (email, password, firstName, lastName, contactNumber, dob) => {
    try{
        const userID = await generateID(accountType);
        const user = {
            user_id: String(userID).toUpperCase(),
            email_address: String(email).toLowerCase(),
            password: password,
            first_name: firstName,
            last_name: lastName,
            contact_number: contactNumber,
            dob: new Date(dob).toLocaleDateString('en-AU', {day: "numeric", month: "short", year: "numeric"})
        };
        const sql  = `INSERT INTO user_t VALUES ('${user.user_id}', '${user.email_address}', '${password}', '${user.first_name}', '${user.last_name}', '${user.contact_number}', '${dob}');`;
        return new Promise((resolve, reject) => {
            connection.query(sql, async (err) => {
                if(err){
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