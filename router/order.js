const express = require('express')
const router = express.Router()
const {List, Good,Order,Detail} = require('../db')
router.get('/getInfo', async (req, res) => {
    const list = await List.findAll()
    let goods = []
    // 查询同一种类的商品
    for (const listElement of list) {
        const good = await Good.findAll({
            where: {
                listId: listElement.id,
                state:'上架'
            },
        })
        goods.push(good)
    }
    res.send({
        code: 200,
        data: {
            list,
            goods,
        },
    })
})
router.post('/submitOrder', async (req, res) => {
    const {sum, num, note, goods} = req.body
    const openid = req.headers['x-wx-openid']
    const [user, created] = await User.findOrCreate({
        where: {
            openid: openid,
        },
    })
    if (Number(user.balance) < sum) {
        res.send({
            code: 500,
            data: {
                msg: '余额不足',
            },
        })
        return
    } else {
        // 扣除余额
        user.balance = Number(user.balance) - Number(sum)
        await user.save()

        // 创建订单
        const order = await Order.create({
            userId: user.id,
            sum,
            num,
            note,
        })
        for (const item of goods) {
            await Detail.create({
                OrderId: order.id,
                GoodId: item.id,
                num: item.num,
                actualPrice: item.price,
            })
        }
        res.send({
            code: 200,
            data: {
                msg: '订单提交成功',
            },
        })
    }

})

module.exports = router