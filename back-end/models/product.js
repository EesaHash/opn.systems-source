const sequelize = require('../configuration/DatabaseConfig').sequelize;
const { DataTypes } = require('sequelize');
const Business = require('./business');

// Define the Product model using Sequelize
const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // What services (for the product) would you provide to help sell the product?
    coreServices: {
        type: DataTypes.TEXT,
    },
    // Who are you targeting? Local, National, International? Is it a specific community or catering to people in a certain profession?
    // Is it B to B or B to C (Business-to-Business or Business-to-Consumer)?
    targetMarket: {
        type: DataTypes.TEXT,
    },
    // Do you intend to sell a product or service? (True if it's a product, False if it's a service)
    isProduct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    // Describe how your product or service works in detail.
    // Is it a digital service, physical product, service-based offering, or a combination?
    // Explain the mechanism if it's a physical product.
    productOrServiceDescription: {
        type: DataTypes.TEXT,
    },
    // How do you fund your business? Do you have investors, are you self-funded, or do you need to take a loan?
    fundingStrategy: {
        type: DataTypes.TEXT,
    }
});

// Establish the relationship between Product and Business using Sequelize associations
// A Business can have many Products, so the Business model has a one-to-many relationship with the Product model.
// 'businessID' is the foreign key linking them.
Business.hasMany(Product, { 
    foreignKey: 'businessID',
    onUpdate: 'CASCADE', // If a business's ID is updated, the associated Products will also be updated.
    onDelete: 'CASCADE' // If a business is deleted, the associated Products will also be deleted.
});
Product.belongsTo(Business, {
    foreignKey: 'businessID' // The foreign key in the Product model that references the Business model.
});

module.exports = Product;
