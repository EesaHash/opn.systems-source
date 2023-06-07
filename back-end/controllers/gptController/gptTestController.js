const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const router = express.Router();
require('dotenv').config()


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


async function runCompletion() {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Please say hi to ricky'",
});
    return completion;
}

router.get("/", async (req, res) => {
    try {
        const reply = (await runCompletion()).data.choices[0].text;
        return res.status(200).json({
            result: reply
        });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({
            result: "None"
        })};
});

module.exports = router;
