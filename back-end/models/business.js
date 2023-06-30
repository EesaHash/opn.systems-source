const sequelize = require('../controllers/accountController/connectDatabase').sequelize;
const User = require('./user');
const ClientJourney = require('./client_journey');
const {DataTypes} = require('sequelize');
/*
    Business Model
    - id
    - businessName
    - businessType
    - industry
    - companySize
    - businessObjective
    - coreServices
    - targetMarket
    - productOrServiceDescription
    - isManufacture
    - fundingStrategy
    - email
    These are the variables that will be stored in the database containing responses entered by the app user
    Note: these variables do not accurately represent the questions put forth to the user, they are just to store the answers.
    This means that what the user sees on screen may be different to how it is called internally in code language.
*/
const Business = sequelize.define('Business', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    //Name of the business *
    businessName: {
        type: DataTypes.STRING,
    },
    //Type of business private or public or non-profit 
    businessType: {
        type: DataTypes.STRING,
    },
    //Industry of the business e.g. Technology, Finance, Fashion etc... *
    industry: {
        type: DataTypes.STRING,
    },
    //Size of the company, small-scale, startup, medium-scale, large enterprise
    companySize: {
        type: DataTypes.STRING,
    },
    //Main idea behind the business (what are you trying to achieve) long term goal, vision, mission 
    businessObjective: {
        type: DataTypes.TEXT,
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
    },
    email: {
        type: DataTypes.STRING(50)
    },
  });

User.hasMany(Business, { foreignKey: 'email' });
Business.hasMany(ClientJourney, { foreignKey: 'businessId' });

module.exports = Business;
