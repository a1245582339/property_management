const model = require('../lib/mysql.js')

exports.getRoom = async ctx => {
    var query = ctx.request.query
    let whereStr = Object.keys(query).reduce((total, curr) => {
        return [...total, `room.${curr}="${query[curr]}"`]
    }, []).join(' and ')
    let $selectRoom = `select room.*,user.name,user.nick_name,user.tel,user.role,user.isDel from room left join user on user.room_id=room.id and user.isDel=0 ${whereStr ? 'where' + whereStr : ''}order by room.id` 
    console.log($selectRoom)
    await model.operateSql($selectRoom).then(res => {
        res = res.filter(item => {
            return item.role != 0 && item.role != 1
        })
        
        ctx.body =  {
            code: 20000,
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