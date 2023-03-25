const express = require('express')
const router = express.Router()
const {User} = require('../db')

router.get('/getUser', async (req, res) => {
    const openid = req.headers['x-wx-openid']
    let user = User.findAll({
        where: {
            openid: openid,
        },
    })

    if (!user) user = await User.create({openid: openid})
    res.send({
        code: 200,
        data: {
            openid: user.openid,
            balance:user.balance,
            user
        },
    })
})
module.exports = router