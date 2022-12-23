const Users = require('../../models/Users');
const Validator = require('validatorjs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {

    /* A function that is used to login a user. */
    login: async(req, res) => {
        const params = req.body
        const rules = {
            email: 'required',
            password: 'required',
        }
        const validation = new Validator(params, rules)
        if (validation.fails()) {
            return res.json({
                status: false,
                errors: validation.errors.errors,
            })
        }
        let user = await Users.findOne({ where: { email: params.email } })
        if (!(user && (await bcrypt.compare(params.password, user.password)))) {
            return res.json({
                status: false,
                message: 'Login or password is incorrect',
            })
        }
        user = await Users.findOne({
            where: { email: params.email },
            attributes: ['id', 'email', 'createdAt'],
        })
        let token = jwt.sign({ user_id: user.id, email: params.email }, process.env.JWT_SECRET_KEY || 'bf5a14b224ff99991ed15223015970d5', { expiresIn: '2h' })
        return res.json({
            status: true,
            data: {
                user: user,
                access_token: token,
            },
        })
    },

    /* A function that is used to get the user's information. */
    me: async(req, res) => {
        const user = await Users.findOne({
            where: { id: req.user.id },
            attributes: ['id', 'email', 'createdAt'],
        })
        return res.json({
            status: true,
            user: user
        })
    }

}