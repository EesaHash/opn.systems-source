const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const router = express.Router();
const Business = require('../../models/business');
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function runCompletion(prompts) {    
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: prompts,
        max_tokens: 2500,
    });
    return completion;
}




async function generateClientJourney(id) {
    const messages = [];
    try {
        const business = await Business.findOne({ where: { id: id } });
        if (!business) {
            throw new Error("Could not find business");
        }

        messages.push(
            {
                role: "system",
                content: "As a language learning model, your task is to aid businesses in creating a comprehensive and efficient structure for their operations. Your objective is to assist in outlining their client journey, identifying key departments and roles, developing standard operating procedures, and establishing policies. Please abide by the following:\n\nClient Journey: generate a users typical customer interaction process from start to finish from the details they input about their business.\n\nConsider the following stages in the client journey:\n\n1. Awareness Stage: This is the stage where the customer first becomes aware of the business or product. This can occur through marketing efforts, word of mouth, or other means. It's important to identify what channels are most effective in reaching your target audience.\n2. Consideration Stage: Here, the customer is aware of the business and is considering whether to engage with the business or purchase a product. They might compare your offerings with competitors, read reviews, or look for more information about your business.\n3. Decision/Purchase Stage: At this point, the customer has decided to make a purchase or engage with your services. This stage involves the actual transaction.\n4. Post-Purchase/Service Stage: After the purchase or service has been provided, the customer's journey isn't over. This stage involves any follow-up communication, feedback solicitation, and nurturing activities to transform customers into repeat customers or brand advocates.\n5. Retention/Loyalty Stage: In this stage, the focus is on keeping the customer engaged with the business, offering them new products or services, and maintaining their loyalty.\n\nAnd also consider the following if necessary but not limited to within the client journey:\n\n1. Awareness: This is when the potential client first becomes aware of your business or services. This could be via marketing, social media, a web search, or word-of-mouth recommendations.\n2. Interest: The potential client has some interest in what you offer and starts seeking out more information. They might visit your website, read blog posts or reviews, or follow you on social media to learn more about your offerings.\n3. Evaluation: The potential client begins to evaluate whether your product or service will meet their needs. They compare your offerings to those of other businesses and consider the benefits and drawbacks of each.\n4. Decision: The client decides to proceed with the purchase or hire your services. They may reach out to the sales or customer service team for any final queries before moving forward.\n5. Purchase: The client completes the transaction and officially becomes a customer.\n6. Implementation/Usage: The customer begins using the product or service. In the case of a service-based business, this could be the delivery of the service. For a product-based business, it might be the customer starting to use the purchased product.\n7. Post-Purchase Support: After the purchase or delivery of services, the customer might need support or have questions. This phase includes customer service, technical support, and follow-up communication.\n8. Retention/Loyalty: This is the stage of keeping the customer engaged for repeat business or referrals. This might involve marketing communication, offering new products or services, or customer loyalty programs.\n\nWhen developing the Client Journey, please utilise the following in the format 1. Step, 2. Stage, 3. Identify responsible department and role & 4. Steps to follow in each stage. Suggest how they can attract customers, how they can convert them into clients, and how they can manage customer relationships post-sale. Generate a detailed, step-by-step map of this client journey."
            },
            {
                role: "user",
                content: "Here are some details for the business\n Business Name:" +business.businessName +"\n Business Type:" +business.businessType +"\n Industry:" +business.industry +"\n Company Size:" +business.companySize +"\n Business Objective:" +business.businessObjective +"\n Core Services:" +business.coreServices +"\n Target Market:" +business.targetMarket +"\n Product or Service Description:" +business.productOrServiceDescription +"\n Is Manufacture:" +business.isManufacture +"\n Funding Strategy:" +business.fundingStrategy+". Please generate the client journey, make it EXTREMELY detailed and catered to the business details provided."
            },
        );

        const response = await runCompletion(messages);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.log("Could not generate client journey:");
        console.error(error);
        throw error;
    }
}

async function generateSOP(id) { 
    const messages = [];
    try {
        const clientJourney = await generateClientJourney(id);
        messages.push(
            {
                role: "system", content: "Standard Operating Procedures (SOPs): For each identified department and role, and steps in stages within the client journey create and generate SOPs. Ask about the repetitive tasks they perform and the desired outcomes. Use this information to create clear, detailed procedures for each task. Here's a general format for creating an SOP: 1. Title: The title should clearly and concisely describe the procedure. 2. Purpose/Scope: This section explains why the SOP is necessary and under what circumstances it should be followed. It could include the potential benefits and the objectives the SOP is designed to achieve. 3. Definitions: This section includes any specific terms, abbreviations, or acronyms used within the SOP. 4. Responsibility: Detail who is responsible for executing the SOP, including any secondary roles that may be involved in supporting or overseeing the process. 5. Procedure: This is the core of the SOP. It provides a step-by-step guide on how to complete the procedure. It should be detailed and specific enough that someone unfamiliar with the process could complete it by following the instructions. It's often beneficial to break down complex procedures into smaller, manageable steps. 6. Documentation/Records: This section specifies any necessary documentation related to the procedure, such as forms to be filled out, records to be kept, or reports to be submitted. Policies: Based on the client's industry, regulatory requirements, and internal preferences, generate necessary business policies. Make sure these policies align with the SOPs, client journey, and overall business strategy. Always maintain a professional and collaborative approach. Respect the business's expertise in their industry and make sure to clarify any uncertainties before generating outputs. Aim to streamline and improve their operations, empowering them to scale efficiently and effectively."
            },
            {
                role: "user",
                content: "Here's the client journey\n\n"+clientJourney
            },
            {
                role: "assistant",
                content: "Please generate SOPs, strictly stick to the headings provided and include relevant use of machinery/equipment or ellaborate on the various methodologies"
            }
        );
        const response = await runCompletion(messages);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.log("Could not generate SOP:");
        console.error(error);
        throw error;
    }
}


router.post("/getCJ", async (req, res) => {
    try {
        const { id } = req.body;
        const result = await generateClientJourney(id);
        //console.log(result+"\n\n=================\n\n");
        //const sopResult = await generateSOP(id);
        console.log(result);
        return res.status(200).json(result);
    } catch (error) {
        console.log("Error in /getCJ route:");
        console.error(error);
        return res.status(403).json({
            result: "None"
        });
    }
});

module.exports = router;
