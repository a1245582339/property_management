var mysql = require('mysql');
var config = require('../config/default.js')        // 预先写好的数据库配置
//建立数据库连接池
var pool = mysql.createPool({   
    host: config.database.HOST,     // 数据库服务所在的端口号
    user: config.database.USERNAME, // 数据库用户名
    password: config.database.PASSWORD,     // 数据库密码
    database: config.database.DATABASE      // 数据库的名称
});
let query = function (sql, values) {    // 创建一个连接
    return new Promise((resolve, reject) => {   
        pool.getConnection(function (err, connection) {     // 连上之后执行如下方法
            if (err) {  // 如果没连上
                reject(err);    // 输出错误信息
            } else {    // 连上了的话
                connection.query(sql, values, (err, rows) => {      // 用这个连接查询数据库
                    if (err) {  // 如果报错了
                        reject(err);    // 把错误信息返回
                    } else {    // 如果没报错
                        resolve(rows);  // 把数据库返回的信息返回
                    }
                    connection.release(); //完成后直接释放资源。 
                    //query用来操作数据库表
                })
            }
        })
    })
}

exports.operateSql = (sql) => { 
    return query(sql)
}