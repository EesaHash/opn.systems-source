const express = require("express");
const router = express.Router();
const { z } = require("zod");
const { PromptTemplate } = require("langchain/prompts");
const { OpenAI } = require("langchain/llms/openai");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const ClientJourney = require("../../models/client_journey");
const SOP = require("../../models/sop");
const { ConversationChain, LLMChain } = require("langchain/chains");
const {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
} = require("langchain/prompts")
const {
    StructuredOutputParser,
    OutputFixingParser,
} = require("langchain/output_parsers");
const { BufferMemory } = require("langchain/memory");
const { modelName } = require("../../configuration/AIConfig");
require('dotenv').config();

const stages = ["awareness", "interest", "evaluation", "decision", "purchase", "implementation", "postPurchase", "retention"];

/*
    API METHODS
*/

/**
 * Regenerate an SOP (Standard Operating Procedure) based on the provided SOP JSON and prompt containing instructions or preferences.
 *
 * @param {Object} req - The request object containing the SOP JSON and prompt.
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - The response object with the status and the regenerated SOP.
 */
const regenerateSOP = async (req, res) => {
    try {
        let regeneratedSOP = null;

        // Call the function to regenerate a single SOP with the provided SOP JSON and prompt
        regeneratedSOP = await regenerateSingleSOP(req.body.sop, req.body.prompt);

        // If the regenerated SOP is null, throw an error
        if (regeneratedSOP == null) {
            throw `[FAIL] UNABLE TO REGENERATE SOP`;
        }

        // Prepare the regenerated SOP object for response by converting certain properties to strings
        regeneratedSOP = {
            ...regeneratedSOP,
            purpose: regeneratedSOP.purpose[0],
            definitions: JSON.stringify(regeneratedSOP.definitions),
            responsibility: JSON.stringify(regeneratedSOP.responsibility),
            procedure: JSON.stringify(regeneratedSOP.procedure),
            documentation: JSON.stringify(regeneratedSOP.documentation)
        }

        // Log success message and respond with the regenerated SOP
        console.log("[SUCCESS] REGENERATED SOP");
        return res.status(200).json({ status: true, sop: regeneratedSOP });
    } catch (error) {
        // If any errors occur during the process, catch the error, log it, and return a response with a 500 status and false status.
        console.log(error);
        return res.status(500).json({ status: false });
    }
}
/**
 * Update a single SOP by passing the id for the old SOP and the new SOP in the request parameter.
 * @param {Object} req - The request object containing the id for the old SOP and the new SOP (customSop).
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - The response object with the status and the updated SOP.
 */
const updateSingleSop = async (req, res) => {
    try {
        // Call the function to update the SOP with the provided id and the new SOP JSON (customSop)
        const sop = await updateSOP(req.body.id, req.body.customSop);

        // If the updated SOP is null or 0, throw an error
        if (sop == null || sop === 0) {
            throw "SOP NOT FOUND";
        }

        // Log success message and respond with the updated SOP
        console.log("Successfully updated SOP");
        return res.status(200).json({ status: true, updatedSop: sop });
    } catch (error) {
        // If any errors occur during the process, catch the error, log it, and return a response with a 500 status and false status.
        console.log(error);
        return res.status(500).json({ message: false });
    }
}
/**
 * Delete all SOPs for a given stage (e.g., awareness or decision) in a client journey.
 * @param {Object} req - The request object containing the client journey ID and the name of the stage.
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - The response object with the status indicating the success of the deletion.
 */
const deleteSopsForStage = async (req, res) => {
    try {
        // Delete all SOPs for the given stage and client journey from the database
        const sop = await SOP.destroy({
            where: {
                clientJourneyID: req.body.clientJourneyID,
                stage: req.body.stage
            }
        });

        // If no SOPs were found for the given stage, return a 404 status response
        if (sop === 0) {
            console.log("[FAIL] SOPS DO NOT EXIST");
            return res.status(404).json({ status: false });
        }

        // Log success message and respond with a 200 status indicating successful deletion
        console.log(`SUCCESSFULLY DELETED SOPS FOR STAGE: ${req.body.stage} ID: ${req.body.clientJourneyID}`);
        return res.status(200).json({
            status: true,
        });
    } catch (err) {
        // If any errors occur during the process, catch the error, log it, and return a response with a 500 status and false status.
        console.log(`[FAIL] COULD NOT DELETE SOPS FOR ${req.body.clientJourneyID}`, err);
        return res.status(500).json({ status: false });
    }
};
/**
 * Generates a bunch of SOPs for a given stage, each step is used as a bullet or general theme for the SOP.
 * @param {Object} req - The request object containing the client journey ID and the name of the stage.
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - The response object with the status and the generated SOPs.
 */
const generateStageSops = async (req, res) => {
    try {
        // Extract the client journey ID and the name of the stage from the request body
        const { clientJourneyID, stage } = req.body;

        // Find the client journey with the provided ID in the database
        const clientJourneyList = await ClientJourney.findAll({
            where: {
                id: clientJourneyID
            }
        });

        // Get the client journey object from the list (assuming only one client journey will match the ID)
        const clientJourney = clientJourneyList[0];

        // If the client journey is null, throw an error
        if (clientJourney == null) {
            throw "Client Journey not found!";
        }

        // Delete all existing SOPs for the given stage and client journey from the database
        const forStage = stages[stage];
        await SOP.destroy({
            where: {
                clientJourneyID: clientJourneyID,
                stage: forStage
            }
        });

        // Generate SOPs for the specified stage in the client journey
        await generateSopsForStage(clientJourney, forStage);

        // Find all SOPs for the given client journey in the database
        const sops = await SOP.findAll({
            where: {
                clientJourneyID: clientJourneyID
            }
        });

        // Log success message and respond with the generated SOPs
        console.log(`[SUCCESS] GENERATED SOPS FOR CLIENT JOURNEY ID: ${clientJourneyID}`);
        return res.status(200).json({
            status: true,
            sops,
        });
    } catch (err) {
        // If any errors occur during the process, catch the error, log it, and return a response with a 500 status and false status.
        console.log(err);
        return res.status(500).json({
            status: false,
        });
    }
};
/**
 * Get/Fetch (from AWS DB) all the SOPs for the provided stage
 * If no sops exist, then a false status is returned
 * @param {clientJourneyID, stage} req 
 * @returns {status: true, sops}
 */
const getSopsForStage = async (req, res) => {
    try {
        const sops = await SOP.findAll({
            where: {
                clientJourneyID: req.body.clientJourneyID,
                stage: stages[req.body.stage]
            }
        });
        if (sops == null || sops.length == 0) {
            console.log("[FAIL] SOPS NOT FOUND")
            return res.status(404).json({
                status: false,
            });
        }
        console.log(`[SUCCESS] RETRIEVED SOPS FOR CLIENT JOURNEY ID: ${req.body.clientJourneyID} STAGE: ${req.body.stage}`);
        return res.status(200).json({
            status: true,
            sops: sops
        });
    } catch (error) {
        console.log(`[FAIL] COULD NOT RETRIEVE SOPS `, error);
        return res.status(404).json({
            status: false,
        });
    }
};
/**
 * Finds all the SOPs for a Client Journey, given the clientJourneyID in the request body.
 * @param {Object} req - The request object containing the clientJourneyID.
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - The response object with the status and the list of SOPs for the given client journey.
 */
const getSopsForClientJourney = async (req, res) => {
    try {
        // Find all SOPs in the database for the provided clientJourneyID
        let sops = await SOP.findAll({
            where: {
                clientJourneyID: req.body.clientJourneyID
            },
            order: ['id'],
            raw: true
        });

        // If no SOPs were found for the given clientJourneyID, return a 404 status response
        if (sops == null || sops.length == 0) {
            console.log(`[FAIL] COULD NOT RETRIEVE SOPS FOR CLIENT JOURNEY ${req.body.clientJourneyID}`);
            return res.status(404).json({
                status: false,
            });
        }

        // Log success message and respond with the list of SOPs for the given client journey
        console.log(`[SUCCESS] RETRIEVED SOPS FOR CLIENT JOURNEY ID: ${req.body.clientJourneyID}`);
        return res.status(200).json({
            status: true,
            sops: sops
        });
    } catch (error) {
        // If any errors occur during the process, catch the error, log it, and return a response with a 404 status and false status.
        console.log(`[FAIL] COULD NOT RETRIEVE SOPS `, error);
        return res.status(404).json({
            status: false,
        });
    }
};
/**
 * Deletes a single SOP by its ID, given the SOP ID in the request body.
 * @param {Object} req - The request object containing the ID of the SOP to be deleted.
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - The response object with the status and a message indicating the success or failure of the deletion.
 */
const deleteSingleSop = async (req, res) => {
    try {
        // Extract the ID of the SOP to be deleted from the request body
        const { id } = req.body;

        // Delete the SOP with the provided ID from the database
        const sop = await SOP.destroy({ where: { id: id } });

        // If the SOP is not found (i.e., deleted SOP count is 0), return a 404 status response with a message
        if (sop === 0) {
            console.log(`[FAILED] SOP: ${id} to be deleted is not found`);
            return res.status(404).json({
                status: false,
                message: `SOP NOT FOUND`
            });
        }

        // Log success message and respond with a 200 status indicating successful deletion along with a message
        console.log(`[SUCCESS] Deleted Single SOP: ${id}`);
        return res.status(200).json({
            status: true,
            message: `SUCCESSFULLY DELETED SINGLE SOP ID: ${id}`
        });
    } catch (err) {
        // If any errors occur during the process, catch the error, log it, and return a response with a 500 status and an error message.
        console.log(err);
        return res.status(500).json({
            status: false,
            message: err
        });
    }
};

/*
    CONTROLLER FUNCTIONS
*/

/**
 * Updates a single SOP with the provided custom SOP data, given the SOP ID in the request.
 * @param {number} sopID - The ID of the SOP to be updated.
 * @param {Object} customSop - The custom SOP object containing the updated SOP data.
 * @returns {Object} - The updated SOP object if the update is successful; otherwise, returns null.
 */
async function updateSOP(sopID, customSop) {
    try {
        // Update the SOP record in the database with the provided custom SOP data
        const sop = await SOP.update({
            title: customSop.title,
            definitions: JSON.stringify(JSON.parse(customSop.definitions)),
            purpose: customSop.purpose,
            responsibility: JSON.stringify(JSON.parse(customSop.responsibility)),
            procedure: JSON.stringify(JSON.parse(customSop.procedure)),
            documentation: JSON.stringify(JSON.parse(customSop.documentation)),
            stage: customSop.stage
        }, { where: { id: sopID } });

        // Return the updated SOP object
        return sop;
    } catch (error) {
        // If any errors occur during the update process, catch the error, log it, and return null.
        console.log(error);
        return null;
    }
}
/**
 * Generates multiple SOPs for a given stage passed as a string parameter in the request.
 * Sequelize Model.Create is used to save the SOPs in the database.
 * Statements are the steps for the procedure in a client journey.
 * @param {Object} clientJourney - The client journey object for which SOPs are to be generated.
 * @param {string} forStage - The stage for which SOPs are to be generated (e.g., "awareness", "decision", etc.).
 * @returns {Array} - An array of generated SOPs if the generation is successful; otherwise, returns null.
 */
async function generateSopsForStage(clientJourney, forStage) {
    try {
        // Parse the stage details from the client journey object
        const stage = JSON.parse(clientJourney.dataValues[forStage]);
        let steps = null;
        let sops = [];
        let statement = null;

        // Loop through the steps in the stage to generate SOPs for each step
        for (let i = 0; i < stage["steps"].length; i++) {
            steps = stage["steps"];
            statement = steps[i];

            // Generate a single SOP for the current step/statement
            const sop = await generateSingleSOP(statement);

            // Save the generated SOP in the database using Sequelize Model.create
            await SOP.create({
                title: sop.title,
                purpose: sop.purpose,
                definitions: JSON.stringify(sop.definitions),
                responsibility: JSON.stringify(sop.responsibility),
                procedure: JSON.stringify(sop.procedure),
                documentation: JSON.stringify(sop.documentation),
                stage: forStage,
                clientJourneyID: clientJourney.id
            });

            // Add the generated SOP to the list of SOPs
            sops.push(sop);
        }

        // Return the array of generated SOPs
        return sops;
    } catch (err) {
        // If any errors occur during the generation process, catch the error, log it, and return null.
        console.log(err);
        return null;
    }
}
/**
 * Generates a (single) SOP for a given statement/procedure step from the clientJourney
 * Uses langchain standard class methods, and ChatPromptTemplate as the default system theme. 
 * Context Aware, as the SOP is sequentially generated affected by previous chains (See langchain documentation) due to stored memory.
 * @param {statement} req 
 * @returns {sop} res
 */
async function generateSingleSOP(statement) {
    try {
        const chat = new ChatOpenAI({ temperature: 0.9, modelName: modelName, maxTokens: -1 });
        const memory = new BufferMemory({ returnMessages: true, memoryKey: "history" });
        const messagesPlaceholder = new MessagesPlaceholder("history");
        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                `Standard Operating Procedures (SOPs): For a given statement, generate a single SOP.
            
            Here's a general format for creating an SOP:
            
            1. Title: The title should clearly and concisely describe the procedure.
            2. Purpose/Scope: This section explains why the SOP is necessary and under what circumstances it should be followed. It could include the potential benefits and the objectives the SOP is designed to achieve.
            3. Definitions: This section includes any specific terms, abbreviations, or acronyms used within the SOP.
            4. Responsibility: Detail who is responsible for executing the SOP, including any secondary roles that may be involved in supporting or overseeing the process.
            5. Procedure: This is the core of the SOP. It provides a step-by-step guide on how to complete the procedure. It should be detailed and specific enough that someone unfamiliar with the process could complete it by following the instructions.
            6. Documentation/Records: This section specifies any necessary documentation related to the procedure, such as forms to be filled out, records to be kept, or reports to be submitted.

            Here's the statement: "${statement}"`
            ),
            messagesPlaceholder,
            HumanMessagePromptTemplate.fromTemplate("{input}"),
        ]);

        const titleChain = new ConversationChain({
            memory: memory,
            prompt: chatPrompt,
            llm: chat,
            outputKey: "title",
        });

        const purposeChain = new ConversationChain({
            memory: memory,
            prompt: chatPrompt,
            llm: chat,
            outputKey: "purpose"
        });

        const definitionsChain = new ConversationChain({
            memory: memory,
            prompt: chatPrompt,
            llm: chat,
            outputKey: "definitions"
        });

        const responsibilityChain = new ConversationChain({
            memory: memory,
            prompt: chatPrompt,
            llm: chat,
            outputKey: "responsibility",
        });

        const procedureChain = new ConversationChain({
            memory: memory,
            prompt: chatPrompt,
            llm: chat,
            outputKey: "procedure",
        });

        const documentationChain = new ConversationChain({
            memory: memory,
            prompt: chatPrompt,
            llm: chat,
            outputKey: "documentation"
        });

        const title = await titleChain.call({
            input: `Generate the title. Dont add any labels or tags for example "Title: " `,
        });

        const purpose = await purposeChain.call({
            input: `Generate the purpose. Dont add any labels or tags for example "Purpose: " `,
        });

        const unformattedProcedure = await procedureChain.call({
            input: `Generate the procedure as a detailed paragraph".`,
        });

        const unformattedDocumentation = await documentationChain.call({
            input: `Generate the documentation. Dont add any labels or tags for example "Documentation: "`
        });

        const unformattedDefinitions = await definitionsChain.call({
            input: `List some abbreviations that WERE USED in procedure (not more than 4). Dont add any labels or tags for example "Definitions: "`
        });

        const unformattedResponsibility = await responsibilityChain.call({
            input: `List the people roles responsible. Dont add any labels or tags for example "Responsibility: "`
        });

        let procedure = null;
        let other = null;
        let i = 0;
        while (i < 3) {
            if (procedure == null) {
                procedure = await formatProcedure(unformattedProcedure, chat);
            }
            if (other == null) {
                other = await formatResponsibilityDefinitionDocumentation(unformattedResponsibility, unformattedDefinitions, unformattedDocumentation, chat);
            }
            i++;
        }

        if (procedure == null || other == null) {
            throw "Unable to generate procedure";
        }

        let output = Object.assign({}, title, purpose, procedure, other);
        return output;
    } catch (err) {
        console.log(err);
        return null;
    }
}
/**
 * Formats the procedure section of an SOP. It applies specific formatting instructions provided in the prompt to structure the provided procedure steps correctly.
 * @param {Array} procedure - An array of procedure steps to be formatted.
 * @param {Object} chat - The ChatOpenAI instance used for conversation with the language model.
 * @returns {Object} formattedProcedure - An object containing the formatted procedure steps.
 */
async function formatProcedure(procedure, chat) {
    // Create a parser to extract structured information from the generated output
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            // Define the schema for the formatted procedure
            procedure: z.array(z.string()).describe("Steps to follow for the procedure, please elaborate on each step in significant detail, describe how to carry out/implement the step as well"),
        })
    );

    // Create a fix parser to handle any issues with parsing the output
    const fixParser = OutputFixingParser.fromLLM(
        new ChatOpenAI({ modelName: modelName, temperature: 0 }),
        parser
    );

    // Create a prompt template with the instruction format and input variables
    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template:
            `You are tasked with formatting the provided procedure as described.
        Here is the procedure: {procedure}
        {format_instructions};`,
        inputVariables: ["procedure"],
        partialVariables: { format_instructions: formatInstructions },
    });

    // Create an LLMChain to handle the conversation and output parsing
    const chain = new LLMChain({
        prompt: prompt,
        llm: chat,
        outputKey: "result",
        outputParser: parser,
        fixParser: fixParser
    })

    try {
        // Call the chain with the provided procedure steps
        const output = await chain.call({
            procedure: JSON.stringify(procedure)
        });

        // Return the formatted procedure steps
        return output.result;
    } catch (error) {
        // If any errors occur during the formatting process, catch the error, log it, and return null.
        console.log(error);
        return null;
    }
}
/**
 * Formats the paragraphs for the responsibility, definition, and documentation sections of an SOP.
 * It applies specific formatting instructions provided in the prompt to structure the provided paragraphs correctly.
 * @param {Array} responsibility - An array of responsibility paragraphs to be formatted.
 * @param {Array} definition - An array of definition paragraphs to be formatted.
 * @param {Array} documentation - An array of documentation paragraphs to be formatted.
 * @param {Object} chat - The ChatOpenAI instance used for conversation with the language model.
 * @returns {Object} formattedData - An object containing the formatted paragraphs for responsibility, definition, and documentation sections.
 */
async function formatResponsibilityDefinitionDocumentation(responsibility, definition, documentation, chat) {
    // Create a parser to extract structured information from the generated output
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            // Define the schema for the formatted sections
            responsibility: z.array(z.string()).describe(`Responsible roles, remove existing old numbering/bulleting`),
            definitions: z.array(z.string()).describe(`Definitions, remove existing old numbering/bulleting`),
            documentation: z.array(z.string()).describe(`Documentation, remove existing old numbering/bulleting`),
        })
    );

    // Create a fix parser to handle any issues with parsing the output
    const fixParser = OutputFixingParser.fromLLM(
        new ChatOpenAI({ temperature: 0 }),
        parser
    );

    // Create a prompt template with the instruction format and input variables
    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template:
            `You are tasked with formatting the provided paragraphs according to the instructions provided.
            Here are the required details:
            {responsibility}, 
            {definition}, 
            {documentation}
        {format_instructions};`,
        inputVariables: ["responsibility", "definition", "documentation"],
        partialVariables: { format_instructions: formatInstructions },
    });

    // Create an LLMChain to handle the conversation and output parsing
    const chain = new LLMChain({
        prompt: prompt,
        llm: chat,
        outputKey: "result",
        outputParser: parser,
        fixParser: fixParser
    })

    try {
        // Call the chain with the provided paragraphs for responsibility, definition, and documentation
        const output = await chain.call({
            responsibility: JSON.stringify(responsibility),
            definition: JSON.stringify(definition),
            documentation: JSON.stringify(documentation)
        });

        // Return the formatted paragraphs for responsibility, definition, and documentation sections
        return output.result;
    } catch (error) {
        // If any errors occur during the formatting process, catch the error, log it, and return null.
        console.log(error);
        return null;
    }
}
/**
 * This method regenerates the SOP by modifying or adjusting the input SOP and catering to the prompt sent by the front-end user (referred to as request in the params).
 * @param {Object} previousSOP - The previous SOP object that needs to be regenerated.
 * @param {Object} request - The request or preference from the front-end user for customizing the SOP.
 * @returns {Object} regeneratedSOP - The regenerated SOP after applying the modifications as per the user's request.
 */
async function regenerateSingleSOP(previousSOP, request) {
    // Create a parser to extract structured information from the generated output
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            // Define the schema for different sections of the SOP
            title: z.string().describe(`If suitable change the title`),
            purpose: z.string().array(z.string()).describe(`Purpose with verified statistical information(quote them as well) and real-life entities if necessary`),
            responsibility: z.array(z.string()).describe(`This should be diverse, and dependent on the size of the business.`),
            procedure: z.array(z.string()).describe(`Elaborate in detail (and adjust/modify according to the user's request) on the procedure, include plenty of statistical (numerical) information derived from real internet sources. Provide solid solutions to the steps as well.`),
            documentation: z.array(z.string()).describe(`What are some legal firms in Australia`),
            definitions: z.array(z.string()).describe(`Definitions should be concise and contain all the abbreviations, terms used in the procedure`),
        })
    );

    // Create a fix parser to handle any issues with parsing the output
    const fixParser = OutputFixingParser.fromLLM(
        new ChatOpenAI({ temperature: 0, modelName: modelName }),
        parser
    );

    // Create a prompt template with the instruction format and input variables
    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template:
            `You are an assistant based in Australia and you have been provided with a Standard Operating Procedure (SOP), which you must improve upon according
            to the user's request or preference. You must use real sources and mention companies that actually exist.
            And the REQUEST/PREFERENCE: {request}
            Here's the SOP: {sop}
            {format_instructions}`,
        inputVariables: ["sop", "request"],
        partialVariables: { format_instructions: formatInstructions },
    });

    // Create a new ChatOpenAI instance with the specified options
    const chat = new ChatOpenAI({ temperature: 0.9, modelName: modelName, maxTokens: -1 });

    // Create an LLMChain to handle the conversation and output parsing
    const chain = new LLMChain({
        prompt: prompt,
        llm: chat,
        outputKey: "result",
        outputParser: parser,
        fixParser: fixParser
    });

    try {
        // Call the chain with the previous SOP and user's request to regenerate the SOP
        const output = await chain.call({
            sop: JSON.stringify(previousSOP),
            request: JSON.stringify(request)
        });

        // Return the regenerated SOP after applying the modifications as per the user's request
        return output.result;
    } catch (error) {
        // If any errors occur during the regeneration process, catch the error, log it, and return null.
        console.log(error);
        return null;
    }
}

/* 
    EXPRESS ROUTES
*/

router.post("/generate_for_stage", generateStageSops);
router.post("/getall", getSopsForClientJourney);
router.post("/get_for_stage", getSopsForStage);
router.post("/delete_for_stage", deleteSopsForStage);
router.post("/delete_single", deleteSingleSop);
router.post("/update_single", updateSingleSop);
router.post("/regenerate_sop", regenerateSOP);
module.exports = router;
