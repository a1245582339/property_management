const userModel = require('../lib/mysql.js')
const moment = require('moment')

exports.getUser = async ctx => {
    let data = ctx.request.query
    let sql = `select * from user where id="${data.id}";`
    await userModel.operateSql(sql)
        .then(result => {
            console.log('result'+JSON.stringify(result))
            ctx.body = [...result]
        }).catch(() => {
            ctx.body = 'error'
        })
}

exports.updateUser = async ctx => {
    let data = ctx.request.body
    let sql = `update user set name="${data.name}" where id="${data.id}";`
    console.log('result'+JSON.stringify(data))
    await userModel.operateSql(sql)
        .then(result => {
            // console.log('result'+JSON.stringify(result))
            ctx.body = result
        }).catch(() => {
            ctx.body = 'error'
        })
}