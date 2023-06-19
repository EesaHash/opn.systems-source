const express = require("express");
const path = require('path');
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

// ===== CONNECTION TO DATABASE =====
require("./controllers/accountController/connectDatabase").connectDatabase();

// ACCOUNT APIs CONTROLLERS
app.use("/api/login", require("./controllers/accountController/loginController"));
app.use("/api/signup", require("./controllers/accountController/registrationController"));
app.use("/api/authenticatelogin", require("./controllers/accountController/AuthenticateLoginController"));
app.use("/confirmation", require("./controllers/emailController/emailConfirmationController"));
app.use("/api/forgetpassword", require("./controllers/accountController/forgetPasswordController"));
app.use("/api/authenticateuser", require("./controllers/accountController/authenticateUserController"));

// GPT API's CONTROLLERS
app.use("/api/gptest", require("./controllers/gptController/gptTestController"));
app.use("/api/business", require("./controllers/businessControllers/businessController"));
app.use("/api/gpt", require("./controllers/gptController/gptController"));



app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
app.on('error', (err) => {
    console.log(err.message);
});

