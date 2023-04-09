const express = require('express')
const router = express.Router()
const {List, Good, Order, Detail, User,Coupon} = require('../db')

router.post('/login',async (req,res)=>{
    const {userName,password}=req.body
    if(userName=='admin'&&password=="admin"){
        res.send({
            code:200,
            data:{
            },
            msg:'登陆成功'
        })
    }else{
        res.send({
            code:500,
            data: {},
            msg:'账户或密码错误'
        })
    }
})
module.exports = router
