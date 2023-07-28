const express = require("express");
const router = express.Router();
const { z } = require("zod");
const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
const Product = require('../../models/product');
const Business = require('../../models/business');
const ClientJourney = require('../../models/client_journey');
const { saveParaphrasedStages } = require('../business/stageParaphraseController');
const {
    StructuredOutputParser,
    OutputFixingParser,
} = require("langchain/output_parsers");
const { addProduct } = require("../product/saveProductController");
const { getStages } = require("./getStageNamesController");
const { modelName } = require("../../configuration/AIConfig");
require('dotenv').config()

const clientJourney = {};

/*
    API METHODS
*/

clientJourney.saveClientJourney = async (req, res) => {
    try {
        const {title, productInput} = req.body;
        const product = await addProduct(productInput);
        const cj = await ClientJourney.findOne({ where: { productID: product.id } });
        if (cj == null) {
            const journey = await generateClientJourney(product.id, title);
            if (journey != null) {
                const stageNames = await saveParaphrasedStages(journey.id,modelName);
                journey.stages = stageNames;
                console.log(`[SUCCESS] SAVED CLIENT JOURNEY FOR PRODUCT ID: ${product.id}`);
                return res.status(200).json({
                    status: true,
                    product: product,
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
        console.log(`[FAIL] UNABLE TO SAVE CLIENT JOURNEY`);
        console.log(error);
        return res.status(403).json({
            status: false,
        });
    }
}

clientJourney.getClientJourneyByProductID = async (req, res) => {
    try {
        const {productID} = req.body;
        const clientJourney = await ClientJourney.findOne({ where: {productID} });
        const stageNames = await getStages(clientJourney.id);
        clientJourney.dataValues.stages = stageNames;
        console.log(`[SUCCESS] RETRIEVED CLIENT JOURNEY FOR PRODUCT ID: ${productID}`)
        return res.status(200).json({
            status: true,
            clientJourney: clientJourney
        });
    } catch (error) {
        console.log(`[FAIL] COULD NOT RETRIEVE CLIENT JOURNEY FOR PRODUCT ID: ${req.body.productID}`,error);
        return res.status(403).json({
            status: false,
        });
    }
}

clientJourney.deleteClientJourneyByProductID = async (req, res) => {
    try {
        const { productID } = req.body;
        const product = await Product.findOne({ where: { id: productID } });
        await product.destroy();
        console.log(`[SUCCESS] PRODUCT ID: ${product.id} DELETED!`);
        return res.status(200).json({
            status: true,
        });
    } catch (error) {
        console.log(`[FAIL] COULD NOT DELETE`,error);
        return res.status(404).json({
            status: false,
        });
    }
}

clientJourney.saveRegeneratedStage = async (req, res) => {
    try {
        const {journey} = req.body;
        const clientJourneyList = await ClientJourney.findAll({ where: { productID: journey.productID } });
        const cj = clientJourneyList[0];
        if (cj == null) {
            throw "CLIENT JOURNEY/BUSINESS NOT FOUND";
        }
        await ClientJourney.update({
            overview: journey.overview,
            awareness: journey.awareness,
            interest: journey.interest,
            evaluation: journey.evaluation,
            decision: journey.decision,
            purchase: journey.purchase,
            implementation: journey.implementation,
            postPurchase: journey.postPurchase,
            retention: journey.retention
        }, { where: { id: journey.id} });
        console.log(`[SUCCESS] UPDATED CLIENT JOURNEY ID: ${journey.id}`)
        return res.status(200).json({
            status: true
        });
    } catch (error) {
        console.log(`[FAIL] COULD NOT DELETE CLIENT JOURNEY`,error);
        return res.status(403).json({
            status: false,
        });
    }
}

clientJourney.regenerateClientJourney = async(req, res) => {
    try {
        const {clientJourneyID, prompt } = req.body;
        const cj = await ClientJourney.findOne({
            where: {
                id: clientJourneyID
            }
        });
        const product = await Product.findOne({where: {id : cj.productID }})
        const business = await Business.findOne({ where: { id: product.businessID } });
        if (business == null || product == null) {
            throw `[FAIL] UNABLE TO REGENERATE CLIENT JOURNEY ID AS BUSINESS/PRODUCT DOES NOT EXIST: ${journey.id}`;
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

        ${() => {
            if(prompt != null){
                return "User's preference: "+String(prompt);
            }
        }}
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
        // const regenJourney = await cj.update({
        //     overview: JSON.stringify(Overview),
        //     awareness: JSON.stringify(stages[0]),
        //     interest: JSON.stringify(stages[1]),
        //     evaluation: JSON.stringify(stages[2]),
        //     decision: JSON.stringify(stages[3]),
        //     purchase: JSON.stringify(stages[4]),
        //     implementation: JSON.stringify(stages[5]),
        //     postPurchase: JSON.stringify(stages[6]),
        //     retention: JSON.stringify(stages[7]),
        // })
        console.log(`[SUCCESS] REGENERATED CLIENT JOUNREY ID: ${clientJourneyID}`);
        return res.status(200).json({
            status: true,
            clientJourney: {
                overview: JSON.stringify(Overview),
                awareness: JSON.stringify(stages[0]),
                interest: JSON.stringify(stages[1]),
                evaluation: JSON.stringify(stages[2]),
                decision: JSON.stringify(stages[3]),
                purchase: JSON.stringify(stages[4]),
                implementation: JSON.stringify(stages[5]),
                postPurchase: JSON.stringify(stages[6]),
                retention: JSON.stringify(stages[7]),
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
        });
    }

}

clientJourney.regenerateStage = async (req, res) => {
    try {
        const { cj, prompt } = req.body;
        const clientJourneyID = cj.id;
        // const clientJourneyList = await ClientJourney.findAll({ where: { id: clientJourneyID } });
        // const cj = clientJourneyList[0];
        if (cj == null) {
            throw "CLIENT JOURNEY OR BUSINESS NOT FOUND";
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
                throw "[FAIL] UNABLE TO REGENERATE";
            }
            console.log(`[SUCCESS] REGENERATED (AUTOMATIC) STAGE: ${stage} FOR CLIENT JOURNEY ID: ${clientJourneyID}`);
            return res.status(200).json({
                status: true,
                output
            });
        } else {
            const stage = req.body.stage.toLowerCase();
            const output = await regenerateStageWithContext(stage, cj[stage], prompt);
            if (output == null) {
                throw "[FAIL] UNABLE TO REGENERATE";
            }
            console.log(`[SUCCESS] REGENERATE STAGE: ${stage} FOR CLIENT JOURNEY ID: ${clientJourneyID}`);
            return res.status(200).json({
                status: true,
                output
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            status: false,
            message: error
        });
    }
}

/*
    Controller Functions
*/

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

    const model = new OpenAI({ temperature: 1, modelName: modelName });
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
                new OpenAI({ temperature: 0, modelName: modelName }),
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
                .describe("Steps to follow in this stage. Be ellaborate by providing a lot of detail. Add stastical/numerical predictions as well"),
        })
    );

    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template:
        `You are a business executive based in Australia. Your task is to generate a client journey's ${stageString} stage.
         Given these details for a business: {businessDetails}
         {format_instructions};`,
        inputVariables: ["businessDetails"],
        partialVariables: { format_instructions: formatInstructions },
    });

    const model = new OpenAI({ temperature: 1, modelName: modelName });
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
                    new OpenAI({ temperature: 0, modelName: modelName }),
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

    const model = new OpenAI({ temperature: 1, modelName: modelName });
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
                new OpenAI({ temperature: 0, modelName: modelName }),
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

    const model = new OpenAI({ temperature: 1, modelName: modelName });
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
                new OpenAI({ temperature: 0, modelName: modelName }),
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

/*
   EXPRESS ROUTES
*/
router.post("/save", clientJourney.saveClientJourney);
router.post("/get", clientJourney.getClientJourneyByProductID);
router.post("/regenerate_stage", clientJourney.regenerateStage);
router.post("/save_regenerated_stage", clientJourney.saveRegeneratedStage);
router.post("/delete", clientJourney.deleteClientJourneyByProductID);
router.post("/regenerate_client_journey", clientJourney.regenerateClientJourney)

module.exports = router;