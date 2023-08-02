// Import the KeyContact model for interacting with the database
const KeyContact = require("../../models/key_contact");

/**
 * Method to save a key contact to the database.
 * It takes a details object containing contact information as a parameter and saves the contact to the KeyContact model.
 * @param {object} details - An object containing the following contact information:
 *   - name {string} - The name of the key contact.
 *   - position {string} - The position of the key contact in the business.
 *   - teamContactEmail {string} - The email address of the key contact.
 *   - phoneNumber {string} - The phone number of the key contact.
 *   - businessID {number} - The ID of the business associated with this key contact.
 * @returns {void} - This function does not return anything (void).
 */
const saveKeyContact = async (details) => {
    // Create a new entry in the KeyContact model with the provided details
    return (await KeyContact.create({
        name: details.name,
        positon: details.position,
        email: details.email,
        phoneNumber: details.phoneNumber,
        businessID: details.businessID
    }));
};
const getSingleKeyContact = async (businessID) => {
    return (await KeyContact.findAll({
        where: {
            businessID: businessID
        }
    }))[0];
};

// Export the saveKeyContact function for use in other modules
module.exports = { saveKeyContact, getSingleKeyContact };
