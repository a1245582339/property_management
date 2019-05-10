const model = require('../lib/mysql.js')
const moment = require('moment')

exports.login = async ctx => {
    let data = ctx.request.body
    let $selectUser = `select * from admin_user where name="${data.name}" and password="${data.password}" and isDel=0;`
    // 查询用户名密码匹配的人员数据
    let user = await model.operateSql($selectUser)
    if (user.length) {  // 如果找到了人
        let token = `${(new Date()).getTime()}token${data.name}`    // 创建一个token
        let $createToken = `insert into admin_token (token, deadline, admin_id) value ("${token}", "${(new Date()).getTime() + 604800000}", ${user[0].id})` // 把token存数据库
        await model.operateSql($createToken).then(res => {
            ctx.body = {
                code: 20000,
                msg: '创建token成功',
                data: {
                    token: token
                }
            }
        })
    } else {
        ctx.body = {
            code: 20003,
            msg: '用户名或密码错误'
        }
    }
}

exports.getUserInfo = async ctx => {    
    let token = ctx.request.query.token
    console.log(ctx)
    let $selectAdminId = `select admin_id from admin_token where token="${token}" and deadline>${(new Date()).getTime()}`   // 根据token在token表里找到这个用户
    let admin_id = await model.operateSql($selectAdminId)   
    let $selectUserInfo = `select * from admin_user where id=${admin_id[admin_id.length - 1].admin_id}` // 根据用户id查询用户信息
    await model.operateSql($selectUserInfo).then(res => {
        ctx.body = {
            code: 20000,
            msg: '用户信息',
            data: {
                user: res[0]
            }
        }
    }).catch(err => {
        ctx.body = {
            code: -1,
            msg: '登录失败'
        }
    })
}

exports.updateUser = async ctx => {
    let user = ctx.request.body
    var $sql

    if (user.id) {  // 如果请求的数据里有id，那么是更新
        let setStr = (Object.keys(user).reduce((total, curr) => {
            if (curr == 'id') {
                return total
            }
            return total.concat([`${curr}="${user[curr]}"`])
        }, [])).toString()
        $sql = `update admin_user set ${setStr} where id="${user.id}";` // 更新对应id的用户数据
    } else {    // 如果没有id，那么是创建
        $checkNameExist = `select * from admin_user where name="${user.name}"`  // 查询要创建的用户名是否已存在
        let nameCheckArr = await model.operateSql($checkNameExist)
        if (nameCheckArr.length) {  // 如果结果有长度，说明存在
            ctx.body = {
                code: 20001,
                msg: '用户名已存在'
            }
            return  // 直接返回错误
        }
        let values = Object.values(user).map(item => `"${item}"`)  // 如果不存在这个用户名，则
        $sql = `insert into admin_user (${Object.keys(user).toString()}) value (${values.toString()})` // 如果不存在这个用户名，则把这个用户名存库
    }
    console.log($sql)
    await model.operateSql($sql)
        .then(result => {
            ctx.body = {
                code: 20000,
                msg: '更新成功'
            }
        }).catch(err => {
            console.log(err)
            ctx.body = {
                code: -1,
                msg: '更新失败'
            }
        })
}

exports.getAdminList = async ctx => {
    let limit = ctx.request.query.limit || 10
    let page = ctx.request.query.page || 0
    let $selectCount = `select count(*) from admin_user where isDel=0`  // 查询admin总数
    const count = await model.operateSql($selectCount)
    let $selectUserList = `select * from admin_user where isDel=0 limit ${limit} offset ${page * limit}`    // 查询满足分页条件的admin数据

    await model.operateSql($selectUserList).then(list => {
        ctx.body = {
            code: 20000,
            msg: '管理员列表',
            data: list,
            total: count[0]['count(*)']
        }
    }).catch(err => {
        ctx.body = {
            code: -1,
            msg: '查询失败'
        }
    })
}

exports.checkPassword = async ctx => {  
    var query = ctx.request.query
    try{
        let $selectUser = `select password from admin_user where name="${query.name}"`  // 查询所查用户名的密码
        let password = await model.operateSql($selectUser)
        if (password[0].password == query.password) {   // 与发送来的原密码进行比对
            ctx.body = {code: 20000, msg: '验证成功'}
        } else {
            ctx.body = {code: 20003, msg: '密码错误'}
        }
    } catch (err) {
        ctx.body = {code: -1, msg: '验证失败'}
    }
}