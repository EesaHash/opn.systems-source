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

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
app.on('error', (err) => {
    console.log(err.message);
});

