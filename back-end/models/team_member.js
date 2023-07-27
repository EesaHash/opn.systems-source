const sequelize = require('../configuration/DatabaseConfig').sequelize;
const Business = require('./business');
const { DataTypes } = require('sequelize');

const Team_Member = sequelize.define('Team_Member', {
    email: {
        type: DataTypes.STRING(50),
        primaryKey: true
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    role: {
        type: DataTypes.STRING,
        primaryKey: true
    }
});

Business.hasMany(Team_Member, { 
    foreignKey: 'id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});

module.exports = Team_Member;