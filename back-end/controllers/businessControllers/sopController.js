const express = require("express");
const router = express.Router();
const { z } = require("zod");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const Business = require("../../models/business");
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
require('dotenv').config()


const { PromptTemplate } = require("langchain/prompts");
const {
  StructuredOutputParser,
  OutputFixingParser,
} = require("langchain/output_parsers");

const test = async (req, res) => {
  try {
    const clientJourneyList = await ClientJourney.findAll({ where: {
       clientJourneyID : req.body.clientJourneyID
      } 
    });
    const business = await Business.findOne({ where: { id: req.body.businessId } });
    const businessDetails = "Business Name:" + business.businessName + "\n Business Type:" + business.businessType + "\n Industry:" + business.industry + "\n Company Size:" + business.companySize + "\n Business Objective:" + business.businessObjective + "\n Core Services:" + business.coreServices + "\n Target Market:" + business.targetMarket + "\n Product or Service Description:" + business.productOrServiceDescription +  "\n Funding Strategy:" + business.fundingStrategy;
    const clientJourney = clientJourneyList[0];
    if (clientJourney == null) {
      throw "Client Journey not found!";
    }
    //await test(clientJourney);
    await generateFewSOPs(clientJourney, businessDetails);
    return res.status(200).json({ message: "success" });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};



/*
Randomised generation for sops based on a single step for a given client journey stage
1 SOP per stage, (one for awareness, interest etc... )
*/
const generateFewSOPs = async (clientJourney, businessDetails) => {
  try {
    const stages = [
      JSON.parse(clientJourney.dataValues.awareness),
      JSON.parse(clientJourney.dataValues.interest),
      JSON.parse(clientJourney.dataValues.evaluation),
      JSON.parse(clientJourney.dataValues.decision),
      JSON.parse(clientJourney.dataValues.purchase),
      JSON.parse(clientJourney.dataValues.implementation),
      JSON.parse(clientJourney.dataValues.postPurchase),
      JSON.parse(clientJourney.dataValues.retention),
    ];

    let steps = null;
    let sops = [];
    let statement = null;
    for (let i = 0; i < stages.length; i++) {
      if (i == 2) {
        break;
      }
      steps = stages[i]["steps"];
      statement = steps[Math.floor(Math.random() * steps.length)];
      console.log(statement);
      const sop = await generateSingleSOP(statement, businessDetails);
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
        ClientJourneyId: clientJourney.id
      });
    }
  }
  catch (err) {
    console.log(err);
  }
}

const generateSingleSOP = async (statement, businessDetails) => {
    try {
        const chat = new ChatOpenAI({ temperature: 0.9 });
        const memory = new BufferMemory({ returnMessages: true, memoryKey: "history" });
        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
            `Standard Operating Procedures (SOPs): For a given statement, generate a single SOP.

            Produce in the following format
            
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

        // const primer = await primerChain.call({
        //   input: `Provided here are some business details. Please dont output anything, I am just providing these to you so that you have more context. Business Details : ${businessDetails}`
        // });

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
        console.log(output);
        return output;
    }catch (err) {
        console.log(err);
        return null;
    }
}

router.post("/", test);
module.exports = router;
