var model = require('../lib/mysql.js')

exports.getPart = async ctx => {
    var query = ctx.request.query
    var page = query.page || 0
    var limit = query.limit || 10
    var whereStr = Object.keys(query).reduce((total, curr) => {
        if(curr == 'page' || curr == 'limit') {
            return total
        }
        if(curr == 'part_name') {
            return [...total, `${curr} like "%${query[curr]}%"`]
        } else {
            return [...total, `${curr}="${query[curr]}"`]
        }
    }, []).join(' and ')
    let $selectPart = `select part.*,part_type.type_name from part left join part_type on part.type_id=part_type.id where part.isDel=0 ${whereStr ? 'and ' + whereStr : ''} limit ${limit} offset ${page * limit}`
    await model.operateSql($selectPart).then(res => {
        ctx.body = {code: 20000, msg: '零件列表', data: res}
    }).catch(err => {
        ctx.body = {code: -1, msg: '查询失败'}
    })
}

exports.updatePart = async ctx => {
    var data = ctx.request.body
    if (data.id) {
        let setStr = Object.keys(data).reduce((total ,curr) => {
            if (curr == 'id') {
                return total
            }
            return [...total, ` ${curr}="${data[curr]}" `]
        }, []).toString()
        var $sql = `update part set ${setStr} where id="${data.id}"`
    } else {
        let insertStr = Object.values(data).map(item => `"${item}"`).toString()
        var $sql = `insert into part (${Object.keys(data).toString()}) value (${insertStr})`
    }
    // console.log($sql)
    await model.operateSql($sql).then(res => {
        ctx.body = {code: 20000, msg: '更新成功'}
    }).catch(err => {
        ctx.body = {code: -1, msg: '更新失败'}
    })
}

exports.getPartType = async ctx => {
    let $selectPartTpye = `select * from part_type where isDel="0"`
    await model.operateSql($selectPartTpye).then(res => {
        ctx.body = {code: 20000, msg: '零件类型列表', data: res}
    }).catch(err => {
        ctx.body = {code: -1, msg: '查询失败'}
    })
}

exports.updatePartType = async ctx => {
    var data = ctx.request.body
    if (data.id) {
        let setStr = Object.keys(data).reduce((total ,curr) => {
            if (curr == 'id') {
                return total
            }
            return [...total, ` ${curr}="${data[curr]}" `]
        }, []).toString()
        if (data.isDel) {
            var $delPart = `update part set isDel="1" where type_id="${data.id}"`
            await model.operateSql($delPart)
        }
        var $sql = `update part_type set ${setStr} where id="${data.id}"`
    } else {
        let insertStr = Object.values(data).map(item => `"${item}"`).toString()
        var $sql = `insert into part_type (${Object.keys(data).toString()}) value (${insertStr})`
    }
    console.log($sql)
    await model.operateSql($sql).then(res => {
        ctx.body = {code: 20000, msg: '更新成功'}
    }).catch(err => {
        ctx.body = {code: -1, msg: '更新失败'}
    })
}