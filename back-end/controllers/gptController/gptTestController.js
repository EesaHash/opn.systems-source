const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const router = express.Router();
require('dotenv').config()


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});


const openai = new OpenAIApi(configuration);

// TODO 
// Append user responses to this array/list --> Must be in the form at "Role" and "Content". This will help keep track of the conversation history,
// as well as allow the user to ask questions aka receive dynamic input from the frontend.

const messages = [
    { role: "user", content: "I want you to generate business plan for fashion for online selling" },
];

//Multi Prompt
async function runCompletion() {    
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are in charge of making business plans and SOPs (how to open up and the steps involved)" },
            ...messages,
          ],
        //   max_tokens: 1000, -> Number of word, sentences etc...
        //   temperature: 0.6, -> Reduces randomisation set to 0 for the same response each time
        //   n: 1, -> Number of responses
        //   stop: "\n", -> Stop at new line
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
