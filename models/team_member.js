const sequelize = require('../configuration/DatabaseConfig').sequelize;
const Business = require('./business');
const { DataTypes } = require('sequelize');

// Define the Team_Member model using Sequelize
const Team_Member = sequelize.define('Team_Member', {
    // 'email' is the primary key for the Team_Member model.
    email: {
        type: DataTypes.STRING(50),
        primaryKey: true
    },
    // 'id' is another primary key for the Team_Member model.
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    // 'role' is the third primary key for the Team_Member model.
    role: {
        type: DataTypes.STRING,
        primaryKey: true
    }
});

// Establish the relationship between Business and Team_Member using Sequelize associations
// A Business can have many Team_Members, so the Business model has a one-to-many relationship with the Team_Member model.
// 'id' is the foreign key in the Team_Member model that references the Business model.
Business.hasMany(Team_Member, { 
    foreignKey: 'id',
    onUpdate: 'CASCADE', // If a Business's 'id' is updated, the associated Team_Members will also be updated.
    onDelete: 'CASCADE' // If a Business is deleted, the associated Team_Members will also be deleted.
});

module.exports = Team_Member;
