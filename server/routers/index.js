const router = require('koa-router')();
const controller = require('../controller/user')
const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const moment = require('moment');
const fs = require('fs')

router.get('/user', controller.getUser)
router.post('/user', controller.updateUser)

module.exports = router