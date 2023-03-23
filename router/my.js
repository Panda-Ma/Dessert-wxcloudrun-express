const express = require('express')
const {List, Good} = require("../db");
const router = express.Router()

router.get('/getUser', async (req, res) => {
    res.send({
        code: 200,
        data: {
            req:req
        },
    })
})
module.exports = router