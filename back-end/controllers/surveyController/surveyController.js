const express = require("express");
const router = express.Router();
const Survey = require('../../models/survey');
const Survey = require('../../models/user');

const surveyController = {};

surveyController.saveSurvey = async (req, res) => {
  try {
    const { question, response, email } = req.body;

    // Create a new survey record in the database
    const survey = await Survey.create({ question, response, email });

    // Return the saved survey record as a response
    res.json(survey);
  } catch (error) {
    console.error(`Error saving survey response: `, error);
    res.status(500).json({ error: `An error occurred while saving the survey response` });
  }
};

surveyController.getSurveys = async (req, res) => { 
  try {
    const { email } = req.body;

    // Find all surveys for the given user
    const surveys = await Survey.findAll({ where: { email } });

    // Return the surveys as a response
    res.json(surveys);
  } catch (error) {
    console.error(`Error getting surveys: `, error);
    res.status(500).json({ error: `An error occurred while getting the surveys` });
  }
};

surveyController.updateSurvey = async (req, res) => {
  try {
    const { id, question, response, email } = req.body;

    // Update the survey record in the database
    const survey = await Survey.update({ question, response, email }, { where: { id } });

    // Return the updated survey record as a response
    res.json(survey);
  } catch (error) {
    console.error(`Error updating survey`, error);
    res.status(500).json({ error: `An error occurred while updating the survey` });
  }
};

surveyController.deleteSurvey = async (req, res) => {
  try {
    const { id } = req.body;

    // Delete the survey record from the database
    const survey = await Survey.destroy({ where: { id } });

    // Return the deleted survey record as a response
    res.json(survey);
  } catch (error) {
    console.error(`Error deleting survey: `, error);
    res.status(500).json({ error: `An error occurred while deleting the survey` });
  }
};

surveyController.deleteAllSurveys = async (req, res) => {
  try {
    const { email } = req.body;

    // Delete all surveys for the given user
    const surveys = await Survey.destroy({ where: { email } });

    // Return the deleted surveys as a response
    res.json(surveys);
  } catch (error) {
    console.error(`Error deleting surveys`, error);
    res.status(500).json({ error: `An error occurred while deleting the surveys`});
  }
};

// Define the routes
router.post('/', surveyController.saveSurvey);
router.get('/', surveyController.getSurveys);
router.put('/', surveyController.updateSurvey);
router.delete('/', surveyController.deleteSurvey);
router.delete('/all', surveyController.deleteAllSurveys);

module.exports = router;