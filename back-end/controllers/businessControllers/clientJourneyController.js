const express = require("express");
const router = express.Router();
const { z } = require("zod");
const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
const Product = require('../../models/product');
const Business = require('../../models/business');
const ClientJourney = require('../../models/client_journey');
const { saveParaphrasedStages } = require('../businessControllers/stageParaphraseController');
const {
    StructuredOutputParser,
    OutputFixingParser,
} = require("langchain/output_parsers");

require('dotenv').config()

const clientJourney = {};


//"gpt-3.5-turbo-16k"
const modelName = "gpt-3.5-turbo-16k"

clientJourney.saveClientJourney = async (req, res) => {
    try {
        const {productID} = req.body;
        const cj = await ClientJourney.findOne({ where: { productID: productID } });
        if (cj == null) {
            const journey = await generateClientJourney(req.body.productID, req.body.title);
            if (journey != null) {
                const stageNames = await saveParaphrasedStages(journey.id,modelName);
                return res.status(200).json({
                    status: true,
                    message: "Successfully add new client journey!",
                    journey: journey,
                    headings: stageNames
                });
            }
            throw new error("Unable to create Client Journey");
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

clientJourney.getClientJourneyByProductID = async (req, res) => {
    try {
        const {productID} = req.body;
        const clientJourney = await ClientJourney.findOne({ where: {productID} });
        console.log(`Successfully Retrieve client journey for product ID: ${productID}`)
        return res.status(200).json(clientJourney);
    } catch (error) {
        return res.status(403).json({
            result: `Client Journey for Product ID: ${req.body.productID} not found}`
        });
    }
}

clientJourney.deleteClientJourneyByBusinessID = async (req, res) => {
    try {
        const { clientJourneyID } = req.body;
        const clientJourney = await ClientJourney.findOne({ where: { id: clientJourneyID } });
        await clientJourney.destroy();
        return res.status(200).json({
            result: `Client Journey deleted`
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            result: `Failed to delete client journey`
        });
    }
}

/*
Example JSON body:
{
    businessId: 1,
    stage: "awareness"
    content: {
        department: "Marketing",
        role: "Marketing Manager",
        steps: ["Step 1", "Step 2", "Step 3"]
    }
}
*/

clientJourney.saveRegeneratedStage = async (req, res) => {
    try {
        const clientJourneyList = await ClientJourney.findAll({ where: { productID: req.body.productID } });
        const cj = clientJourneyList[0];
        if (cj == null) {
            throw "Client Journey or Business not found!";
        }
        const stage = req.body.stage;
        const content = req.body.content;
        cj[stage] = JSON.stringify(content);
        await cj.save();
        return res.status(200).json({

        });
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            result: `Failed`
        });
    }
}

/*
Example JSON body:
 {
    clientJourneyID
    stage: "awareness" -- all lowercase,
    prompt: "user prompt" can be null
 }
*/
clientJourney.regenerateStage = async (req, res) => {
    try {
        const { clientJourneyID, prompt } = req.body;
        const clientJourneyList = await ClientJourney.findAll({ where: { id: clientJourneyID } });
        const cj = clientJourneyList[0];
        if (cj == null) {
            throw "Client Journey or Business not found!";
        }
        if (prompt == null) {
            const product = await Product.findOne({where: {id : cj.productID }})
            const business = await Business.findOne({ where: { id: product.businessID } });
            if (business == null || product == null) {
                return false;
            }
            const businessDetails = `
            BUSINESS INFORMATION
            Business Name : ${business.businessName},
            Business Type : ${business.businessType},
            Industry : ${business.industry}
            Company Size : ${business.companySize},
            Objective : ${business.businessObjective},
    
            PRODUCT/SERVICE DETAILS
            Core Services : ${product.coreServices},
            Target Market : ${product.targetMarket},
            Is this a product (1 represents yes, 0 represents no) : ${product.isProduct},
            Product/Service Description : ${product.productOrServiceDescription},
            Funding Strategy : ${product.fundingStrategy}
            `
    
            const stage = req.body.stage.toLowerCase();
            const output = await retryStage(stage, businessDetails);
            if (output == null) {
                throw "Failed to generate stage!";
            }
            return res.status(200).json({
                status: true,
                output
            });
        } else {
            const stage = req.body.stage.toLowerCase();
            const output = await regenerateStageWithContext(stage, cj[stage], prompt);
            if (output == null) {
                throw "Failed to generate stage!";
            }
            console.log(output);
            return res.status(200).json({
                status: true,
                output
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            status: false,
            result: `Failed`
        });
    }
}

const generateClientJourney = async (productID, title) => {
    try {
        const product = await Product.findOne({where: {id : productID }})
        const business = await Business.findOne({ where: { id: product.businessID } });
        if (business == null || product == null) {
            console.log("Entered");
            return null;
        }
        const businessDetails = `
        BUSINESS INFORMATION
        Business Name : ${business.businessName},
        Business Type : ${business.businessType},
        Industry : ${business.industry}
        Company Size : ${business.companySize},
        Objective : ${business.businessObjective},

        PRODUCT/SERVICE DETAILS
        Core Services : ${product.coreServices},
        Target Market : ${product.targetMarket},
        Is this a product (1 represents yes, 0 represents no) : ${product.isProduct},
        Product/Service Description : ${product.productOrServiceDescription},
        Funding Strategy : ${product.fundingStrategy}
        `

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
        const clientJ = await ClientJourney.create({
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
            productID: productID,
        });
        return clientJ;
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

    const model = new OpenAI({ temperature: 1, model: modelName });
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
            role: z.string().describe(`Identify responsible roles for the ${stageString} stage. Within each department, there are several roles. Roles are the specific job titles or positions that individuals hold within the department. For example, in the Marketing department, roles might include Marketing Manager, Content Strategist, SEO Specialist, etc. Number of roles proportional to business size`),
            steps: z
                .array(z.string())
                .describe("Steps to follow in this stage. Be ellaborate by providing a lot of detail."),
        })
    );

    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template:
        `Generate a client journey's ${stageString} stage
         Given these details for a business: {businessDetails}
         {format_instructions};`,
        inputVariables: ["businessDetails"],
        partialVariables: { format_instructions: formatInstructions },
    });

    const model = new OpenAI({ temperature: 1, model: modelName });
    const input = await prompt.format({
        businessDetails: businessDetailsString,
    });
    try{
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
    }catch(error){
        console.log(error);
        return null;
    }
}

async function regenerateStageWithContextSingle(stageString, previousStageContent, userPromptString) {
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            department: z.string().describe(`Identify responsible department for ${stageString} stage. These are the main sectors or divisions within the company. Each department represents a specific function of the business, such as Marketing, Sales, Human Resources, Operations, Finance, etc.`),
            role: z.string().describe(`Identify responsible roles for the ${stageString} stage. Within each department, there are several roles. Roles are the specific job titles or positions that individuals hold within the department. For example, in the Marketing department, roles might include Marketing Manager, Content Strategist, SEO Specialist, etc.`),
            steps: z
                .array(z.string())
                .describe("Steps to follow in this stage. Be ellaborate by providing a lot of detail."),
        })
    );
    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template:
        `You are tasked with regenerating a client journey's ${stageString} stage, improving the users existing client journey stage, according to their preferences.
         Old Client Journey Stage: {oldClientJourneyStage}
         User's Preference: {userPreference}
         {format_instructions};`,
        inputVariables: ["userPreference", "oldClientJourneyStage"],
        partialVariables: { format_instructions: formatInstructions },
    });

    const model = new OpenAI({ temperature: 1, model: modelName });
    const input = await prompt.format({
        userPreference: userPromptString,
        oldClientJourneyStage: JSON.stringify(previousStageContent),
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

async function regenerateStageWithContext(stageString, previousStageContent, userPromptString) {
    let output = null;
    let i = 0;
    while (i < 10) {
        output = await regenerateStageWithContextSingle(stageString, previousStageContent, userPromptString);
        if (output != null) {
            break;
        }
        i++;
    }
    return output;
}

async function regenerateStageWithContextSingle(stageString, previousStageContent, userPromptString) {
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            department: z.string().describe(`Identify responsible department for ${stageString} stage. These are the main sectors or divisions within the company. Each department represents a specific function of the business, such as Marketing, Sales, Human Resources, Operations, Finance, etc.`),
            role: z.string().describe(`Identify responsible roles for the ${stageString} stage. Within each department, there are several roles. Roles are the specific job titles or positions that individuals hold within the department. For example, in the Marketing department, roles might include Marketing Manager, Content Strategist, SEO Specialist, etc.`),
            steps: z
                .array(z.string())
                .describe("Steps to follow in this stage. Be ellaborate by providing a lot of detail."),
        })
    );
    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template:
        `You are tasked with regenerating a client journey's ${stageString} stage, improving the users existing client journey stage, according to their preferences.
         Old Client Journey Stage: {oldClientJourneyStage}
         User's Preference: {userPreference}
         {format_instructions};`,
        inputVariables: ["userPreference", "oldClientJourneyStage"],
        partialVariables: { format_instructions: formatInstructions },
    });

    const model = new OpenAI({ temperature: 1, model: modelName });
    const input = await prompt.format({
        userPreference: userPromptString,
        oldClientJourneyStage: JSON.stringify(previousStageContent),
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

async function regenerateStageWithContext(stageString, previousStageContent, userPromptString) {
    let output = null;
    let i = 0;
    while (i < 10) {
        output = await regenerateStageWithContextSingle(stageString, previousStageContent, userPromptString);
        if (output != null) {
            break;
        }
        i++;
    }
    return output;
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
router.post("/get", clientJourney.getClientJourneyByProductID);
router.post("/regenerate_stage", clientJourney.regenerateStage);
router.post("/save_regenerated_stage", clientJourney.saveRegeneratedStage);
router.post("/delete", clientJourney.deleteClientJourneyByBusinessID);

module.exports = router;