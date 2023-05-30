const express = require("express");
const router = express.Router();
const connection = require("./connectDatabase.js").connection;

router.post("/", async (req, res) => {
    try{
        
    }catch(error){
        console.log(error);
        return res.status(400).json({

        });
    }
});
module.exports = router;