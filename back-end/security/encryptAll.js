const User = require("../models/user");

const updateAll = async () => {
    try {
        const users = await User.findAll();
        for (let i = 0; i < users.length; i++) {
            console.log(users[i].password)
            await users[i].update({
                password: String(users[i].dataValues.password)
            })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {updateAll}