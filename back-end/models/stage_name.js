const sequelize = require('../configuration/DatabaseConfig').sequelize;
const { DataTypes } = require('sequelize');
const ClientJourney = require('./client_journey');

// Define the StageName model using Sequelize
const StageName = sequelize.define("Stage_Name", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // 'names' is a field to store the names of stages. It can be a text.
    names: {
        type: DataTypes.TEXT,
    }
});

// Establish the relationship between StageName and ClientJourney using Sequelize associations
// A ClientJourney can have one StageName, so the ClientJourney model has a one-to-one relationship with the StageName model.
// 'clientJourneyID' is the foreign key linking them.
ClientJourney.hasOne(StageName, {
    foreignKey: 'clientJourneyID',
    onUpdate: 'CASCADE', // If a client journey's ID is updated, the associated StageName will also be updated.
    onDelete: 'CASCADE' // If a client journey is deleted, the associated StageName will also be deleted.
});
StageName.belongsTo(ClientJourney, {
    foreignKey: 'clientJourneyID' // The foreign key in the StageName model that references the ClientJourney model.
});

module.exports = StageName;
