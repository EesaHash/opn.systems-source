const express = require("express");
const path = require('path');
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

// ACCOUNT APIs CONTROLLERS
app.use("/api/login", require("./controllers/accountController/loginController"));

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
app.on('error', (err) => {
    console.log(err.message);
});

