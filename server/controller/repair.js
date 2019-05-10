const model = require('../lib/mysql.js')
const fs = require("fs");
const os = require("os");
// const hostname = os.networkInterfaces().WLAN.find(item => item.family == 'IPv4').address

exports.getRepair = async ctx => {
    var query = ctx.request.query
    var page = query.page || 0
    var limit = query.limit || 10
    if (query.room_id) {
        let user_ids = (await model.operateSql(`select id from user where room_id=${query['room_id']}`)).map(item => item.id)
        var userStr = user_ids.reduce((total, curr) => {
            return [...total, `user_id=${curr}`]
        }, []).join(' or ')
    }
    var whereStr = Object.keys(query).reduce((total, curr) => {
        if (curr == 'page' || curr == 'limit') {
            return total
        }
        if (curr == 'room_id') {
            return [...total, `(${userStr})`]
        }
        if (curr == 'title') {
            return [...total, `${curr} like "%${query[curr]}%"`]
        }
        return [...total, `${curr}="${query[curr]}"`]
    }, []).join(' and ')
    let $selectCount = `select count(*) from repair_list ${whereStr.length ? ' where ' + whereStr : ''}`    // 获取报修总数
    console.log($selectCount)
    const count = await model.operateSql($selectCount)
    let $selectRepair = `select repair_list.*,user.name,user.tel,room_num,building from (user right join room on user.room_id=room.id) right join repair_list on repair_list.user_id=user.id ${whereStr.length ? ' where ' + whereStr : ''} order by status desc limit ${limit} offset ${page * limit}`
    // 查询报修信息列表
    await model.operateSql($selectRepair).then(res => {
        for (let i = 0; i < res.length; i++) {
            if (res[i].photos) {
                res[i].photos = JSON.stringify(JSON.parse(res[i].photos).map(item => `http://localhost:3000${item}`))
                // 把每个图片路径前面加上ip和端口号
            }
        }
        ctx.body = {
            code: 20000,
            msg: '维修列表',
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

exports.creatRepair = async ctx => {
    var data = ctx.request.body

    let $createRepair = `insert into repair_list (title,status,photos,user_id,create_time) value ("${data.title}","1",'${data.photos ? data.photos : ''}',"${data.user_id}","${(new Date()).getTime()}")`
    // 创建报修信息
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
    // 更新报修信息状态、价格和时间
    await model.operateSql($updateRepair).then(res => {}).catch(err => {
        ctx.body = {
            code: -1,
            msg: '更新失败'
        }
    })
    if (data.status == 4 && data.part && data.part.length) {    // 如果报修状态到了已维修，并且用到了零件
        let inserArr = data.part.map(item => {
            return `(${data.id},${item.part_id},${item.count})`
        })
        let $createRepairOrder = `insert into part_order (repair_id,part_id,count) value ${inserArr.toString()}`
        // 订单表创建一条订单
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
        let base64Data = imgData[i].replace(/^data:image\/\w+;base64,/, "");    // 把前端发来的base64转为图片
        let dataBuffer = new Buffer(base64Data, 'base64');  // 转换为buffer
        let randomName = '/img/repair' + (new Date()).getTime() + parseInt(Math.random() * 8999 + 10000) + '.png';  // 生成随机名称
        await fs.writeFile('./files' + randomName, dataBuffer, function (err) { // 写入文件
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