const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const {init: initDB} = require("./db");
const logger = morgan("tiny");
const app = express();

const index = require('./router/index.js')
const order = require('./router/order.js')
const my = require('./router/my.js')


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(logger);

// 导入路由
app.use('/', index)
app.use('/order', order)
app.use('/my', my)

const port = process.env.PORT || 80;

async function bootstrap() {
    await initDB();
    app.listen(port, () => {
        console.log("Express启动成功:", port);
    });
}

bootstrap();
