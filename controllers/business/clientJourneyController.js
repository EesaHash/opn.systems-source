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

/**
 * Save the client journey for a product.
 *
 * @param {Object} req - The request object containing the product title and input data.
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - The response object with the status and details of the saved client journey.
 */
clientJourney.saveClientJourney = async (req, res) => {
    try {
        // Extract title and product input data from the request body
        const { title, productInput } = req.body;

        // Add the product to the database and retrieve its details
        const product = await addProduct(productInput);

        // Check if a client journey already exists for the product
        const cj = await ClientJourney.findOne({ where: { productID: product.id } });
        if (cj == null) {
            // If a client journey doesn't exist, generate a new client journey for the product
            const journey = await generateClientJourney(product.id, title);
            if (journey != null) {
                // Save paraphrased stage names for the generated client journey
                const stageNames = await saveParaphrasedStages(journey.id, modelName);
                journey.stages = stageNames;
                console.log(`[SUCCESS] SAVED CLIENT JOURNEY FOR PRODUCT ID: ${product.id}`);

                // Return the response with the product, generated client journey, and stage names
                return res.status(200).json({
                    status: true,
                    product: product,
                    journey: journey,
                    headings: stageNames
                });
            }
            // If the generation of the client journey fails, throw an error
            throw new Error("Unable to create Client Journey");
        } else {
            // If a client journey already exists, return an error response
            return res.status(403).json({
                status: false,
                message: "Client Journey already exists!",
            });
        }
    } catch (error) {
        // Handle any errors that occur during the process and return an error response
        console.log(`[FAIL] UNABLE TO SAVE CLIENT JOURNEY`);
        console.log(error);
        return res.status(403).json({
            status: false,
        });
    }
}


/**
 * Get a client journey by its associated product ID.
 *
 * @route POST /client_journey/get
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response object with client journey data.
 */
clientJourney.getClientJourneyByProductID = async (req, res) => {
    try {
        // Extract productID from the request body
        const { productID } = req.body;

        // Find the client journey in the database based on the productID
        const clientJourney = await ClientJourney.findOne({ where: { productID } });
        if(!clientJourney)
            throw (`Client journey not found for product ID: ${productID}`);
        // Get the stage names for the retrieved client journey
        const stageNames = await getStages(clientJourney.id);

        // Add the stage names to the client journey data values
        clientJourney.dataValues.stages = stageNames;

        // Log the successful retrieval of the client journey and return it in the response
        console.log(`[SUCCESS] RETRIEVED CLIENT JOURNEY FOR PRODUCT ID: ${productID}`);
        return res.status(200).json({
            status: true,
            clientJourney: clientJourney
        });
    } catch (error) {
        // Handle any errors that occur during the process and return an error response
        console.log(`[FAIL] COULD NOT RETRIEVE CLIENT JOURNEY FOR PRODUCT ID: ${req.body.productID}`, error);
        return res.status(403).json({
            status: false,
        });
    }
}


/**
 * Delete a client journey by product ID.
 *
 * @route POST /client_journey/delete
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response object indicating the success of the deletion.
 */
clientJourney.deleteClientJourneyByProductID = async (req, res) => {
    try {
        // Extract the productID from the request body
        const { productID } = req.body;

        // Find the product with the specified productID
        const product = await Product.findOne({ where: { id: productID } });

        // If the product is found, delete it from the database
        if (product) {
            await product.destroy();
            console.log(`[SUCCESS] PRODUCT ID: ${product.id} DELETED!`);

            // Return a success response indicating successful deletion
            return res.status(200).json({
                status: true,
            });
        } else {
            // Return an error response if the product is not found
            return res.status(404).json({
                status: false,
                message: "Product not found!",
            });
        }
    } catch (error) {
        // Handle any errors that occur during the process and return an error response
        console.log(`[FAIL] COULD NOT DELETE`, error);
        return res.status(500).json({
            status: false,
            message: "An error occurred while deleting the product.",
        });
    }
}

/**
 * Save the regenerated stages of a client journey.
 *
 * @route POST /client_journey/save_regenerated_stage
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response object indicating the success of the update.
 */
clientJourney.saveRegeneratedStage = async (req, res) => {
    try {
        // Extract the journey object from the request body
        const { journey } = req.body;

        // Find the client journey with the specified productID
        const clientJourneyList = await ClientJourney.findAll({ where: { productID: journey.productID } });
        const cj = clientJourneyList[0];

        // If the client journey is not found, throw an error
        if (cj == null) {
            throw "CLIENT JOURNEY/BUSINESS NOT FOUND";
        }

        // Update the client journey with the regenerated stages
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
        }, { where: { id: journey.id } });

        console.log(`[SUCCESS] UPDATED CLIENT JOURNEY ID: ${journey.id}`);

        // Return a success response indicating successful update
        return res.status(200).json({
            status: true
        });
    } catch (error) {
        // Handle any errors that occur during the process and return an error response
        console.log(`[FAIL] COULD NOT UPDATE CLIENT JOURNEY`, error);
        return res.status(403).json({
            status: false,
            message: "An error occurred while updating the client journey.",
        });
    }
}

/**
 * Regenerate the stages of a client journey based on the given business and product information.
 *
 * @route POST /client_journey/regenerate_client_journey
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response object containing the regenerated client journey stages.
 */
clientJourney.regenerateClientJourney = async (req, res) => {
    try {
        // Extract clientJourneyID and prompt from the request body
        const { clientJourneyID, prompt } = req.body;

        // Find the client journey with the specified clientJourneyID
        const cj = await ClientJourney.findOne({ where: { id: clientJourneyID } });

        // Find the associated product using productID from the client journey
        const product = await Product.findOne({ where: { id: cj.productID } });

        // Find the associated business using businessID from the product
        const business = await Business.findOne({ where: { id: product.businessID } });

        // Check if the business or product exists, if not, throw an error
        if (business == null || product == null) {
            throw `[FAIL] UNABLE TO REGENERATE CLIENT JOURNEY ID AS BUSINESS/PRODUCT DOES NOT EXIST: ${clientJourneyID}`;
        }

        // Create a formatted string with business and product details
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
                if (prompt != null) {
                    return "User's preference: " + String(prompt);
                }
            }}
        `;

        // Generate stages for the client journey using the businessDetails
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
            // Retry generating the stage if it is null
            if (stages[i] == null) {
                stages[i] = await retryStage(stringStages[i], businessDetails);
            }
            i++;
        }

        console.log(`[SUCCESS] REGENERATED CLIENT JOURNEY ID: ${clientJourneyID}`);

        // Return the regenerated client journey stages as a JSON response
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
        // Handle any errors that occur during the process and return an error response
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "An error occurred while regenerating the client journey.",
        });
    }
}

/**
 * Regenerate a specific stage of a client journey based on the given context.
 * If prompt is provided, regenerate the stage with the context, otherwise automatically generate the stage.
 *
 * @route POST /client_journey/regenerate_stage
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response object containing the regenerated stage output.
 */
clientJourney.regenerateStage = async (req, res) => {
    try {
        const { cj, prompt } = req.body;
        const clientJourneyID = cj.id;

        // Check if the client journey exists, if not, throw an error
        if (cj == null) {
            throw "CLIENT JOURNEY OR BUSINESS NOT FOUND";
        }

        if (prompt == null) {
            // If no prompt provided, automatically regenerate the stage using business and product details
            const product = await Product.findOne({ where: { id: cj.productID } });
            const business = await Business.findOne({ where: { id: product.businessID } });

            // Check if the business or product exists, if not, return false
            if (business == null || product == null) {
                return false;
            }

            // Create a formatted string with business and product details
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
            `;

            const stage = req.body.stage.toLowerCase();

            // Retry generating the stage using the stage name and business details
            const output = await retryStage(stage, businessDetails);

            // If the output is null, throw an error
            if (output == null) {
                throw "[FAIL] UNABLE TO REGENERATE";
            }

            console.log(`[SUCCESS] REGENERATED (AUTOMATIC) STAGE: ${stage} FOR CLIENT JOURNEY ID: ${clientJourneyID}`);

            // Return the regenerated stage output as a JSON response
            return res.status(200).json({
                status: true,
                output
            });
        } else {
            // If prompt is provided, regenerate the stage using the context (prompt)
            const stage = req.body.stage.toLowerCase();

            // Regenerate the stage with the context (prompt)
            const output = await regenerateStageWithContext(stage, cj[stage], prompt);

            // If the output is null, throw an error
            if (output == null) {
                throw "[FAIL] UNABLE TO REGENERATE";
            }

            console.log(`[SUCCESS] REGENERATE STAGE: ${stage} FOR CLIENT JOURNEY ID: ${clientJourneyID}`);

            // Return the regenerated stage output as a JSON response
            return res.status(200).json({
                status: true,
                output
            });
        }
    } catch (error) {
        // Handle any errors that occur during the process and return an error response
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

/**
 * Generate a client journey for a given product ID and title.
 *
 * @param {number} productID - The ID of the product for which the client journey is generated.
 * @param {string} title - The title of the client journey.
 * @returns {Object|null} - The generated client journey object if successful, or null if an error occurs.
 */
const generateClientJourney = async (productID, title) => {
    try {
        // Find the product and business associated with the given productID
        const product = await Product.findOne({ where: { id: productID } });
        const business = await Business.findOne({ where: { id: product.businessID } });

        // Check if the business or product exists, if not, return null
        if (business == null || product == null) {
            console.log("Entered");
            return null;
        }

        // Create a formatted string with business and product details
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
        `;

        // Generate the overview and stages for the client journey based on the business details
        let Overview = await generateOverview(businessDetails);
        let Awareness = await generateStage("awareness", businessDetails);
        let Interest = await generateStage("interest", businessDetails);
        let Evaluation = await generateStage("evaluation", businessDetails);
        let Decision = await generateStage("decision", businessDetails);
        let Purchase = await generateStage("purchase", businessDetails);
        let Implementation = await generateStage("implementation", businessDetails);
        let PostPurchase = await generateStage("post-purchase", businessDetails);
        let Retention = await generateStage("retention", businessDetails);

        // Create arrays for the stages and their corresponding names
        const stages = [Awareness, Interest, Evaluation, Decision, Purchase, Implementation, PostPurchase, Retention];
        const stringStages = ["awareness", "interest", "evaluation", "decision", "purchase", "implementation", "postPurchase", "retention"];

        // Retry generating any null stages in case of failure
        let i = 0;
        while (i < stages.length) {
            if (stages[i] == null) {
                stages[i] = await retryStage(stringStages[i], businessDetails);
            }
            i++;
        }

        // Create the client journey in the database
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

        // Return the generated client journey object
        return clientJ;
    } catch (error) {
        // Handle any errors that occur during the process and return null
        console.log("Error saving client journey: ", error);
        return null;
    }
}

/**
 * Generate an overview for a client journey based on the provided business details.
 *
 * @param {string} businessDetailsString - The formatted string containing business details.
 * @returns {Object|null} - The generated overview object if successful, or null if an error occurs.
 */
async function generateOverview(businessDetailsString) {
    // Define a structured output parser to extract the overview from the model response
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            overview: z.string().describe("Overview: A summary for the client journey"),
        }),
    );

    // Get format instructions for the parser to extract the output from the model response
    const formatInstructions = parser.getFormatInstructions();

    // Create a prompt template with input variables (businessDetails) and partial variables (formatInstructions)
    const prompt = new PromptTemplate({
        template:
            `Generate a brief description for a client journey
           Use these business details: {businessDetails}
           {format_instructions}`,
        inputVariables: ["businessDetails"],
        partialVariables: { format_instructions: formatInstructions },
    });

    // Create an instance of the OpenAI language model
    const model = new OpenAI({ temperature: 1, modelName: modelName });

    // Format the input using the prompt and provided business details
    const input = await prompt.format({
        businessDetails: businessDetailsString,
    });

    // Make an API call to the language model with the formatted input
    const response = await model.call(input);
    try {
        // Try to parse the model response using the structured output parser
        parsedResponse = await parser.parse(response);
        return parsedResponse;
    } catch (e) {
        try {
            // If parsing fails, attempt to fix the output using an output fixing parser
            const fixParser = OutputFixingParser.fromLLM(
                new OpenAI({ temperature: 0, modelName: modelName }),
                parser
            );
            const output = await fixParser.parse(response);
            return output;
        }
        catch (e) {
            // Return null if both parsing and output fixing fail
            return null;
        }
    }
}

/**
 * Generate a specific stage of the client journey based on the provided business details.
 *
 * @param {string} stageString - The name of the client journey stage to be generated.
 * @param {string} businessDetailsString - The formatted string containing business details.
 * @returns {Object|null} - The generated stage object if successful, or null if an error occurs.
 */
async function generateStage(stageString, businessDetailsString) {
    // Define stage definitions to provide context and instructions for the generated stage
    const definitions = {
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

    // Define a structured output parser to extract the stage details from the model response
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            department: z.string().describe(`Identify responsible department for ${stageString} stage. These are the main sectors or divisions within the company. Each department represents a specific function of the business, such as Marketing, Sales, Human Resources, Operations, Finance, etc.`),
            role: z.string().describe(`Identify responsible roles for the ${stageString} stage. Within each department, there are several roles. Roles are the specific job titles or positions that individuals hold within the department. For example, in the Marketing department, roles might include Marketing Manager, Content Strategist, SEO Specialist, etc. Number of roles proportional to business size`),
            steps: z
                .array(z.string())
                .describe("Steps to follow in this stage. Be elaborate by providing a lot of detail. Add statistical/numerical predictions as well"),
        })
    );

    // Get format instructions for the parser to extract the output from the model response
    const formatInstructions = parser.getFormatInstructions();

    // Create a prompt template with input variables (businessDetails) and partial variables (formatInstructions)
    const prompt = new PromptTemplate({
        template:
            `You are a business executive based in Australia. Your task is to generate a client journey's ${stageString} stage.
         Given these details for a business: {businessDetails}
         {format_instructions};`,
        inputVariables: ["businessDetails"],
        partialVariables: { format_instructions: formatInstructions },
    });

    // Create an instance of the OpenAI language model
    const model = new OpenAI({ temperature: 1, modelName: modelName });

    // Format the input using the prompt and provided business details
    const input = await prompt.format({
        businessDetails: businessDetailsString,
    });

    try {
        // Make an API call to the language model with the formatted input
        const response = await model.call(input);
        try {
            // Try to parse the model response using the structured output parser
            parsedResponse = await parser.parse(response);
            return parsedResponse;
        } catch (e) {
            try {
                // If parsing fails, attempt to fix the output using an output fixing parser
                const fixParser = OutputFixingParser.fromLLM(
                    new OpenAI({ temperature: 0, modelName: modelName }),
                    parser
                );
                const output = await fixParser.parse(response);
                return output;
            }
            catch (e) {
                // Return null if both parsing and output fixing fail
                return null;
            }
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}


/**
 * Regenerate a specific stage of the client journey based on the user's preferences and the previous stage content.
 * The function improves the existing client journey stage according to the user's preferences.
 *
 * @param {string} stageString - The name of the client journey stage to be regenerated.
 * @param {Object} previousStageContent - The content of the previous stage in the client journey (JSON object).
 * @param {string} userPromptString - The user's preference in the form of a prompt string.
 * @returns {Object|null} - The regenerated stage object if successful, or null if an error occurs.
 */
async function regenerateStageWithContextSingle(stageString, previousStageContent, userPromptString) {
    // Define a structured output parser to extract the stage details from the model response
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            department: z.string().describe(`Identify responsible department for ${stageString} stage. These are the main sectors or divisions within the company. Each department represents a specific function of the business, such as Marketing, Sales, Human Resources, Operations, Finance, etc.`),
            role: z.string().describe(`Identify responsible roles for the ${stageString} stage. Within each department, there are several roles. Roles are the specific job titles or positions that individuals hold within the department. For example, in the Marketing department, roles might include Marketing Manager, Content Strategist, SEO Specialist, etc.`),
            steps: z
                .array(z.string())
                .describe("Steps to follow in this stage. Be elaborate by providing a lot of detail."),
        })
    );

    // Get format instructions for the parser to extract the output from the model response
    const formatInstructions = parser.getFormatInstructions();

    // Create a prompt template with input variables (userPreference, oldClientJourneyStage) and partial variables (formatInstructions)
    const prompt = new PromptTemplate({
        template:
            `You are tasked with regenerating a client journey's ${stageString} stage, improving the users existing client journey stage, according to their preferences.
         Old Client Journey Stage: {oldClientJourneyStage}
         User's Preference: {userPreference}
         {format_instructions};`,
        inputVariables: ["userPreference", "oldClientJourneyStage"],
        partialVariables: { format_instructions: formatInstructions },
    });

    // Create an instance of the OpenAI language model
    const model = new OpenAI({ temperature: 1, modelName: modelName });

    // Format the input using the prompt, user's preference, and previous stage content
    const input = await prompt.format({
        userPreference: userPromptString,
        oldClientJourneyStage: JSON.stringify(previousStageContent),
    });

    try {
        // Make an API call to the language model with the formatted input
        const response = await model.call(input);
        try {
            // Try to parse the model response using the structured output parser
            parsedResponse = await parser.parse(response);
            return parsedResponse;
        } catch (e) {
            try {
                // If parsing fails, attempt to fix the output using an output fixing parser
                const fixParser = OutputFixingParser.fromLLM(
                    new OpenAI({ temperature: 0, modelName: modelName }),
                    parser
                );
                const output = await fixParser.parse(response);
                return output;
            }
            catch (e) {
                // Return null if both parsing and output fixing fail
                return null;
            }
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}


/**
 * Regenerate a specific stage of the client journey with context, by making multiple attempts to generate the stage.
 * The function calls the `regenerateStageWithContextSingle` function in a loop to retry the generation up to 10 times.
 *
 * @param {string} stageString - The name of the client journey stage to be regenerated.
 * @param {Object} previousStageContent - The content of the previous stage in the client journey (JSON object).
 * @param {string} userPromptString - The user's preference in the form of a prompt string.
 * @returns {Object|null} - The regenerated stage object if successful, or null if all attempts fail.
 */
async function regenerateStageWithContext(stageString, previousStageContent, userPromptString) {
    let output = null;
    let i = 0;

    // Retry generating the stage up to 10 times
    while (i < 10) {
        // Call the `regenerateStageWithContextSingle` function to regenerate the stage with context
        output = await regenerateStageWithContextSingle(stageString, previousStageContent, userPromptString);

        // Check if the output is not null, indicating a successful generation
        if (output != null) {
            break;
        }

        i++;
    }

    // Return the generated output if successful, otherwise return null
    return output;
}


/**
 * Regenerate a specific stage of the client journey with context and user preference.
 *
 * @param {string} stageString - The name of the client journey stage to be regenerated.
 * @param {Object} previousStageContent - The content of the previous stage in the client journey (JSON object).
 * @param {string} userPromptString - The user's preference in the form of a prompt string.
 * @returns {Object|null} - The regenerated stage object if successful, or null if generation fails.
 */
async function regenerateStageWithContextSingle(stageString, previousStageContent, userPromptString) {
    // Define a Zod schema to parse the output and structure it into a specific format
    const parser = StructuredOutputParser.fromZodSchema(
        z.object({
            department: z.string().describe(`Identify responsible department for ${stageString} stage. These are the main sectors or divisions within the company. Each department represents a specific function of the business, such as Marketing, Sales, Human Resources, Operations, Finance, etc.`),
            role: z.string().describe(`Identify responsible roles for the ${stageString} stage. Within each department, there are several roles. Roles are the specific job titles or positions that individuals hold within the department. For example, in the Marketing department, roles might include Marketing Manager, Content Strategist, SEO Specialist, etc.`),
            steps: z
                .array(z.string())
                .describe("Steps to follow in this stage. Be elaborate by providing a lot of detail."),
        })
    );

    // Get format instructions for the parser
    const formatInstructions = parser.getFormatInstructions();

    // Create a prompt template for the model to generate the stage with context
    const prompt = new PromptTemplate({
        template:
            `You are tasked with regenerating a client journey's ${stageString} stage, improving the users existing client journey stage, according to their preferences.
         Old Client Journey Stage: {oldClientJourneyStage}
         User's Preference: {userPreference}
         {format_instructions};`,
        inputVariables: ["userPreference", "oldClientJourneyStage"],
        partialVariables: { format_instructions: formatInstructions },
    });

    // Create an instance of the OpenAI model and prepare the input for the prompt
    const model = new OpenAI({ temperature: 1, modelName: modelName });
    const input = await prompt.format({
        userPreference: userPromptString,
        oldClientJourneyStage: JSON.stringify(previousStageContent),
    });

    // Call the model to generate the response
    const response = await model.call(input);

    try {
        // Parse the response using the defined parser schema
        parsedResponse = await parser.parse(response);
        return parsedResponse;
    } catch (e) {
        try {
            // If parsing fails, try fixing the output using the OutputFixingParser
            const fixParser = OutputFixingParser.fromLLM(
                new OpenAI({ temperature: 0, modelName: modelName }),
                parser
            );
            const output = await fixParser.parse(response);
            return output;
        } catch (e) {
            // If both parsing and fixing fail, return null indicating generation failure
            return null;
        }
    }
}


/**
 * Regenerate a specific stage of the client journey with context and user preference.
 * Retry up to 10 times if generation fails.
 *
 * @param {string} stageString - The name of the client journey stage to be regenerated.
 * @param {Object} previousStageContent - The content of the previous stage in the client journey (JSON object).
 * @param {string} userPromptString - The user's preference in the form of a prompt string.
 * @returns {Object|null} - The regenerated stage object if successful, or null if generation fails after 10 retries.
 */
async function regenerateStageWithContext(stageString, previousStageContent, userPromptString) {
    let output = null;
    let i = 0;
    while (i < 10) {
        // Retry generating the stage with context using the regenerateStageWithContextSingle function
        output = await regenerateStageWithContextSingle(stageString, previousStageContent, userPromptString);
        if (output != null) {
            // If generation is successful, break out of the loop and return the output
            break;
        }
        i++;
    }
    // Return the regenerated stage object if successful, or null if generation fails after 10 retries
    return output;
}


/**
 * Retry generating a specific stage of the client journey up to 10 times if the initial generation fails.
 *
 * @param {string} stageString - The name of the client journey stage to be generated.
 * @param {string} businessDetailsString - Details of the business as a formatted string.
 * @returns {Object|null} - The generated stage object if successful, or null if generation fails after 10 retries.
 */
async function retryStage(stageString, businessDetailsString) {
    let output = null;
    let i = 0;
    while (i < 10) {
        // Retry generating the stage using the generateStage function
        output = await generateStage(stageString, businessDetailsString);
        if (output != null) {
            // If generation is successful, break out of the loop and return the output
            break;
        }
        i++;
    }
    // Return the generated stage object if successful, or null if generation fails after 10 retries
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