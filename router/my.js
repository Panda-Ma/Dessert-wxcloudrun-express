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
router.get('/createCoupon',async (req,res)=>{
    const coupon=await Coupon.create({})
    res.send({
        code:200,
        data:{
            msg:'创建成功'
        }
    })
})
router.post('/redeem', async (req, res) => {
    const {code} = req.body
    let coupon = await Coupon.findAll({
        where: {
            code: code,
        },
    })
    if (JSON.stringify(coupon) === '{}') {
        res.send({
            code: 200,
            data: {
                msg: '优惠卷无效',
            },
        })
    } else if (coupon[0].isValid) { //优惠卷有效
        const openid = req.headers['x-wx-openid']
        const user=await User.findAll({
            where:{
                openid:openid
            }
        })
        //修改账户余额
        user[0].balance+=coupon[0].limit
        await user[0].save()
        //修改优惠卷信息
        coupon[0].userId=user[0].id
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