const express = require("express");
require("dotenv").config();
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

// ===== CONNECTION TO DATABASE =====
require("./configuration/DatabaseConfig").connectDatabase();

// ===== ACCOUNT APIs CONTROLLERS =====
app.use("/api/login", require("./controllers/account/loginController"));
app.use("/api/signup", require("./controllers/account/registrationController"));
app.use("/api/authenticatelogin", require("./controllers/account/AuthenticateLoginController"));
app.use("/confirmation", require("./controllers/email/emailConfirmationController"));
app.use("/api/forgetpassword", require("./controllers/account/forgetPasswordController"));
app.use("/api/authenticateuser", require("./controllers/account/authenticateUserController"));
app.use("/api/getuserdata", require("./controllers/account/getUserDataController"));
app.use("/api/updateuserdata", require("./controllers/account/UpdateUserDataController"));
app.use("/api/updatepassword", require("./controllers/account/UpdatePasswordController"));
app.use("/api/resetpassword", require("./controllers/account/ResetPasswordController"));

// ===== TEAM MEMBERS APIs CONTROLLERS =====
app.use("/api/teammember/getbusinessteam", require("./controllers/team/getTeamMemberController"));

// ===== BUSINESS APIs CONTROLLERS =====
app.use("/api/business", require("./controllers/business/businessController"));
app.use("/api/clientjourney", require("./controllers/business/clientJourneyController"));
app.use("/api/sop", require("./controllers/business/sopController"));

// ===== PRODUCT APIs CONTROLLERS =====
app.use("/api/product/getall", require("./controllers/product/getAllProductController"));

// ===== CONNECTION TO FRONTEND BUILD =====
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
app.on('error', (err) => {
    console.log(err.message);
});