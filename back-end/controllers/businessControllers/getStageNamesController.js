const express = require("express");
const StageName = require("../../models/stage_name");
const router = express.Router();

router.post("/", async (req, res) => {
    try{        
        const {clientJourneyID} = req.body;
        const stages = await getStages(clientJourneyID);

        return res.status(200).json({
            status: true,
            stages
        });
    }catch(error){
        console.log(error);
        return res.status(403).json({
            status: false,
            message: error
        });
    }
});
module.exports = router;

const getStages = async (clientJourneyID) => {
    return JSON.parse((await StageName.findAll({
        where: { clientJourneyID }
    }))[0].names).synonyms;
};