const Transactions = require('../models/Transactions')
const Coins = require('../models/Coins')
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_API_BOT, { polling: true });

module.exports = {

    /* Creating a transaction. */
    create: async(req, res) => {
        const { coinFrom, coinTo, amountFrom, amountTo, email, wallet } = req.body
        let hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const coin_from = await Coins.findOne({ where: { id: coinFrom } }) // Finding the coin that the user wants to swap
        const coin_to = await Coins.findOne({ where: { id: coinTo } }) // Finding the coin that the user wants to swap

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
        message += `Source Amount: ${amountFrom} ${(coin_from.symbol).toUpperCase()}\n`;
        message += `Target Amount: ${amountTo} ${(coin_to.symbol).toUpperCase()}\n`;
        message += `Email: ${email}\n`;
        message += `Wallet: ${wallet}\n`;
        message += `Hash: ${hash}\n`;
        message += `Ref: ${req.body.ref || 'none'}\n`;

        bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);

        res.json({
            status: true,
            data: transaction
        })
    },

    /* A function that is called when a user visits the /transactions/:id route. It finds a transaction
    with the hash that is in the URL and returns it. */
    get: async(req, res) => {
        let transaction = await Transactions.findOne({
            where: {
                hash: req.params.id
            }
        })

        if (!transaction) {
            res.json({
                status: false,
                message: 'Transaction not found'
            })
        }

        let coin_from = await Coins.findOne({
            where: {
                id: transaction.coinFrom
            }
        })
        let coin_to = await Coins.findOne({
            where: {
                id: transaction.coinTo
            }
        })
        res.json({
            status: true,
            data: { transaction, coin_from, coin_to }
        })
    },

    /* A function that is called when a user visits the /transactions/:id route. It finds a transaction
    	with the hash that is in the URL and returns it. */
    cancel: async(req, res) => {
        const transaction = await Transactions.findOne({
            where: {
                hash: req.params.id
            }
        })
        if (transaction.status == 'pending') {
            transaction.status = 'cancelled'
            transaction.save()
            res.json({
                status: true,
                data: transaction
            })
        } else {
            res.json({
                status: false,
                message: 'Transaction is not pending'
            })
        }
    }

}