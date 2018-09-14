const model = require('../lib/mysql.js')

exports.getRoom = async ctx => {
    var query = ctx.request.query
    let whereStr = Object.keys(query).reduce((total, curr) => {
        return [...total, `${curr}="${query[curr]}"`]
    }, []).join(' and ')
    let $selectRoom = `select * from room ${whereStr ? 'where ' + whereStr : ''}`
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