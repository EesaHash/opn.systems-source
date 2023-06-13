const { DataTypes } = require('sequelize');
const sequelize = require('../controllers/accountController/connectDatabase').sequelize;
const Survey = require('./survey');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email_verification: {
        type: DataTypes.STRING,
        allowNull: false
    }
  });
  
//Define relationship between User and Survey, A user can have many surveys (naming inappropriate as each survey entry is a single question)
User.hasMany(Survey, { foreignKey: 'email' });
module.exports = User;
