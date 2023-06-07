const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const router = express.Router();
require('dotenv').config()


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//Single Prompt -- RESPONSE IS TRUNCATED DUE TO THE TOKEN LIMIT -- subscription is required
// async function runCompletion() {    
//     const completion = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: "Give me a course plan for teaching a 5 years old Python programming.",
// });
//     return completion;
// }

//Multi Prompt
async function runCompletion() {    
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "Who won the world series in 2020?" },
            { role: "assistant",content: "The Los Angeles Dodgers won the World Series in 2020."},
            { role: "user", content: "Where was it played?" },
            { role: "user",content: "Please teach me react, i Know nothing about coding"},
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
        return res.status(200).json(reply);
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({
            result: "None"
        })};
});

module.exports = router;
