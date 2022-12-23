const Coins = require('../models/Coins')

module.exports = {

    /* This is a function that is called when the user requests all coins. */
    getUserCoins: async(req, res) => {
        let coins = await Coins.findAll({
            orderBy: ['id', 'ASC']
        })
        res.json({
            status: 'success',
            data: coins
        })
    },

    /* A function that is called when the user requests a coin by id. */
    getUserCoin: async(req, res) => {
        const coin = await Coins.findOne({
            where: {
                id: req.params.id
            }
        })
        res.json({
            status: 'success',
            data: coin
        })
    }

}