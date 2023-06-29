const sequelize = require('../controllers/accountController/connectDatabase').sequelize;
const {DataTypes} = require('sequelize');

const ClientJourney = sequelize.define('Client Journey', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    overview: {
        type: DataTypes.TEXT,
    },
    awareness: {
        type: DataTypes.TEXT,
    },
    interest: {
        type: DataTypes.TEXT,
    },
    evaluation: {
        type: DataTypes.TEXT,
    },
    decision: {
        type: DataTypes.TEXT,
    },
    purchase: {
        type: DataTypes.TEXT,
    },
    implementation: {
        type: DataTypes.TEXT,
    },
    postPurchase: {
        type: DataTypes.TEXT,
    },
    retention: {
        type: DataTypes.TEXT,
    },
    businessId: {
        type: DataTypes.INTEGER,
        foreignKey: true,
    },
});

module.exports = ClientJourney;