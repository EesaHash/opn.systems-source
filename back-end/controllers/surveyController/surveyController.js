const express = require("express");
const router = express.Router();
const Survey = require('../../models/survey');

const surveyController = {};


surveyController.sendQuestion = async (res) => {
    try {
        const { question, response } = req.body;
        const survey = await Survey.create({ question, response });
        res.json(survey);
      } catch (error) {
        console.error('Error saving survey response:', error);
        res.status(500).json({ error: 'An error occurred while saving the survey response.' });
      }
}

surveyController.saveResponse = async (req, res) => {
  try {
    const { question, response } = req.body;

    // Create a new survey record in the database
    const survey = await Survey.create({ question, response });

    // Return the saved survey record as a response
    res.json(survey);
  } catch (error) {
    console.error('Error saving survey response:', error);
    res.status(500).json({ error: 'An error occurred while saving the survey response.' });
  }
};

// Define the route and use the saveResponse method
router.post('/', surveyController.saveResponse);

module.exports = router;