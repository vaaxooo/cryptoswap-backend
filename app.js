require('dotenv-flow').config()
const express = require('express')
const axios = require('axios');
const { MySQL } = require('./api/modules/MySQL')
const Coins = require('./api/models/Coins')

const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const { create, cancel, get, paid } = require('./api/services/TransactionService')
const { getTransactions, getTransaction, setStatus } = require('./api/services/admin/TransactionService')

const { getUserCoins, getUserCoin } = require('./api/services/CoinService')
const { getCoins, getCoin, deleteCoin, updateCoin, createCoin } = require('./api/services/admin/CoinService')
const { login, me } = require('./api/services/admin/UserService')

const Authorized = require('./api/middlewares/Authorized')

app.use('/admin', Authorized)

/* ############################################################ */


app.get('/transactions/:id', get)
app.get('/transactions/:id/cancel', cancel)
app.get('/transactions/:id/paid', paid)
app.post('/transactions', create)

app.get('/coins', getUserCoins)
app.get('/coins/:id', getUserCoin)

/* ########################## ADMIN ROUTES ################################## */
app.get('/admin/transactions', getTransactions)
app.get('/admin/transactions/:id', getTransaction)
app.post('/admin/transactions/:id/status', setStatus)

app.get('/admin/coins', getCoins)
app.get('/admin/coins/:id', getCoin)
app.delete('/admin/coins/:id', deleteCoin)
app.post('/admin/coins', createCoin)
app.patch('/admin/coins/:id', updateCoin)


app.post('/auth/login', login)
app.post('/admin/auth/me', me)

/* ############################################################ */

refreshCoins = async() => {
    const coins = await Coins.findAll()
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i]
        const { symbol } = coin
        if (symbol === 'usdt' || symbol === 'usdc' || symbol === 'busd') {
            coin.current_price = 1
            await coin.save()
            continue
        }
        const binanceCoin = (await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${(symbol).toUpperCase()}USDT`)).data
        coin.current_price = (+binanceCoin.price - (+binanceCoin.price * coin.percent / 100)).toFixed(2)
        await coin.save()
    }
}

const port = process.env.PORT || 3000
app.listen(port, async() => {
    await MySQL.sync()

    setInterval(async() => {
        await refreshCoins()
    }, 180000)

    console.log(`Example app listening at http://localhost:${port}`)
})