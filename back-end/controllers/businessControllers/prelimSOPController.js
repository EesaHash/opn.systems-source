const ClientJourney = require('../../models/client_journey');
const express = require("express");
const router = express.Router();
const { z } = require("zod");
const { OpenAI } = require("langchain/llms/openai");
<<<<<<< HEAD
=======
const SOP = require("../../models/sop");
>>>>>>> 56a4d3b2082472ac6760edd5a175b54cfcc1053e

require('dotenv').config()

const { PromptTemplate } = require("langchain/prompts");
const {
    StructuredOutputParser,
    OutputFixingParser,
} = require("langchain/output_parsers");

const sopController = {};


sopController.printSOP = async (req, res) => {
    try {
        // const { step, role, department } = req.body;
        // const output = await generateProcedure(step, role, department);
        const {businessId} = req.body;
        const output = generateProcedure(businessId);
        res.status(200).json({ output });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error in SOP Controller",
            error: error,
        });
    }
};


const generateProcedure = async (id) => {
    try {
        const clientJourney = await ClientJourney.findAll({ where: { businessId: id } });
        const res = JSON.parse(JSON.stringify(clientJourney[0]));
        for (const [key, value] of Object.entries(res)) {
            console.log(`${key}: ${value}`);
        }


    } catch (error) {
        console.log(error);
    }
}

const generateProcedureStep = async (singleClientJourneyStepAsString, role, department) => {
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            title: z.string().describe(`Produce a concise and appropriate title for the SOP.`),
            objective: z.string().describe(`This section explains why the SOP is necessary and under what circumstances it should be followed. It could include the potential benefits and the objectives the SOP is designed to achieve.`),
            definitions: z.string().describe(`This section includes any specific terms, abbreviations, or acronyms used within the SOP.`),
            responsibility: z.string().describe(`This section describes who is responsible for carrying out the procedure.`),
            procedure: z
                .array(z.string())
                .describe(`This is the core of the SOP. It provides a step-by-step guide on how to complete the procedure. It should be detailed and specific enough that someone unfamiliar with the process could complete it by following the instructions. It's often beneficial to break down complex procedures into smaller, manageable steps.`),
            interactionChannel: z.string().describe(`Determine the various channels and modes of communication utilized during the client journey. This can include face-to-face meetings, phone calls, emails, social media platforms, or customer relationship management systems.`),
            documentation: z.string().describe(`This section specifies any necessary documentation related to the procedure, such as forms to be filled out, records to be kept, or reports to be submitted.`),
        }),
    );

    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template:
            `You are tasked with generating an SOP (Standard Operating Procedure), based on a description, role and department provided.
         Description: {description}
         Role: {role}
         Department: {department}
         {format_instructions};`,
        inputVariables: ["description", "role", "department", "info"],
        partialVariables: { format_instructions: formatInstructions },
    });
    const model = new OpenAI({ temperature: 1, model: "gpt-3.5-turbo-16k", maxTokens: 3000 });
    const input = await prompt.format({
        description: singleClientJourneyStepAsString,
        role: role,
        department: department,
    });
    const response = await model.call(input);
    console.log(response);
    try {
        parsedResponse = await parser.parse(response);
        console.log(parsedResponse);
        return parsedResponse;
    } catch (e) {
        try {
            const fixParser = OutputFixingParser.fromLLM(
                new OpenAI({ temperature: 0, model: "gpt-3.5-turbo-16k" }),
                parser
            );
            const output = await fixParser.parse(response);
            return output;
        }
        catch (e) {
            return null;
        }
    }
};

async function retry(singleClientJourneyStepAsString, role, department) {
    let output = null;
    let i = 0;
    while (i < 10) {
        output = await generateProcedureStep(singleClientJourneyStepAsString, role, department);
        if (output != null) {
            break;
        }
        i++;
    }
    return output;
}

sopController.getAllSOPByClientJourneyID = async (req, res) => {
    try{
        const {ClientJourneyId} = req.body;
        const sops = await SOP.findAll({ where : {ClientJourneyId}, order: ['id'] });
        if(sops.length <=0){
            return res.status(403).json({
                status: false,
                message: `No SOPs for client id: ${ClientJourneyId}`
            });
        }
        console.log(`Successfully retrieve SOPs for ${ClientJourneyId}`);
        return res.status(200).json({
            status: true,
            message: `Successfully retrieve SOPs for ${ClientJourneyId}`,
            sops
        });
    }catch(error){
        console.log(error);
        return res.status(403).json({
            status: false,
            message: error
        });
    }
};

router.post("/printSOP", sopController.printSOP);
router.post("/getall", sopController.getAllSOPByClientJourneyID);

module.exports = router;