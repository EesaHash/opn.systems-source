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

const regenerateSOP = async (req, res) => {
    try {
        let regeneratedSOP = null;
        regeneratedSOP = await regenerateSingleSOP(req.body.sop, req.body.prompt);
        if (regeneratedSOP == null) {
            throw `[FAIL] UNABLE TO REGENERATE SOP`;
        }
        console.log("[SUCCESS] REGENERATED SOP");
        return res.status(200).json({ status: true, sop: regeneratedSOP });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false });
    }
}

const updateSingleSop = async (req, res) => {
    try {
        const sop = await updateSOP(req.body.id, req.body.customSop);
        if (sop == null || sop === 0) {
            throw "SOP NOT FOUND"
        }
        console.log("Successfully updated SOP");
        return res.status(200).json({ status: true, updatedSop: sop });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: false });
    }
}

const deleteSopsForStage = async (req, res) => {
    try {
        const sop = await SOP.destroy({
            where:
            {
                clientJourneyID: req.body.clientJourneyID,
                stage: req.body.stage
            }
        });
        if (sop === 0) {
            console.log("[FAIL] SOPS DO NOT EXIST")
            return res.status(404).json({ status: false });
        }
        console.log(`SUCCESSFULLY DELETED SOPS FOR STAGE: ${req.body.stage} ID: ${req.body.clientJourneyID}`)
        return res.status(200).json({
            status: true,
        });
    }
    catch (err) {
        console.log(`[FAIL] COULD NOT DELETE SOPS FOR ${req.body.clientJourneyID}`, err);
        return res.status(500).json({ status: false });
    }
};

const generateStageSops = async (req, res) => {
    try {
        const { clientJourneyID, stage } = req.body;
        const forStage = stages[stage];
        await SOP.destroy({
            where: {
                clientJourneyID: clientJourneyID,
                stage: forStage
            }
        })
        const clientJourneyList = await ClientJourney.findAll({
            where: {
                id: clientJourneyID
            }
        });
        const clientJourney = clientJourneyList[0];
        if (clientJourney == null) {
            throw "Client Journey not found!";
        }

        await generateSopsForStage(clientJourney, forStage);
        const sops = await SOP.findAll({
            where: {
                clientJourneyID: clientJourneyID
            }
        });
        console.log(`[SUCCESS] GENERATED SOPS FOR CLIENT JOURNEY ID: ${clientJourneyID}`);
        return res.status(200).json({
            status: true,
            sops,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
        });
    }
};

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

const getSopsForClientJourney = async (req, res) => {
    try {
        let sops = await SOP.findAll({
            where: {
                clientJourneyID: req.body.clientJourneyID
            },
            order: ['id'],
            raw: true
        });
        if (sops == null || sops.length == 0) {
            console.log(`[FAIL] COULD NOT RETRIEVE SOPS FOR CLIENT JOURNEY ${req.body.clientJourneyID}`);
            return res.status(404).json({
                status: false,
            });
        }

        console.log(`[SUCCESS] RETRIEVED SOPS FOR CLIENT JOURNEY ID: ${req.body.clientJourneyID}`);
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

const deleteSingleSop = async (req, res) => {
    try {
        const { id } = req.body
        const sop = await SOP.destroy({ where: { id: id } });
        if (sop === 0) {
            console.log(`[FAILED] SOP: ${id} to be deleted is not found`);
            return res.status(404).json({
                status: false,
                message: `SOP NOT FOUND`
            });
        }
        console.log(`[SUCCESS] Deleted Single SOP: ${id}`);
        return res.status(200).json({
            status: true,
            message: `SUCCESSFULLY DELETED SINGLE SOP ID: ${id}`
        });
    } catch (err) {
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

async function updateSOP(sopID, customSop) {
    try {
        const sop = await SOP.update({
            title: customSop.title,
            definitions: JSON.stringify(JSON.parse(customSop.definitions)),
            purpose: customSop.purpose,
            responsibility: JSON.stringify(JSON.parse(customSop.responsibility)),
            procedure: JSON.stringify(JSON.parse(customSop.procedure)),
            documentation: JSON.stringify(JSON.parse(customSop.documentation)),
            stage: customSop.stage
        }, { where: { id: sopID } });
        return sop;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function generateSopsForStage(clientJourney, forStage) {
    try {
        const stage = JSON.parse(clientJourney.dataValues[forStage]);
        let steps = null;
        let sops = [];
        let statement = null;
        for (let i = 0; i < stage["steps"].length; i++) {
            steps = stage["steps"];
            statement = steps[i];
            const sop = await generateSingleSOP(statement);
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
            sops.push(sop);
        }
        return sops;
    }
    catch (err) {
        console.log(err);
    }
}

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

async function editStep(stepList, userPrompt, idx) {

    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        resp: "adjusted/modified paragraph or statement",
    });
    const fixParser = OutputFixingParser.fromLLM(
        new ChatOpenAI({ temperature: 0 }),
        parser
    );

    const formatInstructions = parser.getFormatInstructions();

    const prompt = new PromptTemplate({
        template:
            `You are tasked with modifying the provided paragraph with according to the user's request/preference.
            Please add information from external sources and give an indepth answer using numericals (if possible).
            Give some recommendations as well, that are relevant to what the user is asking as well as describe how they would carry out these recommendations as well.
            Here is the paragraph: ${stepList[idx]},
            And here is user's preference/request: {userPrompt},
            {format_instructions};`,
        inputVariables: ["userPrompt"],
        partialVariables: { format_instructions: formatInstructions },
    });
    const model = new OpenAI({ temperature: 1, modelName: modelName });
    const chain = new LLMChain({
        prompt: prompt,
        llm: model,
        outputKey: "result",
        outputParser: parser,
        fixParser: fixParser
    });

    const output = await chain.call({
        userPrompt: userPrompt
    });

    stepList[idx] = output.result.resp;
    return stepList;
}

async function formatProcedure(procedure, chat) {

    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            procedure: z
                .array(z.string())
                .describe("Steps to follow for the procedure, please ellaborate on each step in significant detail, describe how to carry out/implement the step as well"),
        })
    );
    const fixParser = OutputFixingParser.fromLLM(
        new ChatOpenAI({ modelName: modelName, temperature: 0 }),
        parser
    );

    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template:
            `You are tasked with formatting the provided procedure as described.
        Here is the procedure: {procedure}
        {format_instructions};`,
        inputVariables: ["procedure"],
        partialVariables: { format_instructions: formatInstructions },
    });

    const chain = new LLMChain({
        prompt: prompt,
        llm: chat,
        outputKey: "result",
        outputParser: parser,
        fixParser: fixParser
    })

    try {
        const output = await chain.call({
            procedure: JSON.stringify(procedure)
        });
        return output.result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function formatResponsibilityDefinitionDocumentation(responsibility, definition, documentation, chat) {
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            responsibility: z
                .array(z.string())
                .describe(`Responsible roles, remove existing old numbering/bulleting`),
            definitions: z
                .array(z.string())
                .describe(`Definitions, remove existing old numbering/bulleting`),
            documentation: z
                .array(z.string())
                .describe(`Documentation, remove existing old numbering/bulleting`),
        })
    );
    const fixParser = OutputFixingParser.fromLLM(
        new ChatOpenAI({ temperature: 0 }),
        parser
    );

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

    const chain = new LLMChain({
        prompt: prompt,
        llm: chat,
        outputKey: "result",
        outputParser: parser,
        fixParser: fixParser
    })

    try {
        const output = await chain.call({
            responsibility: JSON.stringify(responsibility),
            definition: JSON.stringify(definition),
            documentation: JSON.stringify(documentation)
        });
        return output.result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function regenerateSingleSOP(previousSOP, request) {
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            title: z.string().describe(`If suitable change the title`),
            purpose: z.string()
                .array(z.string())
                .describe(`Purpose with verified statistical information(quote them as well) and real life entities if necessary`),
            responsibility: z
                .array(z.string())
                .describe(`This should be diverse, and depenedant on the size of the business.`),
            procedure: z
                .array(z.string())
                .describe(`Ellaborate in detail (and adjust/modify according to the user's request) on the procedure, include plenty of statistical(numerical) information derived from real internet sources.
                Provide solid solutions to the steps as well`),
            documentation: z
                .array(z.string())
                .describe(`What are some legal firms in Australia`),
            definitions: z
                .array(z.string())
                .describe(`Definitions should be concise, and contain all the abbreviations, terms used in procedure`),
        })
    );
    const fixParser = OutputFixingParser.fromLLM(
        new ChatOpenAI({ temperature: 0, modelName: modelName}),
        parser
    );

    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template:
            `You are an assistant based in Australia and you have been provided with a Standard Operating Procedure (SOP), which you must improve upon according
             to the user's request or preference. You must use real sources, and mention companies that actually exist.
             And the REQUEST/PREFERENCE: {request}
             Here's the SOP: {sop}
             {format_instructions}`,
        inputVariables: ["sop", "request"],
        partialVariables: { format_instructions: formatInstructions },
    });
    const chat = new ChatOpenAI({ temperature: 0.9, modelName: modelName, maxTokens: -1 });
    const chain = new LLMChain({
        prompt: prompt,
        llm: chat,
        outputKey: "result",
        outputParser: parser,
        fixParser: fixParser
    })
    try {
        const output = await chain.call({
            sop: JSON.stringify(previousSOP),
            request: JSON.stringify(request)
        });
        return output.result;
    } catch (error) {
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
