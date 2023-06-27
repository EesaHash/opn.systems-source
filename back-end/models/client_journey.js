const sequelize = require('../controllers/accountController/connectDatabase').sequelize;
const {DataTypes} = require('sequelize');

const ClientJourney = sequelize.define('Client Journey', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    data : {
        type: DataTypes.TEXT,
    }
});

module.exports = ClientJourney;