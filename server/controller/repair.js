const model = require('../lib/mysql.js')

exports.getRepair = async ctx => {
    var query  = ctx.request.query
    var page = query.page || 0
    var limit = query.limit || 10
    var whereStr = Object.keys(query).reduce((total, curr) => {
        if(curr == 'page' || curr == 'limit') {
            return total
        }
        if(curr == 'title') {
            return [...total, `${curr} like "%${query[curr]}%"`]
        }
        return [...total, `${curr}="${query[curr]}"`]
    }, []).join(' and ')
    let $selectRepair = `select repair_list.*,user.name,user.tel,room_num from (user right join room on user.room_id=room.id) right join repair_list on repair_list.user_id=user.id ${whereStr.length ? 'where' + whereStr : ''} limit ${limit} offset ${page * limit}`
    console.log($selectRepair)
    await model.operateSql($selectRepair).then(res => {
        ctx.body = {code: 20000, msg: '维修列表', data: res}
    }).catch(err => {
        ctx.body = {code: -1, msg: '查询失败'}
    })
}

exports.creatRepair = async ctx =>  {
    var data = ctx.request.body
    
    let $createRepair = `insert into repair_list (title,status,photos,user_id,create_time) value ("${data.title}","1","${data.photos ? data.photos : ''}","${data.user_id}","${(new Date()).getTime()}")`
    await model.operateSql($createRepair).then(res => {
        ctx.body = {code: 20000, msg: '创建成功'}
    }).catch(err => {
        ctx.body = {code: -1, msg: '创建失败'}
    })
}

exports.updateRepair = async ctx =>  {
    var data = ctx.request.body
    let $updateRepair = `update repair_list set status="${data.status}"${data.price ? ',price='+data.price : ''}${data.status == 3 ? ',appointment_time='+(new Date()).getTime() : ''}${data.status == 5 ? ',pay_time='+(new Date()).getTime() : ''} where id="${data.id}"`
    await model.operateSql($updateRepair).then(res => {
    }).catch(err => {
        ctx.body = {code: -1, msg: '更新失败'}
    })
    if (data.status == 4 && data.part && data.part.length) {
        let inserArr = data.part.map(item => {
            return `(${data.id},${item.part_id},${item.count})`
        })
        let $createRepairOrder = `insert into part_order (repair_id,part_id,count) value ${inserArr.toString()}`
        await model.operateSql($createRepairOrder).then(res => {
            ctx.body = {code: 20000, msg: '更新成功'}
        })
    } else {
        ctx.body = {code: 20000, msg: '更新成功'}
    }
}