const express = require("express");
const ClientJourney = require('../../models/client_journey');
const { runCompletion } = require('../gptController/gptController');
const Business = require('../../models/business');
const { generateClientJourney } = require("./clientJourneyPublicController");
const router = express.Router();


const clientJourney = {};

clientJourney.printClientJourney = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await generateClientJourney(id);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(403).json({
            result: "None"
        });
    }
}

router.post("/get_client_journey", clientJourney.printClientJourney);

module.exports = router;
