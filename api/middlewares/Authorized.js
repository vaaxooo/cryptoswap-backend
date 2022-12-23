const Users = require('../models/Users')
const jwt = require('jsonwebtoken')
const config = process.env

const verifyToken = async(req, res, next) => {
    if (req.path === '/admin/auth/login') return next()

    const token = req.headers.authorization.replace('Bearer ', '')
    if (!token) {
        return res.json({
            status: false,
            message: 'The token is required for authorization!',
        })
    }
    let user = jwt.verify(token, config.JWT_SECRET_KEY || 'bf5a14b224ff99991ed15223015970d5')
    user = await Users.findOne({ where: { id: user.user_id } })
    req.user = user
    return next()
}

module.exports = verifyToken