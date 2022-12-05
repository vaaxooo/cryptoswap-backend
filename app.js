require('dotenv-flow').config()
const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const { MySQL } = require('./mysql')
const app = express()

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_API_BOT, { polling: true });

const port = process.env.PORT || 3000


const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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
    tableName: 'transactions',
    indexes: [{
        unique: true,
        fields: ['hash'],
    }],
})



/* This is a route that is used to get a transaction by id. */
app.get('/transactions/:id', async(req, res) => {
    const transaction = await Transactions.findOne({
        where: {
            hash: req.params.id
        }
    })
    res.send({
        status: 'success',
        data: transaction
    })
})

/* This is a route that is used to get a transaction by id. */
app.get('/transactions/:id/cancel', async(req, res) => {
    const transaction = await Transactions.findOne({
        where: {
            hash: req.params.id
        }
    })
    if (transaction.status == 'pending') {
        transaction.status = 'cancelled'
        transaction.save()
        res.send({
            status: 'success',
            data: transaction
        })
    } else {
        res.send({
            status: 'error',
            message: 'Transaction is not pending'
        })
    }
})


/* Creating a new transaction. */
app.post('/transactions', async(req, res) => {
    const { coinFrom, coinTo, amountFrom, amountTo, email, wallet } = req.body
    let hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const transaction = await Transactions.create({
        coinFrom,
        coinTo,
        amountFrom,
        amountTo,
        email,
        wallet,
        hash,
        ref: req.body.ref || null
    })

    let message = `[cryptoswap.cz]\n\n`;
    message += `Source Amount: ${amountFrom} ${coinFrom}\n`;
    message += `Target Amount: ${amountTo} ${coinTo}\n`;
    message += `Email: ${email}\n`;
    message += `Wallet: ${wallet}\n`;
    message += `Hash: ${hash}\n`;
    message += `Ref: ${req.body.ref || 'none'}\n`;

    bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);

    res.send({
        status: 'success',
        data: transaction
    })
})

app.listen(port, async() => {
    await MySQL.sync()
    console.log(`Example app listening at http://localhost:${port}`)
})