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
        code:200,
        data:arr
    })
})
// 点心
router.get('/good/getAll',async (req,res)=>{
    const good=await Good.findAll()
    let arr=[]
    for(const item of good){
        const list=await List.findByPk(item.listId)
        arr.push({
            item,list:list.name
        })
    }
    res.send({
        code:200,
        data:arr,
        flag:Array.isArray(good[0])
    })
})

module.exports = router