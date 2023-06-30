const { DataTypes } = require('sequelize');
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
        type: DataTypes.STRING(20),
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(50)
    },
    email_verification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = User;
