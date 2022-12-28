const { Transaction } = require('sequelize')
const Validator = require('validatorjs')
const Coins = require('../../models/Coins')

module.exports = {

    /* This is a function that is called when the user requests all coins. */
    getCoins: async(req, res) => {
        const coins = await Coins.findAll()
        res.send({
            status: true,
            data: coins
        })
    },

    /* A function that is called when the user requests a coin by id. */
    getCoin: async(req, res) => {
        const coin = await Coins.findOne({
            where: {
                id: req.params.id
            }
        })
        res.send({
            status: true,
            data: coin
        })
    },

    /* This is a function that is called when the user requests a coin by id. */
    deleteCoin: async(req, res) => {
        const coin = await Coins.findOne({
            where: {
                id: req.params.id
            }
        })

        await Transaction.destroy({
            where: {
                coinFrom: coin.id
            }
        })

        await Transaction.destroy({
            where: {
                coinTo: coin.id
            }
        })

        await coin.destroy()
        res.send({
            status: true,
            data: coin
        })
    },

    /* This is a function that is called when the user requests a coin by id. */
    updateCoin: async(req, res) => {
        const coin = await Coins.findOne({
            where: {
                id: req.params.id
            }
        })
        coin.name = req.body.name
        coin.symbol = (req.body.symbol).toLowerCase()
        coin.price = req.body.price
        coin.percent = req.body.percent
        coin.wallet = req.body.wallet
        coin.network = req.body.network
        coin.min_amount = req.body.min_amount
        await coin.save()
        res.send({
            status: true,
            data: coin
        })
    },

    /* This is a function that is called when the user requests a coin by id. */
    createCoin: async(req, res) => {
        const params = req.body
        const rules = {
            name: 'required',
            symbol: 'required',
            percent: 'required',
            wallet: 'required',
            network: 'required',
            min_amount: 'required'
        }
        const validation = new Validator(params, rules)
        if (validation.fails()) {
            return res.json({
                status: false,
                errors: validation.errors.errors,
            })
        }
        const coin = await Coins.create({
            name: req.body.name,
            symbol: (req.body.symbol).toLowerCase(),
            percent: req.body.percent,
            wallet: req.body.wallet
        })
        res.send({
            status: true,
            data: coin
        })
    }

}