// Import the StageName model for interacting with the database
const StageName = require("../../models/stage_name");

/**
 * Method to retrieve the paraphrased stage names for a given client journey ID from the database.
 * It takes a clientJourneyID as a parameter and queries the StageName model to fetch the paraphrased stage names.
 * @param {number} clientJourneyID - The ID of the client journey for which the paraphrased stage names are to be retrieved.
 * @returns {string[] | null} - An array of paraphrased stage names, or null if no paraphrased stages are found for the given client journey.
 */
const getStages = async (clientJourneyID) => {
    // Query the StageName model to fetch the paraphrased stage names for the given client journey ID
    const stages = await StageName.findAll({
        where: { clientJourneyID }
    });

    // If paraphrased stages are found, return the array of synonyms parsed from the retrieved JSON data
    if (stages.length > 0) {
        return JSON.parse(stages[0].names).synonyms;
    }

    // If no paraphrased stages are found for the given client journey, return null
    return null;
};

// Export the getStages function for use in other modules
module.exports = { getStages };
