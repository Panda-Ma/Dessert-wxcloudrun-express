const express = require('express')
const router = express.Router()
const {List, Good} = require('../db')
router.get('/order/getInfo', async (req, res) => {
    const list = await List.findAll()
    let goods = []
    // 查询同一种类的商品
    for (const listElement of list) {
        const good = await Good.findAll({
            where: {
                id: listElement.id,
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

module.exports = router