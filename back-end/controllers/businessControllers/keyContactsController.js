
const KeyContact = require("../../models/key_contact")

const saveKeyContact = async (details) => {
        await KeyContact.create({
            name: details.name,
            positon: details.position,
            email: details.teamContactEmail,
            phoneNumber: details.phoneNumber,
            businessID: details.businessID
        });
    }


module.exports = { saveKeyContact };