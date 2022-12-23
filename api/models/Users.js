const { Sequelize, DataTypes } = require('sequelize')
const { MySQL } = require('../modules/MySQL')

const Users = MySQL.define('users', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
}, {
    timestamps: false,
    sequelize: MySQL,
    modelName: 'users',
    freezeTableName: true,
    indexes: [{
        unique: true,
        fields: ['email'],
    }],
})

module.exports = Users