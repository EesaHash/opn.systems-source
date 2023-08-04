const User = require("../../models/user");
const { Op } = require("sequelize");

/**
 * Checks if an email already exists in the database.
 * @param {string} data - The email to check.
 * @returns {boolean} - Returns true if the email exists, otherwise false.
 */
const isEmailExist = async (data) => {
    return (await User.findAll({
        where: {
            email: String(data).toLowerCase()
        }
    })).length > 0;
};

/**
 * Checks if a username already exists in the database.
 * @param {string} data - The username to check.
 * @returns {boolean} - Returns true if the username exists, otherwise false.
 */
const isUsernameExist = async (data) => {
    return (await User.findAll({
        where: {
            username: String(data).toLowerCase()
        }
    })).length > 0;
};

/**
 * Retrieves users based on their email or username.
 * @param {string} email - The email or username to search for.
 * @returns {Array} - An array of user objects.
 */
const getUsers = async (email) => {
    const inputEmail = String(email).toLowerCase();
    return (await User.findAll({
        where: {
            [Op.or]: [
                { username: inputEmail },
                { email: inputEmail }
            ]
        },
        raw: false
    }));
};

module.exports = { isEmailExist, isUsernameExist, getUsers };
