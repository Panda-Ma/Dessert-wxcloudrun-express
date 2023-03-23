const express = require('express')
const router = express.Router()

router.get('/getUser', async (req, res) => {
    const test=req.headers['x-wx-openid']
    res.send({
        code: 200,
        data: {
            req:test
        },
    })
})
module.exports = router