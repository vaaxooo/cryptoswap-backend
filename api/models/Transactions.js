const { Sequelize, DataTypes } = require('sequelize')
const { MySQL } = require('../modules/MySQL')

const Transactions = MySQL.define('transactions', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    coinFrom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coinTo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amountFrom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amountTo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    wallet: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ref: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    }
}, {
    timestamps: false,
    sequelize: MySQL,
    modelName: 'transactions',
    freezeTableName: true,
    indexes: [{
        unique: true,
        fields: ['hash'],
    }],
})

module.exports = Transactions