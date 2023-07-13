const express = require("express");
const router = express.Router();
const { ChatOpenAI } = require("langchain/chat_models/openai");
const ClientJourney = require("../../models/client_journey");
const SOP = require("../../models/sop");
const { ConversationChain } = require("langchain/chains");
const {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
} = require("langchain/prompts")
const { BufferMemory } = require("langchain/memory")
require('dotenv').config();

const stages = ["awareness", "interest", "evaluation", "decision", "purchase", "implementation", "postPurchase", "retention"];

const updateSingleSop = async (req, res) => {
    try {
        const sop = await updateSOP(req.body.id, req.body.customSop);
        if (sop == null || sop === 0) {
            throw "SOP NOT FOUND"
        }
        return res.status(200).json({ status: "SUCCESS", updatedSop: sop });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR" });
    }
}


const updateSOP = async (sopID, customSop) => {
    try {
        const sop = await SOP.update({
            title: customSop.title,
            definitions: customSop.definitions,
            purpose: customSop.purpose,
            industry: customSop.industry,
            responsibility: customSop.responsibility,
            procedure: customSop.procedure,
            documentation: customSop.documentation,
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
        if (sop === 0)
            return res.status(404).json({ status: "FAILED", message: `SOPS NOT FOUND` });
        return res.status(200).json({
            status: "SUCCESS",
            message: `SUCCESSFULLY DELETED SOPS FOR ${req.body.stage}`
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "ERROR" });
    }
};

const generateSopForStage = async (req, res) => {
    try {
        const {clientJourneyID, stage} = req.body;
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

        const sops = await generateFewSOPs(clientJourney, forStage);
        return res.status(200).json({
            status: true,
            sops,
            message: "success"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            message: "error"
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
            return res.status(404).json({
                status: false,
                message: "NOT FOUND",
            });
        }
        return res.status(200).json({
            status: true,
            sops: sops
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            status: false,
            message: "NOT FOUND",
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
            return res.status(404).json({
                status: false,
                message: "NOT FOUND",
            });
        }
        return res.status(200).json({
            status: true,
            sops: sops
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            status: false,
            message: "NOT FOUND",
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
            // statement = steps[Math.floor(Math.random() * steps.length)];
            const sop = await generateSingleSOP(statement);
            sops.push(sop);
        }
        for (let i = 0; i < sops.length; i++) {
            await SOP.create({
                title: sops[i].title,
                purpose: sops[i].purpose,
                definitions: sops[i].definitions,
                responsibility: sops[i].responsibility,
                procedure: sops[i].procedure,
                documentation: sops[i].documentation,
                stage: forStage,
                clientJourneyID: clientJourney.id
            });
        }
        return sops;
    }
    catch (err) {
        console.log(err);
    }
}

const generateSingleSOP = async (statement) => {
    try {
        const chat = new ChatOpenAI({ temperature: 0.9 });
        const memory = new BufferMemory({ returnMessages: true, memoryKey: "history" });
        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                `Standard Operating Procedures (SOPs): For a given statement, generate a single SOP.
            
            Here's a general format for creating an SOP:
            
            1. Title: The title should clearly and concisely describe the procedure.
            2. Purpose/Scope: This section explains why the SOP is necessary and under what circumstances it should be followed. It could include the potential benefits and the objectives the SOP is designed to achieve.
            3. Definitions: This section includes any specific terms, abbreviations, or acronyms used within the SOP.
            4. Responsibility: Detail who is responsible for executing the SOP, including any secondary roles that may be involved in supporting or overseeing the process.
            5. Procedure: This is the core of the SOP. It provides a step-by-step guide on how to complete the procedure. It should be detailed and specific enough that someone unfamiliar with the process could complete it by following the instructions. It's often beneficial to break down complex procedures into smaller, manageable steps.
            6. Documentation/Records: This section specifies any necessary documentation related to the procedure, such as forms to be filled out, records to be kept, or reports to be submitted.

            Here's the statement: "${statement}"`
            ),
            new MessagesPlaceholder("history"),
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

        const procedure = await procedureChain.call({
            input: `Generate the procedure. Dont add any labels or tags for example "Procedure: " `,
        });

        const documentation = await documentationChain.call({
            input: `Generate the documentation. Dont add any labels or tags for example "Documentation: "`
        });

        const definitions = await definitionsChain.call({
            input: `List some abbreviations that WERE USED in procedure (not more than 4). Dont add any labels or tags for example "Definitions: "`
        });

        const responsibility = await responsibilityChain.call({
            input: `List the people roles responsible. Dont add any labels or tags for example "Responsibility: "`
        });

        let output = Object.assign({}, title, responsibility, purpose, definitions, procedure, documentation);
        return output;
    } catch (err) {
        console.log(err);
        return null;
    }
}

router.post("/generate_for_stage", generateSopForStage);
router.post("/getall", getSopsForClientJourney);
router.post("/get_for_stage", getSopsForStage);
router.post("/delete_for_stage", deleteSopsForStage);
router.post("/delete_single", deleteSingleSop);
router.post("/update_single", updateSingleSop)
module.exports = router;
