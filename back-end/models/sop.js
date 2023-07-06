const sequelize = require('../controllers/accountController/connectDatabase').sequelize;
const {DataTypes} = require('sequelize');
const ClientJourney = require('./client_journey');

const SOP = sequelize.define('Standard Operating Procedures', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    purpose: {
        type: DataTypes.TEXT,
    },
    definitions: {
        type: DataTypes.TEXT,
    },
    responsibility: {
        type: DataTypes.TEXT,
    },
    procedure: {
        type: DataTypes.TEXT,
    },
    documentation: {
        type: DataTypes.TEXT,
    },
});


ClientJourney.hasMany(SOP);

module.exports = SOP;