const express = require('express')
const router = express.Router()

router.get('/getUser', async (req, res) => {
    res.send({
        code: 200,
        data: {
            req:1
        },
    })
})
module.exports = router