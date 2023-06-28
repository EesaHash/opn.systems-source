const express = require("express");
const router = express.Router();
const { z } = require("zod");
const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
const Business = require('../../models/business');
const ClientJourney = require('../../models/client_journey');

const {
    StructuredOutputParser,
    OutputFixingParser,
} = require("langchain/output_parsers");

require('dotenv').config()


const example = `{  
    "department":"Marketing",
    "role":"Retention Manager",
    "steps":[  
       "Develop a customer loyalty program to incentivize repeat purchases.",
       "Develop customizable communications and reward options for customers.",
       "Implement promotions and discounts to reward customers that refer or promote the business.",
       "Create a customer rewards program offering discounts for repeat customers.",
       "Monitor customer reviews to ensure the business is meeting expectations.",
       "Collect feedback from customers about their experiences and use this data to develop strategies for improving customer satisfaction.",
       "Identify best customers and develop relationships with them by providing exceptional customer service."
    ]
 }`;
const clientJourney = {};


clientJourney.saveClientJourney = async (req, res) => {
    let isSuccess = false;
    try {
        isSuccess = await generateClientJourney(req.body.id);
        return res.status(200).json({"Client Journey Saved": isSuccess});
    } catch (error) {
        console.log(error);
        return res.status(403).json({"Client Journey Saved": isSuccess});
    }
}

clientJourney.getClientJourneyByBusinessID = async (req, res) => {
    try {
        const clientJourney = await ClientJourney.findOne({ where: { businessId: req.body.businessId } });
        return res.status(200).json(clientJourney);
    } catch (error) {
        return res.status(403).json({
            result: "None"
        });
    }
}



const generateClientJourney = async (id) => {
    try {

        const business = await Business.findOne({ where: { id: id } });
        const businessDetails = "Business Name:" + business.businessName + "\n Business Type:" + business.businessType + "\n Industry:" + business.industry + "\n Company Size:" + business.companySize + "\n Business Objective:" + business.businessObjective + "\n Core Services:" + business.coreServices + "\n Target Market:" + business.targetMarket + "\n Product or Service Description:" + business.productOrServiceDescription + "\n Is Manufacture:" + business.isManufacture + "\n Funding Strategy:" + business.fundingStrategy;
        console.log(businessDetails)
        const overview = await generateOverview(businessDetails);
        const clientJourney = await new ClientJourney({
            overview: overview.overview,
            awareness: JSON.stringify(await generateStage("awareness", businessDetails)),
            interest: JSON.stringify(await generateStage("interest", businessDetails)),
            evaluation: JSON.stringify(await generateStage("evaluation", businessDetails)),
            decision: JSON.stringify(await generateStage("decision", businessDetails)),
            purchase: JSON.stringify(await generateStage("purchase", businessDetails)),
            implementation: JSON.stringify(await generateStage("implementation", businessDetails)),
            postPurchase: JSON.stringify(await generateStage("post-purchase", businessDetails)),
            retention: JSON.stringify(await generateStage("retention", businessDetails)),
            businessId: id,
        });
        clientJourney.save();
        return true;
    } catch (error) {
        console.log("Error saving client journey: ",error);
        return false;
    }
}

async function generateOverview(businessDetailsString) {
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            overview: z.string().describe("Overview: A summary for the client journey"),
        }),
    );

    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template:
          `Generate a brief description for a client journey
           Use these business details: {businessDetails}
           {format_instructions}`,
        inputVariables: ["businessDetails"],
        partialVariables: { format_instructions: formatInstructions },
    });

    const model = new OpenAI({ temperature: 1, model: "gpt-3.5-turbo-16k" });
    const input = await prompt.format({
        businessDetails: businessDetailsString,
    });
    const response = await model.call(input);
    try {
        parsedResponse = await parser.parse(response);
        return parsedResponse;
    } catch (e) {
        try {
            console.error("Failed to parse bad output! Retrying with parser fixer...");
            const fixParser = OutputFixingParser.fromLLM(
                new OpenAI({ temperature: 0, model: "gpt-3.5-turbo-16k" }),
                parser
            );
            const output = await fixParser.parse(response);
            console.log("Output Fixed!");
            return output;
        }
        catch (e) {
            console.log(`Failed to generate client journey overview`);
            return null;
        }
    }
}

async function generateStage(stageString, businessDetailsString) {
    console.log("Generating stage: ", stageString);
    definitions = {
        "overview": "Overview: A summary for the client journey",
        "awareness": "This is when the potential client first becomes aware of your business or services. This could be via marketing, social media, a web search, or word-of-mouth recommendations",
        "interest": "The potential client has some interest in what you offer and starts seeking out more information. They might visit your website, read blog posts or reviews, or follow you on social media to learn more about your offerings.",
        "evaluation": "The potential client begins to evaluate whether your product or service will meet their needs. They compare your offerings to those of other businesses and consider the benefits and drawbacks of each.",
        "decision": "The client decides to proceed with the purchase or hire your services. They may reach out to the sales or customer service team for any final queries before moving forward.",
        "purchase": "The client completes the transaction and officially becomes a customer.",
        "implementation": "The customer begins using the product or service. In the case of a service-based business, this could be the delivery of the service. For a product-based business, it might be the customer starting to use the purchased product.",
        "post-purchase": "After the purchase or delivery of services, the customer might need support or have questions. This phase includes customer service, technical support, and follow-up communication.",
        "retention": "This is the stage of keeping the customer engaged for repeat business or referrals. This might involve marketing communication, offering new products or services, or customer loyalty programs.",
    };

    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            department: z.string().describe("Identify responsible department for this stage. These are the main sectors or divisions within the company. Each department represents a specific function of the business, such as Marketing, Sales, Human Resources, Operations, Finance, etc."),
            role: z.string().describe("Identify responsible roles for this stage. Within each department, there are several roles. Roles are the specific job titles or positions that individuals hold within the department. For example, in the Marketing department, roles might include Marketing Manager, Content Strategist, SEO Specialist, etc."),
            steps: z
                .array(z.string())
                .describe("Steps to follow in this stage. Be ellaborate by providing a lot of detail."),
        })
    );

    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template:
            `Generate the client journey's ${stageString} stage
           Definition (${stageString}): ${definitions[stageString]}
           Use these business details: {businessDetails}
           {format_instructions};`,
           
        inputVariables: ["businessDetails", "example"],
        partialVariables: { format_instructions: formatInstructions },
    });

    const model = new OpenAI({ temperature: 1, model: "gpt-3.5-turbo-16k" });
    const input = await prompt.format({
        businessDetails: businessDetailsString,
        example: example,
    });
    const response = await model.call(input);
    console.log(response);
    try {
        parsedResponse = await parser.parse(response);
        return parsedResponse;
    } catch (e) {
        try {
            console.error("Failed to parse bad output! Retrying with parser fixer...");
            const fixParser = OutputFixingParser.fromLLM(
                new OpenAI({ temperature: 0, model: "gpt-3.5-turbo-16k" }),
                parser
            );
            const output = await fixParser.parse(response);
            console.log("Output Fixed!");
            return output;
        }
        catch (e) {
            console.log(`Failed to generate client journey stage: ${stageString}`);
            return null;
        }
    }
}







const test = {};


test.ps = async (req, res) => {
    try {
        const business = await Business.findOne({ where: { id: 4 } });
        const businessDetails = "Business Name:" + business.businessName + "\n Business Type:" + business.businessType + "\n Industry:" + business.industry + "\n Company Size:" + business.companySize + "\n Business Objective:" + business.businessObjective + "\n Core Services:" + business.coreServices + "\n Target Market:" + business.targetMarket + "\n Product or Service Description:" + business.productOrServiceDescription + "\n Is Manufacture:" + business.isManufacture + "\n Funding Strategy:" + business.fundingStrategy;
        const response = await generateStage("decision", businessDetails);
        const resp2 = await generateOverview(businessDetails);
        console.log(resp2);
        console.log(response);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(403).json({
            result: "None"
        });
    }
}

router.get("/test", test.ps);
router.post("/save", clientJourney.saveClientJourney);
router.post("/get", clientJourney.getClientJourneyByBusinessID);
module.exports = router;