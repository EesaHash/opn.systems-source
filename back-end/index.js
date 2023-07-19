const express = require("express");
const path = require('path');
require("dotenv").config();
const https = require("https");

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
app.use("/api/getuserdata", require("./controllers/accountController/getUserDataController"));

// TEAM MEMBERS APIs CONTROLLERS
app.use("/api/teammember/getbusinessteam", require("./controllers/teamMemberController/getTeamMemberController"));

// BUSINESS APIs CONTROLLERS
app.use("/api/business", require("./controllers/businessControllers/businessController"));
app.use("/api/clientjourney", require("./controllers/businessControllers/clientJourneyController"));
app.use("/api/sop", require("./controllers/businessControllers/sopController"));
// app.use("/api/stages/getbyjourneyid", require("./controllers/businessControllers/getStageNamesController"));

// PRODUCT APIs CONTROLLERS
app.use("/api/product/getall", require("./controllers/ProductController/getAllProductController"));

// https
//   .createServer(app)
//   .listen(PORT, ()=>{
//     console.log(`Server listening on ${PORT}`)
//   });

app.listen(PORT, () => {
    console.log();
});
app.on('error', (err) => {
    console.log(err.message);
});

