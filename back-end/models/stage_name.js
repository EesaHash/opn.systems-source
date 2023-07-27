const sequelize = require('../configuration/DatabaseConfig').sequelize;
const {DataTypes} = require('sequelize');
const ClientJourney = require('./client_journey');

const StageName = sequelize.define("Stage_Name", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    names: {
        type: DataTypes.TEXT,
    }
});

// Relation with Client Journey
ClientJourney.hasOne(StageName, {
    foreignKey: 'clientJourneyID',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});
StageName.belongsTo(ClientJourney, {
    foreignKey: 'clientJourneyID'
});

module.exports = StageName;