const express = require('express')
const router = express.Router()
const {User, Coupon} = require('../db')

router.get('/getUser', async (req, res) => {
    const openid = req.headers['x-wx-openid']

    const [user, created] = await User.findOrCreate({
        where: {
            openid: openid,
        },
    })
    res.send({
        code: 200,
        data: {
            openid: user.openid,
            balance: user.balance,
        },
    })
})
router.post('/redeem', async (req, res) => {
    const {code} = req.body
    let coupon = await Coupon.findAll({
        where: {
            code: code,
        },
    })
    if (JSON.stringify((coupon) === '{}')) {
        res.send({
            code: 200,
            data: {
                msg: '优惠卷无效',
            },
        })
    } else if (coupon[0].isValid) {
        coupon[0].isValid=false
        await coupon[0].save()
        res.send({
            code: 200,
            data: {
                msg: '兑换成功',
            },
        })
    } else {
        res.send({
            code: 200,
            data: {
                msg: '优惠卷已使用',
            },
        })
    }
})
module.exports = router