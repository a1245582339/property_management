const model = require('../lib/mysql.js')
exports.getOrder = async ctx => {
    var query = ctx.request.query
    var page = query.page || 0
    var limit = query.limit || 10
    var whereStr = Object.keys(query).reduce((total, curr) => {
        if (curr == 'page' || curr == 'limit') {
            return total
        }
        if (curr == 'title') {
            return [...total, `${curr} like "%${query[curr]}%"`]
        }
        return [...total, `${curr}="${query[curr]}"`]
    }, []).join(' and ')
    let $selectRepair = `select repair_list.*,user.name,user.tel,room_num,building from (user right join room on user.room_id=room.id) right join repair_list on repair_list.user_id=user.id ${whereStr.length ? ' where ' + whereStr : ''} order by status desc limit ${limit} offset ${page * limit}`
    await model.operateSql($selectRepair).then(res => {
        for (let i = 0; i < res.length; i++) {
            if (res[i].photos) {
                res[i].photos = JSON.stringify(JSON.parse(res[i].photos).map(item => `http://${hostname}:3000${item}`))
            }
        }
        ctx.body = {
            code: 20000,
            msg: '维修列表',
            data: res
        }
    }).catch(err => {
        console.log(err)
        ctx.body = {
            code: -1,
            msg: '查询失败'
        }
    })
}

exports.createOrder = async ctx => {
    var data = ctx.request.body
    var valueArr = Object.values(data).reduce((total, curr) => {
        return [...total, `"${curr}"`]
    }, [])
    let $selectPart = `select count from part where id='${data.part_id} and isDel=0'`
    try {
        let surplus = (await model.operateSql($selectPart))[0].count
        console.log(surplus)
        if (surplus >= data.count) {
            let $reducePart = `update part set count=count-${data.count} where id="${data.part_id}"`
            try {
                await model.operateSql($reducePart)
            } catch (err) {
                throw err
            }
        } else {
            throw '库存不足'
        }
    } catch (err) {
        ctx.body = {
            code: -1,
            msg: err
        }
        return false
    }   


    let $createOrder = `insert into part_order (${Object.keys(data).join(',')}) value (${valueArr.join(',')})`
    try {
        await model.operateSql($createOrder)
        ctx.body = {
            code: 20000,
            msg: '出库成功'
        }
    } catch (err) {
        ctx.body = {
            code: -1,
            msg: '创建失败'
        }
    }
}