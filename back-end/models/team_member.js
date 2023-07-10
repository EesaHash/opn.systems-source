const sequelize = require('../controllers/accountController/connectDatabase').sequelize;
// const User = require('./user');
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

// User.hasMany(Team_Member, { foreignKey: 'email' });
Business.hasMany(Team_Member, { 
    foreignKey: 'id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});

module.exports = Team_Member;