const sequelize = require('../configuration/DatabaseConfig').sequelize;
const User = require('./user');
const {DataTypes} = require('sequelize');
/*
    Business Model
    - id
    - businessName
    - businessType
    - industry
    - companySize
    - businessObjective
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
    }
});

// Relation with User
User.hasMany(Business, { 
    foreignKey: 'email',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});
Business.belongsTo(User, {
    foreignKey: 'email'
});

module.exports = Business;
