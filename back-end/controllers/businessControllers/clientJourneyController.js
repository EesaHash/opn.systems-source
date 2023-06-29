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

const clientJourney = {};

clientJourney.saveClientJourney = async (req, res) => {
    let journey;
    try {
        const clientJourney = await ClientJourney.findOne({ where: { businessId: req.body.id } });
        if (clientJourney == null) {
            journey = await generateClientJourney(req.body.id, req.body.title);
            return res.status(200).json({
                status: true,
                message: "Successfully add new client journey!",
                journey: journey
            });
        } else {
            return res.status(403).json({
                status: false,
                message: "Client Journey already exists!",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            status: false,
            message: error,
        });
    }
}

clientJourney.getClientJourneyByBusinessID = async (req, res) => {
    try {
        const clientJourney = await ClientJourney.findOne({ where: { businessId: req.body.businessId } });
        return res.status(200).json(clientJourney);
    } catch (error) {
        return res.status(403).json({
            result: `Client Journey for Business ID: ${businessId} not found}`
        });
    }
}

clientJourney.getAllClientJourneyByBusinessID = async (req, res) => {
    try{
        const clientJourney = await ClientJourney.findAll({ where: { businessId: req.body.businessId } });
        return res.status(200).json({
            status: true,
            message: "Successfully retrieve client journey!",
            clientJourneys: clientJourney
        });
    }catch (error) {
        return res.status(403).json({
            status: false,
            message: error
        });
    }
};

clientJourney.deleteClientJourneyByBusinessID = async (req, res) => {
    try {
        const { businessId } = req.body;
        const clientJourney = await ClientJourney.findOne({ where: { businessId: businessId } });
        await clientJourney.destroy();
        return res.status(200).json({
            result: `Client Journey for Business ID: ${businessId} deleted`
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            result: `Failed to delete client journey`
        });
    }
}

clientJourney.updateClientJourneyStageByBusinessID = async (req, res) => {
    try {
        const clientJourney = await ClientJourney.findOne({ where: { businessId: req.body.businessId } });
        const stage = req.body.stage;
        const data = req.body.data;
        clientJourney[stage] = JSON.stringify(data);
        await clientJourney.save();
        return res.status(200).json({
            result: `Client Journey for Business ID: ${businessId} updated}`
        });
    } catch (error) {
        return res.status(403).json({
            result: `Client Journey for Business ID: ${businessId} not found}`
        });
    }
}

const generateClientJourney = async (id, title) => {
    try {
        const business = await Business.findOne({ where: { id: id } });
        if (business === null || business === undefined) {
            return false;
        }
        const businessDetails = "Business Name:" + business.businessName + "\n Business Type:" + business.businessType + "\n Industry:" + business.industry + "\n Company Size:" + business.companySize + "\n Business Objective:" + business.businessObjective + "\n Core Services:" + business.coreServices + "\n Target Market:" + business.targetMarket + "\n Product or Service Description:" + business.productOrServiceDescription +  "\n Funding Strategy:" + business.fundingStrategy;
        let Overview = await generateOverview(businessDetails);
        let Awareness = await generateStage("awareness", businessDetails);
        let Interest = await generateStage("interest", businessDetails);
        let Evaluation = await generateStage("evaluation", businessDetails);
        let Decision = await generateStage("decision", businessDetails);
        let Purchase = await generateStage("purchase", businessDetails);
        let Implementation = await generateStage("implementation", businessDetails);
        let PostPurchase = await generateStage("post-purchase", businessDetails);
        let Retention = await generateStage("retention", businessDetails);
        const stages = [Awareness, Interest, Evaluation, Decision, Purchase, Implementation, PostPurchase, Retention];
        const stringStages = ["awareness", "interest", "evaluation", "decision", "purchase", "implementation", "postPurchase", "retention"];
        let i = 0;
        while (i < stages.length) {
            if (stages[i] == null) {
                stages[i] = await retryStage(stringStages[i], businessDetails);
            }
            i++;
        }
        const clientJourney = await new ClientJourney({
            title: title,
            overview: JSON.stringify(Overview),
            awareness: JSON.stringify(stages[0]),
            interest: JSON.stringify(stages[1]),
            evaluation: JSON.stringify(stages[2]),
            decision: JSON.stringify(stages[3]),
            purchase: JSON.stringify(stages[4]),
            implementation: JSON.stringify(stages[5]),
            postPurchase: JSON.stringify(stages[6]),
            retention: JSON.stringify(stages[7]),
            businessId: id,
        });
        clientJourney.save();
        return clientJourney;
    } catch (error) {
        console.log("Error saving client journey: ", error);
        return null;
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
}

async function generateStage(stageString, businessDetailsString) {
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
            department: z.string().describe(`Identify responsible department for ${stageString} stage. These are the main sectors or divisions within the company. Each department represents a specific function of the business, such as Marketing, Sales, Human Resources, Operations, Finance, etc.`),
            role: z.string().describe(`Identify responsible roles for the ${stageString} stage. Within each department, there are several roles. Roles are the specific job titles or positions that individuals hold within the department. For example, in the Marketing department, roles might include Marketing Manager, Content Strategist, SEO Specialist, etc.`),
            steps: z
                .array(z.string())
                .describe("Steps to follow in this stage. Be ellaborate by providing a lot of detail."),
        })
    );
    //Definition (${stageString}): ${definitions[stageString]}
    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template:
        `Generate a client journey's ${stageString} stage
         Given these details for a business: {businessDetails}
         {format_instructions};`,
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
}


async function retryStage(stageString, businessDetailsString) {
    let output = null;
    let i = 0;
    while (i < 10) {
        output = await generateStage(stageString, businessDetailsString);
        if (output != null) {
            break;
        }
        i++;
    }
    return output;
}


router.post("/save", clientJourney.saveClientJourney);
router.post("/get", clientJourney.getClientJourneyByBusinessID);
router.post("/getall", clientJourney.getAllClientJourneyByBusinessID);
router.put("/update", clientJourney.updateClientJourneyStageByBusinessID);
router.delete("/delete", clientJourney.deleteClientJourneyByBusinessID);

module.exports = router;