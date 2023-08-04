const sequelize = require('../configuration/DatabaseConfig').sequelize;
const { DataTypes } = require('sequelize');
const Business = require('./business');

// Define the KeyContact model using Sequelize
const KeyContact = sequelize.define("Key_Contact", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    positon: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING(20)
    }
});

// Establish the relationship between KeyContact and Business using Sequelize associations
// A Business can have one KeyContact, so the Business model has a one-to-one relationship with the KeyContact model.
// 'businessID' is the foreign key linking them.
Business.hasOne(KeyContact, { 
    foreignKey: 'businessID',
    onUpdate: 'CASCADE', // If a business's ID is updated, the associated KeyContact will also be updated.
    onDelete: 'CASCADE' // If a business is deleted, the associated KeyContact will also be deleted.
});
KeyContact.belongsTo(Business, {
    foreignKey: 'businessID' // The foreign key in the KeyContact model that references the Business model.
});

module.exports = KeyContact;
