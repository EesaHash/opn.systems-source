const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../configuration/DatabaseConfig').sequelize;

// Define the User model using Sequelize
const User = sequelize.define('User', {
    // 'email' is the primary key for the User model.
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
    },
    // 'username' is a required field for the User model.
    username: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    // 'password' is a required field for the User model.
    password: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    // 'first_name' is a required field for the User model.
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    // 'last_name' is a required field for the User model.
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    // 'email_verification' is a boolean field to track whether the user's email is verified.
    email_verification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    hooks: {
        // Hook before creating a new user to hash the password using bcrypt.
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSaltSync(10, 'a');
                user.password = bcrypt.hashSync(user.password, salt);
            }
        },
        // Hook before updating a user to hash the password using bcrypt if it is changed.
        beforeUpdate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSaltSync(10, 'a');
                user.password = bcrypt.hashSync(user.password, salt);
            }
        }
    },
    // Instance methods for the User model.
    instanceMethods: {
        // Instance method for validating password during login.
        validPassword: (password) => {
            return bcrypt.compareSync(password, this.password);
        }
    }
});

// Static method for validating password outside of the model instance.
User.prototype.validPassword = async (password, hash) => {
    return await bcrypt.compareSync(password, hash);
}

module.exports = User;
