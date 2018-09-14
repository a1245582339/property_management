const model = require('../lib/mysql.js')
const moment = require('moment')

exports.login = async ctx => {
    let data = ctx.request.body
    let $selectUser = `select * from admin_user where name="${data.name}" and password="${data.password}" and isDel=0;`
    let user = await model.operateSql($selectUser)
    if (user.length) {
        let token = `${(new Date()).getTime()}token${data.name}`
        let $createToken = `insert into admin_token (token, deadline, admin_id) value ("${token}", "${(new Date()).getTime() + 604800000}", ${user[0].id})`
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
            code: -1,
            msg: '用户名或密码错误'
        }
    }
}

exports.getUserInfo = async ctx => {
    let token = ctx.request.query.token
    console.log(ctx)
    let $selectAdminId = `select admin_id from admin_token where token="${token}" and deadline>${(new Date()).getTime()}`
    let admin_id = await model.operateSql($selectAdminId)
    let $selectUserInfo = `select * from admin_user where id=${admin_id[admin_id.length - 1].admin_id}`
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

    if (user.id) {
        let setStr = (Object.keys(user).reduce((total, curr) => {
            if (curr == 'id') {
                return total
            }
            return total.concat([`${curr}="${user[curr]}"`])
        }, [])).toString()
        $sql = `update admin_user set ${setStr} where id="${user.id}";`
    } else {
        $checkNameExist = `select * from admin_user where name="${user.name}"`
        let nameCheckArr = await model.operateSql($checkNameExist)
        if (nameCheckArr.length) {
            ctx.body = {
                code: 20001,
                msg: '用户名已存在'
            }
            return
        }
        let values = Object.values(user).map(item => `"${item}"`)
        $sql = `insert into admin_user (${Object.keys(user).toString()}) value (${values.toString()})`
    }
    console.log($sql)
    await model.operateSql($sql)
        .then(result => {
            ctx.body = {
                code: 20000,
                msg: '更新成功'
            }
        }).catch(err => {
            ctx.body = {
                code: -1,
                msg: '更新失败'
            }
        })
}

exports.getAdminList = async ctx => {
    let limit = ctx.request.query.limit || 10
    let page = ctx.request.query.page || 0
    let $selectUserList = `select * from admin_user where isDel=0 limit ${limit} offset ${page * limit}`

    await model.operateSql($selectUserList).then(list => {
        ctx.body = {
            code: 20000,
            msg: '管理员列表',
            data: list
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
        let $selectUser = `select password from admin_user where name="${query.name}"`
        let password = await model.operateSql($selectUser)
        if (password[0].password == query.password) {
            ctx.body = {code: 20000, msg: '验证成功'}
        } else {
            ctx.body = {code: 20003, msg: '密码错误'}
        }
    } catch (err) {
        ctx.body = {code: -1, msg: '验证失败'}
    }
}