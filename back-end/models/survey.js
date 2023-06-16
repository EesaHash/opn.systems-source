const { DataTypes } = require('sequelize');
const User = require('./user');
const sequelize = require('../controllers/accountController/connectDatabase').sequelize;

const Survey = sequelize.define('Survey', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false
    },
    response: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING(50)
    }
});

User.hasMany(Survey, { foreignKey: 'email' });
module.exports = Survey;
