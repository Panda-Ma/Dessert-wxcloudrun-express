const express = require('express')
const router = express.Router()
const {User} = require('../db')

router.get('/getUser', async (req, res) => {
    const openid = req.headers['x-wx-openid']
    let user = User.findAll({
        where: {
            name: openid,
        },
    })

    if (!user) user = await User.create({name: openid})
    res.send({
        code: 200,
        data: {
            openid: user.openid,
            balance:user.balance
        },
    })
})
module.exports = router