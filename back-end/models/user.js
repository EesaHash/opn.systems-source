const { DataTypes } = require('sequelize');
const sequelize = require('../controllers/accountController/connectDatabase').sequelize;
const Survey = require('./survey');

const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    dob: {
        type: DataTypes.STRING
    },
  });
  
//Define relationship between User and Survey, A user can have many surveys (naming inappropriate as each survey entry is a single question)
User.hasMany(Survey, { foreignKey: 'email' });
module.exports = User;
