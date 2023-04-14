const express = require('express')
const router = express.Router()
const {List, Good, Order, Detail, User, Coupon, Counter} = require('../db')

router.post('/login', async (req, res) => {
    const {userName, password} = req.body
    if (userName == 'admin' && password == "admin") {
        res.send({
            code: 200,
            data: {},
            msg: '登陆成功',
        })
    } else {
        res.send({
            code: 500,
            data: {},
            msg: '账户或密码错误',
        })
    }
})

router.get("/home/getNum", async (req, res) => {
    const dessertNum = await Counter.count()
    const userNum = await User.count()
    const orderNum = await Order.count()
    res.send({
        code: 200,
        data: {
            dessertNum, userNum, orderNum,
        },
    })
})

router.get('/home/getDessertNum', async (req, res) => {
    const list = await List.findAll()
    let arr = []
    for (const listitem of list) {
        const num = await Good.count({
            where: {
                listId: listitem.id,
            },
        })
        arr.push({
            name: listitem.name,
            num: num,
        })
    }
    res.send({
        code: 200,
        data: arr,
    })
})
// 点心
router.get('/good/getAll', async (req, res) => {
    const good = await Good.findAll()
    let arr = []
    for (const item of good) {
        const list = await List.findByPk(item.listId)
        // item是类数组，有prototype上的属性. 无论什么方式都不能遍历自身属性 来构造一个对象
        arr.push({
            id:item.id,
            name: item.name,
            img: item.img,
            intro:item.intro,
            price:item.price,
            listId: item.listId,
            list:list.name
        })
    }
    res.send({
        code: 200,
        data: arr,
    })
})

module.exports = router
