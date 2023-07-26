const sequelize = require('../configuration/DatabaseConfig').sequelize;
const {DataTypes} = require('sequelize');
const Business = require('./business');

const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    //What services(for the product) would you provide to help sell the product? e.g if you are selling a car, you would provide a test drive, warranty, etc...
    coreServices: {
        type: DataTypes.TEXT,
    },
    //Who are you targeting? Local, National, International? and is it a specific community/catering to people in a certain profession? Is it B to B or B to C?
    targetMarket: {
        type: DataTypes.TEXT,
    },
    //Do you intend to sell product or service
    isProduct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    //Describe how your product or service works in detail - is it a digital service, physical product, service based orffering or a combination. Explain the mechanism if its a physical product  
    productOrServiceDescription: {
        type: DataTypes.TEXT,
    },
    //How do you fund your business, do you have investors, are you self-funded, do you need to take a loan?
    fundingStrategy: {
        type: DataTypes.TEXT,
    }
});

// Relation with Business
Business.hasMany(Product, { 
    foreignKey: 'businessID',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});
Product.belongsTo(Business, {
    foreignKey: 'businessID'
});

module.exports = Product;