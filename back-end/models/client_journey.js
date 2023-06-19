const sequelize = require('../controllers/accountController/connectDatabase').sequelize;
const {DataTypes} = require('sequelize');

const ClientJourney = sequelize.define('Client Journey', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    forProductOrService: {
        type: DataTypes.STRING,
    },
    awareness: {
        type: DataTypes.TEXT,
    },
    research: {
        type: DataTypes.TEXT,
    },
    consideration: {
        type: DataTypes.TEXT,
    },
    decision: {
        type: DataTypes.TEXT,
    },
    onboaring: {
        type: DataTypes.TEXT,
    },
    usage: {
        type: DataTypes.TEXT,
    },
    support: {
        type: DataTypes.TEXT,
    },
    engagement: {
        type: DataTypes.TEXT,
    },
    loyaltyAndAdvocacy: {
        type: DataTypes.TEXT,
    },
});

module.exports = ClientJourney;