const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const router = express.Router();
require('dotenv').config()
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});




const openai = new OpenAIApi(configuration);

async function runCompletion() {    
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are in charge of making business plans and SOPs (how to open up and the steps involved)" },
            { role: "user", content: "I want you to generate business plan for fashion for online selling" },
            // { role: "user", content: "Please show the executive summary" },
            // { role: "user",content: "how viable is this business plan?"},
          ],
        //   max_tokens: 1000,
        //   temperature: 0.6,
        //   n: 1,
        //   stop: "\n",
});
    return completion;
}


router.get("/", async (req, res) => {
    try {
        const completion = await runCompletion();
        const reply = completion.data.choices[0].message.content;
        console.log(reply);
        for (let i = 0; i < completion.data.choices.length; i++) {
            console.log(completion.data.choices[i].message.content);
        }
        return res.status(200).json(reply);
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({
            result: "None"
        })};
});

module.exports = router;
