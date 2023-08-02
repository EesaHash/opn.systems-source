const sequelize = require('../configuration/DatabaseConfig').sequelize;
const User = require('./user');
const { DataTypes } = require('sequelize');

// Define the Business model using Sequelize
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

// Establish the relationship between Business and User using Sequelize associations
// A User can have many Businesses, so the User model has a one-to-many relationship with the Business model.
// 'email' is the foreign key linking them.
User.hasMany(Business, {
    foreignKey: 'email',
    onUpdate: 'CASCADE', // If a user's email is updated, all associated businesses will also be updated.
    onDelete: 'CASCADE' // If a user is deleted, all associated businesses will also be deleted.
});
Business.belongsTo(User, {
    foreignKey: 'email' // The foreign key in the Business model that references the User model.
});

module.exports = Business;
