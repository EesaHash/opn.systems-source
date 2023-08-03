const express = require("../../../front-end/node_modules/@types/express");
const { getUsers } = require("./UserController");
const router = express.Router();

// Define a POST route for handling the user data retrieval
router.post("/", async (req, res) => {
    try {
        const { email } = req.body;

        // Get the user with the provided email from the database
        let user = await getUsers(email);
        user = user[0];

        // Check if the user exists in the database
        if (!user) {
            return res.status(400).json({
                status: false,
                message: "User is not registered yet!"
            });
        }

        // If the user is found, log a success message and return the user data in the response
        console.log(`Successfully retrieve ${email} data`);
        return res.status(200).json({
            status: true,
            user: user
        });
    } catch (error) {
        // If any errors occur during the process, catch the error, log it, and return an error response
        console.log(error);
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});

// Export the router
module.exports = router;
