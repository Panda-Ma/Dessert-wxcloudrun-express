const express = require('express')
const router = express.Router()
const {User} = require('../db')

router.get('/getUser', async (req, res) => {
    const openid = req.headers['x-wx-openid']
    let user = await User.findAll({
        where: {
            openid: openid,
        },
    })

    if (JSON.stringify(user) === '{}') user = await User.create({openid: openid})
    res.send({
        code: 200,
        data: {
            openid: user[0].openid,
            balance: user[0].balance,
        },
    })
})
module.exports = router