const model = require('../lib/mysql.js')
exports.getOrder = async ctx => {
    var query = ctx.request.query
    var page = query.page || 0
    var limit = query.limit || 10
    var whereStr = Object.keys(query).reduce((total, curr) => {
        if (curr == 'page' || curr == 'limit') {
            return total
        }
    }, []).join(' and ')
    let $selectCount = `select count(*) from part_order ${whereStr ? ' where ' + whereStr : ''}`
    const count = await model.operateSql($selectCount)
    let $selectOrder = `select part_order.*,part.part_name,repair_list.title from part_order,part,repair_list where part_order.part_id=part.id and part_order.repair_id=repair_list.id ${whereStr.length ?  'and' + whereStr : ''} limit ${limit} offset ${page * limit}`
    await model.operateSql($selectOrder).then(res => {
        ctx.body = {
            code: 20000,
            msg: '零件列表',
            data: res,
            total: count[0]['count(*)']
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