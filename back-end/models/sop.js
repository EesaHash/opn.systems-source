const sequelize = require('../configuration/DatabaseConfig').sequelize;
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
    stage: {
        type: DataTypes.STRING(20)
    }
});

// Relation with Client Journey
ClientJourney.hasMany(SOP, {
    foreignKey: 'clientJourneyID',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});
SOP.belongsTo(ClientJourney, {
    foreignKey: 'clientJourneyID'
});

module.exports = SOP;