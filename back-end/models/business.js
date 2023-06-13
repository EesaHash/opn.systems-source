const { DataTypes } = require('sequelize');
const sequelize = require('../controllers/accountController/connectDatabase').sequelize;
const User = require('./user');

const Business = sequelize.define('Business', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
    },
    businessName: {
        type: DataTypes.STRING,
    },
    businessType: {
        type: DataTypes.STRING,
    },
    industry: {
        type: DataTypes.STRING,
    },
    companySize: {
        type: DataTypes.STRING,
    },
    coreServices: {
        type: DataTypes.STRING,
    },
    isManufacture: {
        type: DataTypes.BOOLEAN,
    },
    email: {
        type: DataTypes.STRING,
    }
  });

User.hasMany(Business, { foreignKey: 'email' });
module.exports = Business;
