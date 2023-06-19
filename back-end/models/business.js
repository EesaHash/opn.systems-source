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
    //Name of the business
    businessName: {
        type: DataTypes.STRING,
    },
    //Type of business private or public or non-profit
    businessType: {
        type: DataTypes.STRING,
    },
    //Industry of the business e.g. Technology, Finance, Fashion etc...
    industry: {
        type: DataTypes.STRING,
    },
    //Size of the company, small-scale, startup, medium-scale, large enterprise
    companySize: {
        type: DataTypes.STRING,
    },
    //Main idea behind the business (what are you trying to achieve)
    businessObjective: {
        type: DataTypes.TEXT,
    },
    //What services or product would you provide to acheive your objective
    coreServices: {
        type: DataTypes.TEXT,
    },
    //Who are you targeting? Local, National, International? and is it a specific community/catering to people in a certain profession?
    targetMarket: {
        type: DataTypes.TEXT,
    },
    //Describe how your product or service works in detail
    productOrServiceDescription: {
        type: DataTypes.TEXT,
    },
    //Do you intend to do any manufacturing in case you are selling a product?
    isManufacture: {
        type: DataTypes.BOOLEAN,
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
Business.hasMany(ClientJourney);

module.exports = Business;
