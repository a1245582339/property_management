const model = require('../lib/mysql.js')

exports.getRoom = async ctx => {
    var id = ctx.request.query.id
    let $selectRoom = `select * from room ${id ? 'where id=' + id : ''}`
    await model.operateSql($selectRoom).then(res => {
        ctx.body =  {
            code: 2000,
            msg: '房间信息',
            data: res
        }
    }).catch(err => {
        ctx.body = {
            code: -1,
            msg: '查询失败'
        }
    })
}