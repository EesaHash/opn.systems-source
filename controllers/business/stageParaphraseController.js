// Import required modules and dependencies
const { z } = require("zod");
const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
const {
    StructuredOutputParser,
    OutputFixingParser,
} = require("langchain/output_parsers");
const StageName = require('../../models/stage_name');

// Load environment variables
require('dotenv').config();

// Define an array of stages used in the application
const stages = ["Awareness", "Interest", "Evaluation", "Decision", "Purchase", "Implementation", "Post Purchase", "Retention"];

/**
 * Method to save paraphrased stage names for a given client journey.
 * It takes the client journey ID and model name as parameters and returns the saved stage names.
 * @param {number} clientJourneyID - The ID of the client journey for which stage names need to be saved.
 * @param {string} modelName - The name of the language model to use for paraphrasing.
 * @returns {object|null} - Returns the saved stage names as an object or null if an error occurs.
 */
const saveParaphrasedStages = async (clientJourneyID, modelName) => {
    try {
        // Check if the client journey ID is provided
        if (clientJourneyID == null) {
            return null;
        }

        // Call the function to paraphrase the stage names using the provided language model
        const output = await paraphrase(modelName);

        // Create a new entry in the StageName model with the paraphrased stage names
        const stageNames = await StageName.create({
            names: JSON.stringify(output),
            clientJourneyID: clientJourneyID,
        });

        return stageNames;
    }
    catch (error) {
        console.log(error);
        return null;
    }
};

/**
 * Method to paraphrase the stage names using the provided language model.
 * It takes the model name as a parameter and returns the paraphrased stage names.
 * @param {string} modelName - The name of the language model to use for paraphrasing.
 * @returns {object|null} - Returns the paraphrased stage names as an object or null if an error occurs.
 */
const paraphrase = async (modelName) => {
    // Create a parser for the structured output from the language model
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            synonyms: z
                .array(z.string())
                .describe("Synonym for each of the 8 stage names in the right order"),
        })
    );

    // Get the format instructions for the parser
    const formatInstructions = parser.getFormatInstructions();

    // Create a prompt template for paraphrasing stage names
    const prompt = new PromptTemplate({
        template:
            `You are tasked with generating accurate and professionally appropriate synonyms for a list of words provided. You must provide one synonym for each word.
             Here's the list of words: {stages}. For some words, do not paraphrase, leave them as is.
             {format_instructions}`,
        inputVariables: ["stages"],
        partialVariables: { format_instructions: formatInstructions },
    });

    // Create a new instance of the language model
    const model = new OpenAI({ temperature: 1, model: modelName });

    // Format the input prompt with the stage names
    const input = await prompt.format({
        stages: stages,
    });

    // Call the language model with the input prompt to get the paraphrased stage names
    const response = await model.call(input);

    try {
        // Parse the response using the structured output parser
        parsedResponse = await parser.parse(response);
        return parsedResponse;
    } catch (e) {
        try {
            // If parsing fails, use an output fixing parser to handle the response
            const fixParser = OutputFixingParser.fromLLM(
                new OpenAI({ temperature: 0, model: modelName }),
                parser
            );
            const output = await fixParser.parse(response);
            return output;
        }
        catch (e) {
            // Return null if parsing still fails
            return null;
        }
    }
};

// Export the saveParaphrasedStages function for use in other modules
module.exports = { saveParaphrasedStages };
