require('dotenv-flow').config()
const express = require('express')
const { MySQL } = require('./api/modules/MySQL')

const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const { create, cancel, get } = require('./api/services/TransactionService')
const { getTransactions, getTransaction, setStatus } = require('./api/services/admin/TransactionService')

const { getUserCoins, getUserCoin } = require('./api/services/CoinService')
const { getCoins, getCoin, deleteCoin, updateCoin, createCoin } = require('./api/services/admin/CoinService')
const { login, me } = require('./api/services/admin/UserService')

const Authorized = require('./api/middlewares/Authorized')

app.use('/admin', Authorized)

/* ############################################################ */


app.get('/transactions/:id', get)
app.get('/transactions/:id/cancel', cancel)
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
const port = process.env.PORT || 3000
app.listen(port, async() => {
    await MySQL.sync()
    console.log(`Example app listening at http://localhost:${port}`)
})