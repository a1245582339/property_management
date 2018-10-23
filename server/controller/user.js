const model = require('../lib/mysql.js')

exports.login = async ctx => {
    let data = ctx.request.body
    let $selectUser = `select * from user where name="${data.name}" and password="${data.password}" and isDel=0;`
    let user = await model.operateSql($selectUser)
    if (user.length) {
        let token = `${(new Date()).getTime()}token${data.name}`
        let $createToken = `insert into user_token (token, deadline, user_id) value ("${token}", "${(new Date()).getTime() + 604800000}", ${user[0].id})`
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
    // console.log(ctx.request.query)
    let token = ctx.request.query.token
    let $selectStuId = `select user_id from user_token where token="${token}" and deadline>${(new Date()).getTime()}`
    try {
        var user_id = await model.operateSql($selectStuId)
        if (!user_id.length) {
            throw ''
        }
    } catch (err) {
        ctx.body = {
            code: 20002,
            msg: 'token已失效'
        }
        return false
    }

    let $selectUserInfo = `select user.*,room.* from user left join room on user.room_id=room.id where user.id=${user_id[0].user_id}`
    await model.operateSql($selectUserInfo).then(res => {
        res[0].id = user_id[0].user_id
        if (res[0].role == '0') {

            ctx.body = {
                code: 20000,
                msg: '用户信息',
                data: {
                    user: {
                        id: res[0].id,
                        password: res[0].password,
                        name: res[0].name,
                        nick_name: res[0].nick_name,
                        tel: res[0].tel,
                        role: res[0].role,
                        sex: res[0].sex
                    }
                }
            }
        } else {
            ctx.body = {
                code: 20000,
                msg: '用户信息',
                data: {
                    user: res[0]
                }
            }
        }
    }).catch(err => {
        ctx.body = {
            code: -1,
            msg: '查询失败'
        }
    })
}


// 新建、更新和删除都调用一个接口
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
        if (user.isDel) {
            $selectRoom = `select room_id from user where id="${user.id}";`
            let room_id = (await model.operateSql($selectRoom))[0].room_id
            $updateUser = `update user set isDel=1 where room_id="${room_id}";`
            await model.operateSql($updateUser)
        }
        $sql = `update user set ${setStr} where id="${user.id}";`
    } else {
        $checkNameExist = `select * from user where name="${user.name}"`
        let nameCheckArr = await model.operateSql($checkNameExist)
        if (nameCheckArr.length) {
            ctx.body = {
                code: 20001,
                msg: '用户名已存在'
            }
            return
        }
        let values = Object.values(user).map(item => `"${item}"`).toString()
        $sql = `insert into user (${Object.keys(user).toString()}) value (${values})`
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

// 将普通家庭成员改为业主
exports.userToOwner = async ctx => {
    let user = ctx.request.body
    let $selectOldUser = `select * from user where isDel=0 and role=1 and room_id=${user.room_id}`
    const oldUser = await model.operateSql($selectOldUser)
    $newOwner = `update user set role=1 where id="${user.id}";`
    $oldOwner = `update user set role=2 where id="${oldUser[0].id}";`
    console.log($oldOwner)
    try {
        await model.operateSql($newOwner)
        await model.operateSql($oldOwner)
        ctx.body = {
            code: 20000,
            msg: '更新成功'
        }
    } catch (err) {
        ctx.body = {
            code: -1,
            msg: '更新失败'
        }
    }
    
}

exports.getUserList = async ctx => {
    var query = ctx.request.query
    let limit = ctx.request.query.limit || 10
    let page = ctx.request.query.page || 0
    var whereStr = Object.keys(query).reduce((total, curr) => {
        if (curr == 'page' || curr == 'limit') {
            return total
        }
        return [...total, `${curr}="${query[curr]}"`]
    }, []).join(' and ')
    let $selectCount = `select count(*) from user where isDel=0 ${whereStr ? ' and ' + whereStr : ''}`
    const count = await model.operateSql($selectCount)
    let $selectUserList = `select user.id,user.name,user.nick_name,user.sex,user.room_id,user.role,user.tel,room.building,room.room_num from user left join room on user.room_id=room.id where isDel=0 ${whereStr ? ' and ' + whereStr : ''} order by role desc limit ${limit} offset ${page * limit}`
    var findRoomPro = roomId => new Promise((resolve, reject) => {
        let $findRoom = `select * from room where id="${roomId}"`
        model.operateSql($findRoom).then(res => resolve(res)).catch(err => reject(err))
    })
    await model.operateSql($selectUserList).then(async list => {
        await Promise.all(list.map(i => findRoomPro(i.room_id))).then(result => {
            result.forEach((item, index) => list[index].room = item[0].room_num)
            ctx.body = {
                code: 20000,
                msg: '用户列表',
                data: list,
                total: count[0]['count(*)']
            }
        })
    }).catch(err => {
        console.log(err)
        ctx.body = {
            code: -1,
            msg: '查询失败'
        }
    })
}


exports.checkPassword = async ctx => {
    var query = ctx.request.query
    try {
        let $selectUser = `select password from user where name="${query.name}"`
        let password = await model.operateSql($selectUser)
        if (password[0].password == query.password) {
            ctx.body = {
                code: 20000,
                msg: '验证成功'
            }
        } else {
            ctx.body = {
                code: 20003,
                msg: '密码错误'
            }
        }
    } catch (err) {
        ctx.body = {
            code: -1,
            msg: '验证失败'
        }
    }
}