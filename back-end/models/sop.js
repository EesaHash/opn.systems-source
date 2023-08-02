const sequelize = require('../configuration/DatabaseConfig').sequelize;
const { DataTypes } = require('sequelize');
const ClientJourney = require('./client_journey');

// Define the SOP (Standard Operating Procedures) model using Sequelize
const SOP = sequelize.define('Standard Operating Procedures', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // Title of the SOP, it should not be null (required).
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Purpose of the SOP, it can be a text.
    purpose: {
        type: DataTypes.TEXT,
    },
    // Definitions used in the SOP, it can be a text.
    definitions: {
        type: DataTypes.TEXT,
    },
    // Responsibilities related to the SOP, it can be a text.
    responsibility: {
        type: DataTypes.TEXT,
    },
    // Procedure details of the SOP, it can be a text.
    procedure: {
        type: DataTypes.TEXT,
    },
    // Documentation information related to the SOP, it can be a text.
    documentation: {
        type: DataTypes.TEXT,
    },
    // Stage of the SOP, represented as a string with a maximum length of 20 characters.
    stage: {
        type: DataTypes.STRING(20)
    }
});

// Establish the relationship between SOP and ClientJourney using Sequelize associations
// A ClientJourney can have many SOPs, so the ClientJourney model has a one-to-many relationship with the SOP model.
// 'clientJourneyID' is the foreign key linking them.
ClientJourney.hasMany(SOP, {
    foreignKey: 'clientJourneyID',
    onUpdate: 'CASCADE', // If a client journey's ID is updated, the associated SOPs will also be updated.
    onDelete: 'CASCADE' // If a client journey is deleted, the associated SOPs will also be deleted.
});
SOP.belongsTo(ClientJourney, {
    foreignKey: 'clientJourneyID' // The foreign key in the SOP model that references the ClientJourney model.
});

module.exports = SOP;
