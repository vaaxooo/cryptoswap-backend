const axios = require('axios')
const Coins = require('../models/Coins')

module.exports = {

    /* This is a function that is called when the user requests all coins. */
    getUserCoins: async(req, res) => {
        let coins = await Coins.findAll({
            orderBy: ['id', 'ASC']
        })

        for (let i = 0; i < coins.length; i++) {
            let coin = coins[i].dataValues
            if (coin.symbol == 'usdt') {
                coin.current_price = 1
                continue
            }
            const binanceCoin = (await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${(coin.symbol).toUpperCase()}USDT`)).data
            coin.current_price = (+binanceCoin.price - (+binanceCoin.price * coin.percent / 100)).toFixed(2)
        }

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