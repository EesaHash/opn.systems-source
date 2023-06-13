const express = require ("express");
const router = express.Router();
const { connection } = require("./connectDatabase");

router.post("/", async (req, res) => {
    try{
        const {username, email} = req.body;

        // Check for existing email
        if(await isExisted("email_address", String(email).toLowerCase())){
            return res.status(400).json({
                status: false,
                message: "Email already exists, please choose another email!"
            });
        }
        // Check for existing username
        if(await isExisted("username", String(username).toLowerCase())){
            return res.status(400).json({
                status: false,
                message: "Username already exists, please choose another email!"
            });
        }
        return res.status(200).json({
            status: true,
            message: "User is not registered yet!"
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