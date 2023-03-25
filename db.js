const { Sequelize, DataTypes } = require("sequelize");

// 从环境变量中读取数据库配置
const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = "" } = process.env;

const [host, port] = MYSQL_ADDRESS.split(":");

// 连接数据库
const sequelize = new Sequelize("nodejs_demo", MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port,
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});

// 定义数据模型
const Counter=sequelize.define("Counter", {
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

const User=sequelize.define("User",{
  id:{
    type: DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    comment:'主键'
  },
  openid: {
    type: DataTypes.STRING,
    comment: '用户名(openid)',
    unique:true
  },
  balance:{
    type: DataTypes.DECIMAL(10,1),
    comment: '余额',
    defaultValue:0
  },
  password:{
    type:DataTypes.STRING(30),
    comment:'密码',
    defaultValue:''
  }
},{
  timestamps: false
})

const List=sequelize.define("List",{
  id:{
    type: DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    comment:'主键'
  },
  name:{
    type:DataTypes.STRING
  }
},{
  timestamps: false
})

const Good=sequelize.define('good',{
  id:{
    type: DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    comment:'主键'
  },
  name:{
    type:DataTypes.STRING(20),
    comment:'商品名'
  },
  img:{
    type:DataTypes.STRING(500),
    defaultValue: 'https://bkimg.cdn.bcebos.com/pic/b3119313b07eca806538dba0e67580dda144ad342567?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UxMTY=,g_7,xp_5,yp_5',
    comment:'商品图片链接'
  },
  intro: {
    type: DataTypes.STRING(300),
    comment: '商品介绍',
  },
  price: {
    type: DataTypes.DECIMAL(10,1),
    comment: '商品单价',
  },
  listId:{
    type:DataTypes.INTEGER,
    references:{
      model:List,
      key:'id'
    },
    comment:'外键'
  }
},{
  timestamps: false
})

// 数据库初始化方法
async function init() {
  // 模型同步
  // await Counter.sync({ alter: true });

  // 一次同步所有模型
  await sequelize.sync({ alter: true });
}

// 导出初始化方法和模型
module.exports = {
  init,
  Counter,
  List,
  Good,
  User
};
