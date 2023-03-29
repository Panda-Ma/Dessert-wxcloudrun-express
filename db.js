const {Sequelize, DataTypes} = require("sequelize");

// 从环境变量中读取数据库配置
const {MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = ""} = process.env;

const [host, port] = MYSQL_ADDRESS.split(":");

// 连接数据库
const sequelize = new Sequelize("nodejs_demo", MYSQL_USERNAME, MYSQL_PASSWORD, {
    host,
    port,
    dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});

// 定义数据模型
const Counter = sequelize.define("Counter", {
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
});

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键',
    },
    openid: {
        type: DataTypes.STRING,
        comment: '小程序用户(openid)',
        unique: true,
    },
    balance: {
        type: DataTypes.DECIMAL(10, 1),
        comment: '余额',
        defaultValue: 0,
    },
    password: {
        type: DataTypes.STRING(30),
        comment: '密码',
        defaultValue: '',
    },
}, {
    timestamps: false,
})

const List = sequelize.define("List", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键',
    },
    name: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: false,
})

const Good = sequelize.define('Good', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键',
    },
    name: {
        type: DataTypes.STRING(20),
        comment: '商品名',
    },
    img: {
        type: DataTypes.STRING(500),
        defaultValue: 'https://bkimg.cdn.bcebos.com/pic/b3119313b07eca806538dba0e67580dda144ad342567?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UxMTY=,g_7,xp_5,yp_5',
        comment: '商品图片链接',
    },
    intro: {
        type: DataTypes.STRING(300),
        comment: '商品介绍',
    },
    price: {
        type: DataTypes.DECIMAL(10, 1),
        comment: '商品单价',
    },
    listId: {
        type: DataTypes.INTEGER,
        references: {
            model: List,
            key: 'id',
        },
        comment: '外键',
    },
    state: {
        type: DataTypes.STRING(20),
        defaultValue: '上架',
        comment: '商品上架状态 (上架/下架)',
    },
}, {
    timestamps: false,
})

const Coupon = sequelize.define("Coupon", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键',
    },
    userId: {
        type: DataTypes.INTEGER,
        comment: '兑换用户Id',
        references: {
            model: User,
            key: 'id',
        },
    },
    code: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        comment: 'UUID优惠卷卷码',
    },
    isValid: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: '是否有效',
    },
    limit: {
        type: DataTypes.DECIMAL(10, 1),
        comment: '额度',
        defaultValue: 100,
    },
}, {
    timestamps: false,
})
const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键',
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        comment: '下单用户id',
    },
    sum: {
        type: DataTypes.DECIMAL(10, 1),
        comment: '订单总价',
    },
    num: {
        type: DataTypes.INTEGER,
        comment: '商品总数',
    },
    note: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '订单备注',
    },
    state: {
        type: DataTypes.STRING(20),
        defaultValue: '进行中',
        comment: '订单状态(进行中/已完成)',
    },

}, {
    updateAt:false
})

const Detail = sequelize.define("Detail", {
    OrderId: { //大写
        type: DataTypes.INTEGER,
        comment: '订单id',
        references: {
            model: Order,
            key: 'id',
        },
    },
    GoodId: { //大写
        type: DataTypes.INTEGER,
        comment: '商品id',
        references: {
            model: Good,
            key: 'id',
        },
    },
    num: {
        type: DataTypes.INTEGER,
        comment: '商品个数',
    },
    actualPrice: {
        type: DataTypes.DECIMAL(10, 1),
        comment: '实际购买价格',
    },
}, {
    timestamps: false,
})
Order.belongsToMany(Good, {through: Detail})
Good.belongsToMany(Order, {through: Detail})

// 数据库初始化方法
async function init() {
    // 模型同步
    // await Counter.sync({ alter: true });

    // 一次同步所有模型
    await sequelize.sync({alter: true});
}

// 导出初始化方法和模型
module.exports = {
    init,
    Counter,
    List,
    Good,
    User,
    Coupon,
    Order,
    Detail,
};
