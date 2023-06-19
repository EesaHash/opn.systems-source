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
            { role: "system", content: "What's the name of the business?"},
            { role: "user", content: business.businessName},
            { role: "system", content: "What's the type of the business? Is it a public, private or non-profit business?"},
            { role: "user", content: business.businessType},
            { role: "system", content: "What's the industry of the business? e.g. Technology, Finance, Fashion etc..."},
            { role: "user", content: business.industry},
            { role: "system", content: "What's the size of the company? Is it a small-scale, startup, medium-scale, large enterprise?"},
            { role: "user", content: business.companySize},
            { role: "system", content: "What's the main idea behind the business? What are you trying to achieve?"},
            { role: "user", content: business.businessObjective},
            { role: "system", content: "What services or product would you provide to acheive your objective?"},
            { role: "user", content: business.coreServices},
            { role: "system", content: "Who are you targeting? Local, National, International? and is it a specific community/catering to people in a certain profession?"},
            { role: "user", content: business.targetMarket},
            { role: "system", content: "Describe how your product or service works in detail"},
            { role: "user", content: business.productOrServiceDescription},
            { role: "assistant", content: "Based on the user's responses to some questions above, you are tasked with making a Client Journey Map that has the following headings (1) Awareness, (2) Research, (3) Consideration, (4) Decision, (5) Onboarding, (6) Usage, (7) Support, (8) Engagement, (9) Loyalty and Advocacy. Please make it detailed as much as you can. Include links to useful online websites or resources that MAY be used to acheive these tasks. Additionally, provide examples for each of the categories as well" },
        );

        const response = await runCompletion(messages);

        return response.data.choices[0].message.content;
    } catch (error) {
        console.log("Could not generate client journey:");
        console.error(error);
        throw error;
    }
}

router.post("/getCJ", async (req, res) => {
    try {
        const { id } = req.body;
        const result = await generateClientJourney(id);
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
