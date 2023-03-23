const express = require('express')
const router = express.Router()

router.get('/getUserInfo', async (req, res) => {
    // console.log(req);
    res.send({
        code: 200,
        data: {
            // openId: req.headers['X-WX-OPENID'],
            req:req,
        },
    })
})
module.exports = router