const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB } = require("./db");
const logger = morgan("tiny");
const app = express();

const index=require('./router/index')
const order=require('./router/order')


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 导入路由
app.use('/',index)
app.use('/order',order)

const port = 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("Express启动成功:", port);
  });
}

bootstrap();
