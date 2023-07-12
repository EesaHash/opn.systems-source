const { z } = require("zod");
const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
const {
    StructuredOutputParser,
    OutputFixingParser,
} = require("langchain/output_parsers");
const StageName = require('../../models/stage_name');

require('dotenv').config()

const stages = ["Awareness", "Interest", "Evaluation", "Decision", "Purchase", "Implementation", "Post Purchase", "Retention"];

const saveParaphrasedStages = async (clientJourneyID, modelName) => {
    try {
        if (clientJourneyID == null) {
            return null;
        }
        const output = await paraphrase(modelName);
        const stageNames = await StageName.create({
            names: JSON.stringify(output),
            clientJourneyID: clientJourneyID,
        })
        return stageNames;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}

const paraphrase = async (modelName) => {
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            synonyms: z
                .array(z.string())
                .describe("Synonym for each of the 8 stage names in the right order"),
        })
    );

    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template:
            `You are tasked with generating accurate and professionally appropriate synonyms for a list of words provided. You must provide one synonym for each word.
             Here's the list of words: {stages}
             {format_instructions}`,
        inputVariables: ["stages"],
        partialVariables: { format_instructions: formatInstructions },
    });

    const model = new OpenAI({ temperature: 1, model: modelName });
    const input = await prompt.format({
        stages: stages,
    });
    const response = await model.call(input);
    try {
        parsedResponse = await parser.parse(response);
        return parsedResponse;
    } catch (e) {
        try {
            const fixParser = OutputFixingParser.fromLLM(
                new OpenAI({ temperature: 0, model: modelName }),
                parser
            );
            const output = await fixParser.parse(response);
            return output;
        }
        catch (e) {
            return null;
        }
    }
}

module.exports = { saveParaphrasedStages }