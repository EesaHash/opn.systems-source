const User = require("../../models/user");
const { Op } = require("sequelize");

const isEmailExist = async (data) => {
    return (await User.findAll({
        where: {
            email: String(data).toLowerCase()
        }
    })).length > 0;
};

const isUsernameExist = async (data) => {
    return (await User.findAll({
        where: {
            username: String(data).toLowerCase()
        }
    })).length > 0;
};

const getUsers = async (email) => {
    const inputEmail = String(email).toLowerCase();
    return (await User.findAll({
        where: {
            [Op.or]: [
                { username: inputEmail },
                { email: inputEmail }
            ]
        },
        raw: true
    }))
};

module.exports = {isEmailExist, isUsernameExist, getUsers}