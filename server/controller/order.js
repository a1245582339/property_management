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
    let $selectCount = `select count(*) from part_order ${whereStr ? ' where ' + whereStr : ''}`    // 查询订单总数
    const count = await model.operateSql($selectCount)
    let $selectOrder = `select part_order.*,part.part_name,repair_list.title from part_order,part,repair_list where part_order.part_id=part.id and part_order.repair_id=repair_list.id ${whereStr.length ?  'and' + whereStr : ''} limit ${limit} offset ${page * limit}`
    // 查询订单列表
    await model.operateSql($selectOrder).then(res => {
        ctx.body = {
            code: 20000,
            msg: '订单列表',
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
    let $selectPart = `select count from part where id='${data.part_id} and isDel=0'`    // 查询零件的剩余量
    try {
        let surplus = (await model.operateSql($selectPart))[0].count    
        console.log(surplus)
        if (surplus >= data.count) {    // 如果剩余量比出库量大
            let $reducePart = `update part set count=count-${data.count} where id="${data.part_id}"`    // 减少零件库存
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


    let $createOrder = `insert into part_order (${Object.keys(data).join(',')}) value (${valueArr.join(',')})`  // 减少完库存之后创建订单
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