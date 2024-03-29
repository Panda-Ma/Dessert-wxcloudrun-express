const express = require('express')
const router = express.Router()
const {Op} = require("sequelize");
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
    const dessertNum = await Good.count()
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
            id: item.id,
            name: item.name,
            img: item.img,
            intro: item.intro,
            price: Number(item.price),
            listId: item.listId,
            state: item.state,
            list: list.name,
        })
    }
    res.send({
        code: 200,
        data: arr,
    })
})

router.get('/good/search', async (req, res) => {
    const keyword = req.query.keyword
    const good = await Good.findAll(
        {
            where: {
                name: {
                    [Op.substring]: keyword,
                },
            },
        },
    )
    let arr = []
    for (const item of good) {
        const list = await List.findByPk(item.listId)
        // item是类数组，有prototype上的属性. 无论什么方式都不能遍历自身属性 来构造一个对象
        arr.push({
            id: item.id,
            name: item.name,
            img: item.img,
            intro: item.intro,
            price: Number(item.price),
            listId: item.listId,
            state: item.state,
            list: list.name,
        })
    }
    res.send({
        code: 200,
        data: arr,
    })

})

router.get('/good/getList', async (req, res) => {
    const list = await List.findAll()
    res.send({
        code: 200,
        data: list,
    })
})
router.post('/good/add', async (req, res) => {
    let {name, img, intro, price, listId, state} = req.body
    const good = await Good.create({
        name, img, intro, price, listId, state,
    })
    res.send({
        code: 200,
        msg: '添加成功',
        data: good,
    })
})
router.post('/good/edit', async (req, res) => {
    let {id, name, img, intro, price, listId, state} = req.body
    await Good.update({name, img, intro, price, listId, state}, {
        where: {
            id: id,
        },
    })
    res.send({
        code: 200,
        msg: '修改成功',
    })
})

router.post('/good/category', async (req, res) => {
    let {name} = req.body
    const list = await List.create({
        name,
    })
    res.send({
        code: 200,
        data: list,
    })
})

// 订单order
router.get('/order/getAll', async (req, res) => {
    const order = await Order.findAll()
    res.send({
        code: 200,
        data: order,
    })
})
router.get('/order/search', async (req, res) => {
    const keyword = req.query.keyword
    let order = []
    if (keyword == '') {
        order = await Order.findAll()
    } else {
        order = await Order.findAll({
            where: {
                id: keyword,
            },
        })
    }
    res.send({
        code: 200,
        data: order,
    })
})
router.get('/order/searchIncomplete', async (req, res) => {
    let order = await Order.findAll({
        where: {
            state: '进行中',
        },
    })
    res.send({
        code: 200,
        data: order,
    })
})
router.post('/order/setOrderCompleted', async (req, res) => {
    let {id} = req.body
    const order = await Order.update({
        state: '已完成',
    }, {
        where: {
            id,
        },
    })
    res.send({
        code: 200,
        data: order,
    })
})

// 优惠卷coupon
router.get('/coupon/getAll', async (req, res) => {
    const coupon = await Coupon.findAll()
    res.send({
        code: 200,
        data: coupon,
    })
})
router.get('/coupon/search', async (req, res) => {
    const keyword = req.query.keyword
    let coupon = []
    if (keyword == '') {
        coupon = await Coupon.findAll()
    } else {
        coupon = await Coupon.findAll({
            where: {
                code: {
                    [Op.substring]: keyword,
                },
            },
        })
    }
    res.send({
        code: 200,
        data: coupon,
    })
})

router.post('/coupon/add', async (req, res) => {
    let {num, limit} = req.body
    for (let i = 0; i < num; i++) {
        await Coupon.create({
            limit,
        })
    }
    res.send({
        code: 200,
        msg: '生成成功',
    })
})
module.exports = router
