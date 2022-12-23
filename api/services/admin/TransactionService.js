const Transactions = require('../../models/Transactions')
const Coins = require('../../models/Coins')

module.exports = {

    /* This is a function that is called when the user requests all transactions. */
    getTransactions: async(req, res) => {
        let transactions = await Transactions.findAll({
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 50
        })

        res.json({
            status: true,
            data: transactions
        })
    },

    /* A function that is called when the user requests a transaction by id. */
    getTransaction: async(req, res) => {
        const transaction = await Transactions.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!transaction) {
            return res.json({
                status: false,
                message: 'Transaction not found'
            })
        }
        const coin_from = await Coins.findOne({
            where: {
                id: transaction.coinFrom
            }
        })
        const coin_to = await Coins.findOne({
            where: {
                id: transaction.coinTo
            }
        })
        res.json({
            status: true,
            data: { transaction, coin_from, coin_to }
        })
    },

    /* This is a function that is called when the user requests a transaction by id. */
    setStatus: async(req, res) => {
        const transaction = await Transactions.findOne({
            where: {
                id: req.params.id
            }
        })
        transaction.status = req.body.status
        await transaction.save()
        res.json({
            status: true,
            data: transaction
        })
    }

}