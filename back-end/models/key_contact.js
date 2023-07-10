const sequelize = require('../controllers/accountController/connectDatabase').sequelize;
const {DataTypes} = require('sequelize');
const Business = require('./business');

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

// Relation with Business
Business.hasOne(KeyContact, { 
    foreignKey: 'businessID',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});
KeyContact.belongsTo(Business, {
    foreignKey: 'businessID'
});

module.exports = KeyContact;