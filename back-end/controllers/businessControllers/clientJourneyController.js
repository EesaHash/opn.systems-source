const express = require("express");
const ClientJourney = require('../../models/client_journey');
const { runCompletion } = require('../gptController/gptController');
const Business = require('../../models/business');
const router = express.Router();


const clientJourney = {};

const json_messages = [
    {
        role: "system",
        content: "You are tasked with generating a JSON output based on the following set of keys: Overview, Awareness, Interest, Evaluation, Decision, Purchase, ImplementationUsage, PostPurchaseSupport, RetentionLoyalty, Conclusion. Your output must strictly be a JSON object, with no additions or explanations"
    }
];


clientJourney.saveClientJourney = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await generateClientJourney(id);
        const jsonResult = await clientJourneyToJSON(result);
        const clientJourney = await ClientJourney.create({
            data: jsonResult,
            businessId: id,
        });
        return res.status(200).json({Status: "Success"});
    } catch (error) {
        console.error(error);
        return res.status(403).json({
            result: "None"
        });
    }
}


clientJourney.printClientJourney = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await generateClientJourney(id);
        const result2 = await clientJourneyToJSON(result);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(403).json({
            result: "None"
        });
    }
}



async function clientJourneyToJSON(clientJourneyString) {
    try {
        json_messages[1] = ({role: "user", content: clientJourneyString})
        response = await runCompletion(json_messages);
        x = response.data.choices[0].message.content;
        return x;
    }
    catch(error) {
        console.log("Error parsing JSON:", error);
    }
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
                content: "As a language learning model, your task is to aid businesses in creating a comprehensive and efficient structure for their operations. Your objective is to assist in outlining their client journey, identifying key departments and roles, developing standard operating procedures, and establishing policies. Please abide by the following:\n\nClient Journey: generate a users typical customer interaction process from start to finish from the details they input about their business.\n\nConsider the following stages in the client journey:\n1. Overview: Just a summary or breif description\n2. Awareness: This is when the potential client first becomes aware of your business or services. This could be via marketing, social media, a web search, or word-of-mouth recommendations.\n3. Interest: The potential client has some interest in what you offer and starts seeking out more information. They might visit your website, read blog posts or reviews, or follow you on social media to learn more about your offerings.\n4. Evaluation: The potential client begins to evaluate whether your product or service will meet their needs. They compare your offerings to those of other businesses and consider the benefits and drawbacks of each.\n5. Decision: The client decides to proceed with the purchase or hire your services. They may reach out to the sales or customer service team for any final queries before moving forward.\n6. Purchase: The client completes the transaction and officially becomes a customer.\n7. Implementation/Usage: The customer begins using the product or service. In the case of a service-based business, this could be the delivery of the service. For a product-based business, it might be the customer starting to use the purchased product.\n8. Post-Purchase Support: After the purchase or delivery of services, the customer might need support or have questions. This phase includes customer service, technical support, and follow-up communication.\n9. Retention/Loyalty: This is the stage of keeping the customer engaged for repeat business or referrals. This might involve marketing communication, offering new products or services, or customer loyalty programs. \n10. Summary: concluding paragraph.\n\nWhen developing the Client Journey, please utilise the following in the format:\n1. Step\n2. Stage\n3. Identify responsible department\n4. Role\n5. Steps to follow in each stage.\n\nSuggest how they can attract customers, how they can convert them into clients, and how they can manage customer relationships post-sale.\nGenerate a detailed, step-by-step map of this client journey."
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

router.post("/get_client_journey", clientJourney.printClientJourney);
router.post("/save_client_journey", clientJourney.saveClientJourney);

module.exports = router;
