const express = require("express");
const clientJourney = require('../../models/clientJourney');
const gptController = require('../gptController/gptController');



const createClientJourney = async (businessId) => {
    try {
        //const journeyResponse = gptController.generateClientJourney();
        //const newClientJourney = await clientJourney.create({ 
        //   businessId, 
        //   journeyResponse.something, 
        //   journeyResponse.somethingElse 
        // });

    } catch (error) {
        console.log(`[Error] Could not create client journey for business}`);
        return null;
    }
}
