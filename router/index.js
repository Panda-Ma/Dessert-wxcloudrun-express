const path = require("path");
const express = require('express')
const router = express.Router()
const { Counter } = require("../db");

// 首页
router.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 更新计数
router.post("/api/count", async (req, res) => {
    const { action } = req.body;
    if (action === "inc") {
        await Counter.create();
    } else if (action === "clear") {
        await Counter.destroy({
            truncate: true,
        });
    }
    res.send({
        code: 200,
        data: await Counter.count(),
    });
});

// 获取计数
router.get("/api/count", async (req, res) => {
    const result = await Counter.count();
    res.send({
        code: 200,
        data: result,
    });
});

// 小程序调用，获取微信 Open ID
router.get("/api/wx_openid", async (req, res) => {
    if (req.headers["x-wx-source"]) {
        res.send(req.headers["x-wx-openid"]);
    }
});

module.exports = router