require('dotenv').config();

/*
    Define the model for OpenAI
    You can choose gpt-3.5-turbo-16k or gpt-4 or even newer once it's released
    Simply set modelName to the model you want to use
*/
const modelName = "gpt-4"

module.exports = {modelName};