const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    try{
         
    }catch(error){
        console.log(error);
        return res.status(400).json({

        });
    }
});
module.exports = router;