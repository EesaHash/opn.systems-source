const sequelize = require('../configuration/DatabaseConfig').sequelize;
const { DataTypes } = require('sequelize');
const Product = require('./product');

// Define the ClientJourney model using Sequelize
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

// Establish the relationship between ClientJourney and Product using Sequelize associations
// Each product can have one client journey, so the Product model has a one-to-one relationship with the ClientJourney model.
// 'productID' is the foreign key linking them.
Product.hasOne(ClientJourney, {
    foreignKey: 'productID',
    onUpdate: 'CASCADE', // If a product is updated, the associated client journey will also be updated.
    onDelete: 'CASCADE' // If a product is deleted, the associated client journey will also be deleted.
});
ClientJourney.belongsTo(Product, {
    foreignKey: 'productID' // The foreign key in the ClientJourney model that references the Product model.
});

module.exports = ClientJourney;
