const model = require('../lib/mysql.js')
const formidable = require('formidable');
const fs = require("fs");

exports.getRepair = async ctx => {
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
    let $selectRepair = `select repair_list.*,user.name,user.tel,room_num from (user right join room on user.room_id=room.id) right join repair_list on repair_list.user_id=user.id ${whereStr.length ? ' where ' + whereStr : ''} order by status desc limit ${limit} offset ${page * limit}`
    await model.operateSql($selectRepair).then(res => {
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

exports.creatRepair = async ctx => {
    var data = ctx.request.body
    
    let $createRepair = `insert into repair_list (title,status,photos,user_id,create_time) value ("${data.title}","1",'${data.photos ? data.photos : ''}',"${data.user_id}","${(new Date()).getTime()}")`
    console.log($createRepair)
    await model.operateSql($createRepair).then(res => {
        ctx.body = {
            code: 20000,
            msg: '创建成功'
        }
    }).catch(err => {
        console.log(err)
        ctx.body = {
            code: -1,
            msg: '创建失败'
        }
    })
}

exports.updateRepair = async ctx => {
    var data = ctx.request.body
    let $updateRepair = `update repair_list set status="${data.status}"${data.price ? ',price='+data.price : ''}${data.status == 3 ? ',appointment_time='+(new Date()).getTime() : ''}${data.status == 5 ? ',pay_time='+(new Date()).getTime() : ''} where id="${data.id}"`
    await model.operateSql($updateRepair).then(res => {}).catch(err => {
        ctx.body = {
            code: -1,
            msg: '更新失败'
        }
    })
    if (data.status == 4 && data.part && data.part.length) {
        let inserArr = data.part.map(item => {
            return `(${data.id},${item.part_id},${item.count})`
        })
        let $createRepairOrder = `insert into part_order (repair_id,part_id,count) value ${inserArr.toString()}`
        await model.operateSql($createRepairOrder).then(res => {
            ctx.body = {
                code: 20000,
                msg: '更新成功'
            }
        })
    } else {
        ctx.body = {
            code: 20000,
            msg: '更新成功'
        }
    }
}

exports.uploadImage = async ctx => {
    var imgData = ctx.request.body;
    //过滤data:URL
    var path = [];
    for (let i = 0; i < imgData.length; i++) {
        let base64Data = imgData[i].replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = new Buffer(base64Data, 'base64');
        let randomName = '/img/repair' + (new Date()).getTime() + parseInt(Math.random() * 8999 + 10000) + '.png';
        await fs.writeFile('./files' + randomName, dataBuffer, function (err) {
            if (err) {
                console.log(err);
            }
        });
        path[i] = randomName
    }

    ctx.body = {
        code: 20000,
        msg: '更新成功',
        data: {
            path: path
        }
    }
}