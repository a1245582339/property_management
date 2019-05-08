const router = require('koa-router')();

const md5 = require('md5')
const moment = require('moment');
const fs = require('fs')

const admin = require('../controller/admin.js')
const user = require('../controller/user.js')
const room = require('../controller/room.js')
const repair = require('../controller/repair.js')
const part = require('../controller/part.js')
const order = require('../controller/order.js')

/* 管理员 */
router.post('/admin/login', admin.login)    // 登录
router.get('/admin/userInfo', admin.getUserInfo)    // 获取管理员信息
router.post('/admin/userInfo', admin.updateUser)    // 更新管理员
router.get('/adminList', admin.getAdminList)    // 获取管理员列表
router.get('/admin/checkPassword', admin.checkPassword) // 检查密码

/* 用户 */
router.post('/user/login', user.login)  // 登录
router.get('/user/userInfo', user.getUserInfo)  // 获取用户信息
router.post('/user/userInfo', user.updateUser)  // 更新用户信息
router.post('/user/userToOwner', user.userToOwner)  // 将普通家庭成员改为业主
router.get('/userList', user.getUserList)   // 获取用户列表
router.get('/user/checkPassword', user.checkPassword)   // 检查密码

/* 家庭房屋信息 */
router.get('/room', room.getRoom)   // 获取房屋列表

/* 维修信息 */
router.get('/repair', repair.getRepair) // 获取维修信息
router.post('/repair', repair.creatRepair)  // 创建维修
router.put('/repair', repair.updateRepair)  // 修改维修
router.post('/repairPhoto', repair.uploadImage)     // 上传图片

/* 零件 */
router.get('/part', part.getPart)   // 获取零件列表
router.post('/part', part.updatePart)   // 更新零件信息
router.get('/partType', part.getPartType)   // 获取零件类型列表
router.post('/partType', part.updatePartType)   // 更新零件类型

/* 订单 */
router.get('/order', order.getOrder)    // 获取订单
router.post('/order', order.createOrder)    // 创建订单

module.exports = router