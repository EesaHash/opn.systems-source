const sequelize = require('../configuration/DatabaseConfig').sequelize;
const {DataTypes} = require('sequelize');
const Product = require('./product');

const ClientJourney = sequelize.define('Client Journey', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
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
    }
});

// Relation with Product
Product.hasOne(ClientJourney, { 
    foreignKey: 'productID',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});
ClientJourney.belongsTo(Product, {
    foreignKey: 'productID'
});

module.exports = ClientJourney;