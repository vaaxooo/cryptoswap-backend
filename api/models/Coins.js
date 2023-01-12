const { Sequelize, DataTypes } = require('sequelize')
const { MySQL } = require('../modules/MySQL')

const Coins = MySQL.define('coins', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    symbol: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    percent: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    wallet: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reserve: {
        type: DataTypes.STRING,
        allowNull: true
    },
    network: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    min_amount: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    current_price: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    }
}, {
    timestamps: false,
    sequelize: MySQL,
    modelName: 'coins',
    freezeTableName: true
})

module.exports = Coins