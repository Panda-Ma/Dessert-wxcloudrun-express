const express = require('express')
const router = express.Router()
const {List, Good, Order, Detail, User} = require('../db')
// 查询已上架商品列表
router.get('/getInfo', async (req, res) => {
    const list = await List.findAll()
    let goods = []
    // 查询同一种类的商品
    for (const listElement of list) {
        const good = await Good.findAll({
            where: {
                listId: listElement.id,
                state: '上架',
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

router.get('/getOrder', async (req, res) => {
    const openid = req.headers['x-wx-openid']
    const [user, created] = await User.findOrCreate({
        where: {
            openid: openid,
        },
    })
    const order = await Order.findAll({
        where: {
            userId: user.id,
        },
    })
    if (JSON.stringify(order) === '{}') {
        res.send({
            code: 500,
            data: {
                order: [],
                msg: '未有订单',
            },
        })
    } else {
        res.send({
            code: 200,
            data: {
                order: order.reverse(),
            },
        })
    }
})

router.get('/getOrderDetail', async (req, res) => {
    const {orderId} = req.params
    res.send({
        data:{orderId}
    })
    return
    const order = await Order.findAll({
        where: {
            id:orderId,
        },
    })
    const detail = await Detail.findAll({
        where: {
            OrderId: orderId,
        },
    })
    const goods = []
    for (const item of detail) {
        const good = await Good.findAll({
            where: {
                id: item.GoodId,
            },
        })
        goods.push({
            id: item.GoodId,
            num: item.num,
            price: item.actualPrice,
            name: good[0].name,
            img: good[0].img,
            intro: good[0].intro,
        })
    }
    res.send({
        code: 200,
        data: {
            order: order[0],
            goods,
        },
    })
})
module.exports = router