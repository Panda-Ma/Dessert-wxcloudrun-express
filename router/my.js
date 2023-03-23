const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    res.send({
        code: 200,
        data: {
            openId: req.headers['X-WX-OPENID'],
        },
    })
})
module.exports = router