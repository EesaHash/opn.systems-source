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
const { BufferMemory } = require("langchain/memory")
require('dotenv').config();

const modelName = "gpt-4";
const stages = ["awareness", "interest", "evaluation", "decision", "purchase", "implementation", "postPurchase", "retention"];


const regenerateSOP = async (req, res) => {
    try {
        let regeneratedSOP = null;
        regeneratedSOP = await regenerateSingleSOP(req.body.sop, req.body.prompt);
        if (regeneratedSOP == null) {
            throw `[FAIL] UNABLE TO REGENERATE SOP`;
        }
        console.log("[SUCCESS] REGENERATED SOP")
        return res.status(200).json({ status: true, sop: regeneratedSOP});
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
/*
{
    steps : [] (list of steps)
    prompt : (AI text input by user)
    idx :  (index of the step in the list of steps)
}
*/
// const regenerateSOP = async (req, res) => {
//     try {
//         const singleSOP
//         console.log("[SUCCESS] REGENERATED SOP STEP");
//         return res.status(200).json({ status: true, step: regeneratedListWithStep[req.body.idx],regeneratedList: JSON.stringify(regeneratedListWithStep)});
//     } catch (error) {
//         console.log(`[FAIL] COULD NOT REGENERATE SOP STEP`,error);
//         return res.status(500).json({ status: false });
//     }
// }

const updateSOP = async (sopID, customSop) => {
    try {
        const sop = await SOP.update({
            title: customSop.title,
            definitions: JSON.stringify(customSop.definitions),
            purpose: customSop.purpose,
            responsibility: JSON.stringify(customSop.responsibility),
            procedure: JSON.stringify(customSop.procedure),
            documentation: JSON.stringify(customSop.documentation),
            stage: customSop.stage
        }, { where: { id: sopID } });
        return sop;
    } catch (error) {
        console.log(error);
        return null;
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
            return res.status(404).json({ status: false });}
        console.log(`SUCCESSFULLY DELETED SOPS FOR STAGE: ${req.body.stage} ID: ${req.body.clientJourneyID}`)
        return res.status(200).json({
            status: true,
        });
    }
    catch (err) {
        console.log(`[FAIL] COULD NOT DELETE SOPS FOR ${req.body.clientJourneyID}`,err);
        return res.status(500).json({ status: false });
    }
};

const generateSopForStage = async (req, res) => {
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

        await generateFewSOPs(clientJourney, forStage);
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
        console.log(`[FAIL] COULD NOT RETRIEVE SOPS `,error);
        return res.status(404).json({
            status: false,
        });
    }
};

const getSopsForClientJourney = async (req, res) => {
    try {
        const sops = await SOP.findAll({
            where: {
                clientJourneyID: req.body.clientJourneyID
            }
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
        console.log(`[FAIL] COULD NOT RETRIEVE SOPS `,error);
        return res.status(404).json({
            status: false,
        });
    }
};

const deleteSingleSop = async (req, res) => {
    try {
        const sop = await SOP.destroy({
            where:
            {
                id: req.body.id,
            }
        });
        if (sop === 0)
            return res.status(404).json({ status: "FAILED", message: `SOP NOT FOUND` });
        return res.status(200).json({
            status: "SUCCESS",
            message: `SUCCESSFULLY DELETED SINGLE SOP ID: ${req.body.id}`
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "ERROR" });
    }
};

/*
Randomised generation for sops based on a single step for a given client journey stage
1 SOP per stage, (one for awareness, interest etc... )
*/
const generateFewSOPs = async (clientJourney, forStage) => {
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

const generateSingleSOP = async (statement) => {
    try {
        const chat = new ChatOpenAI({ temperature: 0.9, model: modelName});
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
                other = await formatResponsibilityDefinitionDocumentation(unformattedResponsibility,unformattedDefinitions, unformattedDocumentation, chat);
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
    const model = new OpenAI({ temperature: 1, model: modelName });
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
        new ChatOpenAI({ temperature: 0 }),
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
    try{
        const chat = new ChatOpenAI({ temperature: 0.9, model: modelName});
        const memory = new BufferMemory({ returnMessages: true, memoryKey: "history" });
        const messagesPlaceholder = new MessagesPlaceholder("history");
        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
            `Standard Operating Procedures (SOPs):
            Your goal is to use the SOP below and adjust/modify it according to the preference/request AND the user input (provided later)
            The regenerated information should not deviate too much from the old sop, but you should ellaborate further(by giving real life recommendations, quoting statistics and methods/tools or actual companies that can help with the SOP).
            Here's the SOP: "${previousSOP}"
            Here's the REQUEST: "${request}"`
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
            input: `Regenerate the new title. Dont add any labels or tags for example "Title: " `,
        });

        const purpose = await purposeChain.call({
            input: `Regenerate the new purpose. Dont add any labels or tags for example "Purpose: " `,
        });

        const unformattedProcedure = await procedureChain.call({
            input: `Regenerate the new procedure as a highly detailed paragraph whilst also tailoring to the request. Do not add any labels or tags e.g. "Procedure: "`,
        });

        const unformattedDocumentation = await documentationChain.call({
            input: `Regenerate the new documentation. Dont add any labels or tags for example "Documentation: "`
        });

        const unformattedDefinitions = await definitionsChain.call({
            input: `List some new abbreviations that WERE USED in procedure (not more than 6). Dont add any labels or tags for example "Definitions: "`
        });

        const unformattedResponsibility = await responsibilityChain.call({
            input: `List the new people/roles responsible. Dont add any labels or tags for example "Responsibility: "`
        });

        let procedure = null;
        let other = null;
        let i = 0;
        while (i < 3) {
            if (procedure == null) {
                procedure = await formatProcedure(unformattedProcedure, chat);
            }
            if (other == null) {
                other = await formatResponsibilityDefinitionDocumentation(unformattedResponsibility,unformattedDefinitions, unformattedDocumentation, chat);
            }
            i++;
        }

        if (procedure == null || other == null) {
            throw "Unable to generate procedure";
        }

        let output = Object.assign({}, title, purpose, procedure, other);
        return output;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}

router.post("/generate_for_stage", generateSopForStage);
router.post("/getall", getSopsForClientJourney);
router.post("/get_for_stage", getSopsForStage);
router.post("/delete_for_stage", deleteSopsForStage);
router.post("/delete_single", deleteSingleSop);
router.post("/update_single", updateSingleSop);
// router.post("/regenerate_step", regenerateSopStep);
router.post("/regenerate_sop", regenerateSOP);
module.exports = router;
