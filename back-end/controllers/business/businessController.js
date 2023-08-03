// Import required modules
const express = require("../../../front-end/node_modules/@types/express");
const router = express.Router();
const Business = require('../../models/business');
const { addTeamMembers } = require("../team/addTeamMemberController");
const { saveKeyContact, getSingleKeyContact } = require("../business/keyContactsController");

// Create an empty object to hold business-related methods
const business = {};

/*
    API METHODS
*/

/**
 * Add a new business to the database.
 *
 * @param {Object} req - The request object containing the details of the new business.
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - The response object with the status and details of the added business.
 */
business.addNewBusiness = async (req, res) => {
    try {
        // Extract request body parameters for creating a new business
        const {
            businessName,
            businessType,
            industry,
            companySize,
            businessObjective,
            email,
            teamList,
            name,
            position,
            teamContactEmail,
            phoneNumber
        } = req.body;

        // Create a new business record in the database
        const business = await Business.create({
            businessName,
            businessType,
            industry,
            companySize,
            businessObjective,
            email
        });

        // Save the key contact for the business in the database
        const keyContact = await saveKeyContact({
            name: name,
            position: position,
            email: teamContactEmail,
            phoneNumber: phoneNumber,
            businessID: business.id,
        });
        business.dataValues.keyContact = keyContact.dataValues;

        // Add team members for the business in the database
        await addTeamMembers(teamList, business.id);

        // Log success message and respond with success status and the created business object
        console.log(`[Success] Added business ${businessName} for ${email} : `, business.id);
        return res.status(200).json({
            status: true,
            message: "Successfully added new business!",
            business: business.dataValues
        });
    } catch (error) {
        // Log error and respond with error status and message
        console.log(error);
        res.status(500).json({ status: false, message: error });
    }
};

/**
 * Remove a business from the database based on its ID.
 *
 * @param {Object} req - The request object containing the ID of the business to be removed.
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - The response object with the status and message indicating the success or failure of the operation.
 */
business.removeBusiness = async (req, res) => {
    try {
        const { id } = req.body;

        // Delete the business from the business table in the database
        const business = await Business.destroy({ where: { id } });

        // Check if the business was found and deleted
        if (business === 0)
            return res.status(404).json({ status: false, message: `Could not find business` });

        // If business was successfully deleted, log success message and respond with success status
        console.log(`[Success] Deleted business ${id}`);
        return res.status(200).json({
            status: true,
            message: `Successfully deleted business!`
        });
    } catch (error) {
        // If any errors occur during the process, log the error and respond with error status and message
        res.status(500).json({
            status: false,
            message: error
        });
    }
};

/**
 * Update a business in the database based on its ID with the provided data.
 *
 * @param {Object} req - The request object containing the ID and updated data of the business.
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - The response object with the status and message indicating the success or failure of the operation.
 */
business.updateBusiness = async (req, res) => {
    try {
        const {
            id,
            businessName,
            businessType,
            industry,
            companySize,
            businessObjective,
        } = req.body;

        // Update the business record in the database
        const business = await Business.update({
            businessName,
            businessType,
            industry,
            companySize,
            businessObjective,
        }, { where: { id } });

        // Check if the business record was successfully updated
        if (business[0] === 0)
            throw new Error("Failed to update business data");

        // If business was successfully updated, log success message and respond with success status
        console.log(`[Success] Updated business details id: ${id} - ${businessName}`);
        res.status(200).json({ status: true, message: `Successfully update business details!` });
    } catch (error) {
        // If any errors occur during the process, catch the error, log it, and respond with error status and message
        res.status(500).json({ status: false, message: error });
    }
};

/**
 * Get details of a single business from the database based on its ID.
 *
 * @param {Object} req - The request object containing the ID of the business.
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - The response object with the status and the retrieved business details.
 */
business.getSingleBusiness = async (req, res) => {
    try {
        const { id } = req.body;

        // Find the business with the provided ID in the database
        const business = await Business.findAll({ where: { id } });
        const keyContact = await getSingleKeyContact(id);
        business.dataValues.keyContact = keyContact;

        // If business is found, log success message and respond with the retrieved business details
        console.log(`[Success] Retrieved business details`);
        res.status(200).json({ business });
    } catch (error) {
        // If any errors occur during the process, catch the error, log it, and respond with error status and message
        res.status(500).json({ error: `Could not retrieve business` });
    }
};

/**
 * Get details of all businesses for a given user from the database.
 *
 * @param {Object} req - The request object containing the email of the user.
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {Object} - The response object with the status and an array of retrieved business details for the user.
 */
business.getAllBusinesses = async (req, res) => {
    try {
        const { email } = req.body;

        // Find all businesses for the given user in the database, ordered by ID
        const businesses = await Business.findAll({ where: { email }, order: ['id'] });
        for(let i = 0; i < businesses.length; ++i){
            const keyContact = await getSingleKeyContact(businesses[i].id);
            businesses[i].dataValues.keyContact = keyContact;
        }

        // If businesses are found, log success message and respond with the retrieved business details for the user
        console.log(`[Success] Retrieved business details for ${email}`);
        return res.status(200).json({ status: true, businesses: businesses });
    } catch (error) {
        // If any errors occur during the process, catch the error, log it, and respond with error status and message
        console.log(error);
        res.status(500).json({ status: false, message: error });
    }
};

/*
    EXPRESS ROUTES
*/

router.post('/addNewBusiness', business.addNewBusiness);
router.post('/updateBusiness', business.updateBusiness);
router.post('/removeBusiness', business.removeBusiness);
router.post('/getSingleBusiness', business.getSingleBusiness);
router.post('/getAllBusinesses', business.getAllBusinesses);

module.exports = router;
