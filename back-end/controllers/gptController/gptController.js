const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
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

module.exports = {runCompletion};