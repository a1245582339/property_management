const router = require('koa-router')();

const md5 = require('md5')
const moment = require('moment');
const fs = require('fs')

const admin = require('../controller/admin.js')
const user = require('../controller/user.js')
const room = require('../controller/room.js')
const repair = require('../controller/repair.js')
const part = require('../controller/part.js')

/* 管理员 */
router.post('/admin/login', admin.login)
router.get('/admin/userInfo', admin.getUserInfo)
router.post('/admin/userInfo', admin.updateUser)
router.get('/adminList', admin.getAdminList)

/* 用户 */
router.post('/user/login', user.login)
router.get('/user/userInfo', user.getUserInfo)
router.post('/user/userInfo', user.updateUser)
router.get('/userList', user.getUserList)

/* 家庭房屋信息 */
router.get('/room', room.getRoom)

/* 维修信息 */
router.get('/repair', repair.getRepair)
router.post('/repair', repair.creatRepair)
router.put('/repair', repair.updateRepair)

/* 零件 */
router.get('/part', part.getPart)
router.post('/part', part.updatePart)

module.exports = router