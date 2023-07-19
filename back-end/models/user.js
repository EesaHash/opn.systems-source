const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../controllers/accountController/connectDatabase').sequelize;

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email_verification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSaltSync(10, 'a');
                user.password = bcrypt.hashSync(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSaltSync(10, 'a');
                user.password = bcrypt.hashSync(user.password, salt);
            }
        }
    },
    instanceMethods: {
        validPassword: (password) => {
            return bcrypt.compareSync(password, this.password);
        }
    }
});

User.prototype.validPassword = async (password, hash) => {
    return await bcrypt.compareSync(password, hash);
}

// Instance method for validating password
//   User.prototype.validPassword = function (password) {
//     return bcrypt.compare(password, this.password);
//   };

module.exports = User;
