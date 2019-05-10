const model = require('../lib/mysql.js')

exports.getRoom = async ctx => {
    var query = ctx.request.query
    let whereStr = Object.keys(query).reduce((total, curr) => {
        return [...total, `room.${curr}="${query[curr]}"`]
    }, []).join(' and ')
    let $selectRoom = `select room.*,user.name,user.nick_name,user.tel,user.role,user.isDel from room left join user on user.room_id=room.id and user.isDel=0 ${whereStr ? 'and' + whereStr : ''} order by room.id` 
    // 查询房间列表
    console.log($selectRoom)
    await model.operateSql($selectRoom).then(res => {
        // res = res.filter(item => {
        //     return item.role != 0 && item.role != 1
        // })
        res = res.reduce((total, curr) => {
            if (total.find(item => curr.id === item.id)) {
                return total
            }
            let item 
            if (curr.role === 0 || curr.role === 1 ) {  // 如果不是业主
                const { id, room_num, building, area } = curr 
                item = { id, room_num, building, area }
            } else {    // 如果是业主
                item = curr // 直接返回
            }
            return [...total, item]
        }, [])
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