
# 错误定义

```
{
    code: -1,
    msg: "errorMessage"
}
```
| code | 错误 |
| ------ | ------ | 
| -1 | 读取数据库失败 |
| 20001 | 用户名已存在 |
| 20002 | token失效 |
| 20003 | 密码错误 |

# 接口定义

## 管理端用户

### 登录

#### 请求
```http
POST /admin/login
```
#### 参数
```json
name: 用户名
password: 密码
```
#### 响应
```json
HTTP/1.1 200 OK
Content-Type:application/json
{
    "code": 20000,
    "msg": "创建token成功",
    "data": {
        "token": "1536906504242tokenddd"
    }
}
```
***
### 拉取管理员用户信息

#### 请求
```http
GET /admin/userInfo
```
#### 参数
```json
token: cookie中存放的token
```
#### 响应
```json
HTTP/1.1 200 OK
Content-Type:application/json
{
    "code": 20000,
    "msg": "用户信息",
    "data": {
        "user": {
            "id": 1,
            "name": "ddd",
            "password": "000000",
            "role": 2,
            "isDel": 0
        }
    }
}
```

***
### 更新/新增/删除管理员用户信息

#### 请求
```http
POST /admin/userInfo
```
#### 参数
```json
    id: 用户id,
    name: 用户名,
    password: 密码,
    role: 角色,
    isDel: 删除     // 0: 未删, 1: 已删

// 有id时为更新，否则为新增
```
#### 响应
```json
HTTP/1.1 200 OK
Content-Type:application/json
{
    "code": 20001,
    "msg": "用户名已存在"
} // 新增时，用户名已存在，抛出异常

{
    "code": 20000,
    "msg": "更新成功"
}
```
***
### 获取管理员列表

#### 请求
```http
GET /adminList
```
#### 参数
```json
limit: 查询条数
page: 查询页数
```
#### 响应
```json
HTTP/1.1 200 OK
Content-Type:application/json
{
    "code": 20000,
    "msg": "管理员列表",
    "data": [
        {
            "id": 1,
            "name": "ddd",
            "password": "000000",
            "role": 2,
            "isDel": 0
        },
        {
            "id": 2,
            "name": "fff",
            "password": "000000",
            "role": 1,
            "isDel": 0
        }
    ]
}
```
***
### 验证密码
#### 请求
```http
GET /admin/checkPassword
```
#### 参数
```json
name: 用户名
password: 密码
```
#### 响应
```json
HTTP/1.1 200 OK
Content-Type:application/json
{
    "code": 20000,
    "msg": "验证成功"
}
```
***
***
## 客户端用户

### 登录

#### 请求
```http
POST /user/login
```
#### 参数
```json
name: 用户名
password: 密码
```
#### 响应
```json
HTTP/1.1 200 OK
Content-Type:application/json
{
    "code": 20000,
    "msg": "创建token成功",
    "data": {
        "token": "1536906504242tokenddd"
    }
}
```
***
### 拉取用户信息

#### 请求
```http
GET /user/userInfo
```
#### 参数
```json
token: cookie中存放的token
```
#### 响应
```json
HTTP/1.1 200 OK
Content-Type:application/json
{
    "code": 20000,
    "msg": "用户信息",
    "data": {
        "user": {
            "id": 2,
            "name": "dad",
            "password": "23",
            "sex": 0,
            "room_id": 2,
            "role": 1,
            "isDel": "0",
            "tel": "132",
            "room_num": "102",
            "building": "1",
            "area": 50
        }
    }
}
```

***
### 更新/新增/删除用户信息

#### 请求
```http
POST /user/userInfo
```
#### 参数
```json
id: 用户id,
name: 用户名,
password: 密码,
sex: 性别,
room_id: 房间id,
role: 角色,
tel: 手机号,
isDel: 删除     // 0: 未删, 1: 已删

// 有id时为更新，否则为新增
```
#### 响应
```json
HTTP/1.1 200 OK
Content-Type:application/json
{
    "code": 20001,
    "msg": "用户名已存在"
} // 新增时，用户名已存在，抛出异常

{
    "code": 20000,
    "msg": "更新成功"
}
```
***
### 获取用户列表

#### 请求
```http
GET /userList
```
#### 参数
```json
limit: 查询条数
page: 查询页数
name: 用户名    // 支持关键字查询
role: 角色
sex: 性别
tel: 手机号
room_id: 房间id
```
#### 响应
```json
HTTP/1.1 200 OK
Content-Type:application/json
{
    "code": 20000,
    "msg": "用户列表",
    "data": [
        {
            "id": 1,
            "name": "张三三三三",
            "password": "213",
            "sex": 1,
            "room_id": 1,
            "role": 2,
            "isDel": "0",
            "tel": "1321",
            "room": "101"
        },
        {
            "id": 2,
            "name": "李四四四四",
            "password": "123",
            "sex": 1,
            "room_id": 2,
            "role": 1,
            "isDel": "0",
            "tel": "2132",
            "room": "102"
        }
    ]
}
```
***
### 验证密码
#### 请求
```http
GET /user/checkPassword
```
#### 参数
```json
name: 用户名
password: 密码
```
#### 响应
```json
HTTP/1.1 200 OK
Content-Type:application/json
{
    "code": 20000,
    "msg": "验证成功"
}
```
***
***
## 家庭房屋信息

### 查询房屋

#### 请求
```http
GET /room
```
#### 参数
```json
id: 房间id
room_num: 房间门牌号
building: 楼号
```
#### 响应
```json
HTTP/1.1 200 OK
Content-Type:application/json
{
    "code": 2000,
    "msg": "房间信息",
    "data": [
        {
            "id": 1,
            "room_num": "101",
            "building": "1",
            "area": 50
        },
        {
            "id": 2,
            "room_num": "102",
            "building": "1",
            "area": 50
        },
        {
            "id": 3,
            "room_num": "201",
            "building": "1",
            "area": 60
        },
        {
            "id": 4,
            "room_num": "202",
            "building": "1",
            "area": 60
        }
    ]
}
```
***
***
## 维修信息

### 查询维修

#### 请求
```http
GET /repair
```
#### 参数
```json
id: 维修信息
limit: 查询条数
page: 查询页数
title: 标题信息     // 支持关键字查询
status: 状态        // 1：已报修2：已联系 3：已派修 4：已维修 5：已缴费
user_id: 用户id
```
#### 响应
```json
HTTP/1.1 200 OK
Content-Type:application/json
{
    "code": 20000,
    "msg": "维修列表",
    "data": [
        {
            "id": 1,
            "title": "title test",
            "status": 1,
            "photos": null,
            "price": null,
            "user_id": 1,
            "create_time": "1536751006000",
            "appointment_time": null,
            "pay_time": null,
            "name": "请问",
            "tel": "1321",
            "room_num": "101"
        },
        {
            "id": 2,
            "title": "test2",
            "status": 4,
            "photos": null,
            "price": 50,
            "user_id": 2,
            "create_time": "1536800973000",
            "appointment_time": "1536887373000",
            "pay_time": null,
            "name": "请sada",
            "tel": "2132",
            "room_num": "102"
        },
        {
            "id": 3,
            "title": "测试请求",
            "status": 5,
            "photos": "",
            "price": 100.5,
            "user_id": 1,
            "create_time": "1536828608300",
            "appointment_time": "1536834820116",
            "pay_time": "1536892823306",
            "name": "请问",
            "tel": "1321",
            "room_num": "101"
        }
    ]
}
```
***
### 创建维修信息

#### 请求
```http
POST /repair
```
#### 参数
```json
title: 标题信息
photos: 照片地址    // 可选
user_id: 用户id
```
#### 响应
```json
HTTP/1.1 200 OK
Content-Type:application/json
{
    "code": 20000,
    "msg": "创建成功"
}
```
***
### 更改维修信息

#### 请求
```http
PUT /repair
```
#### 参数
```
id: 维修信息id
status: 状态    // 1：已报修2：已联系 3：已派修 4：已维修 5：已缴费
price: 价格     // status = 4 时传此参数
part: [{
    part_id: 零件id,
    count: 零件数量
}...]      //  status = 4 时传此参数
```
#### 响应
```json
HTTP/1.1 200 OK
Content-Type:application/json
{
    "code": 20000,
    "msg": "更新成功"
}
```
***
***
## 零件信息
### 查询零件
#### 请求
```http
GET /part
```
#### 参数
```json
limit: 查询条数
page: 查询页数
id: 零件id
part_name: 零件名称     // 支持关键字查询
type_id: 类别id
```
#### 响应
```json
{
    "code": 20000,
    "msg": "零件列表",
    "data": [
        {
            "id": 4,
            "part_name": "3mm螺丝",
            "price": 1,
            "type_id": 1,
            "isDel": 0,
            "count": 0,
            "type_name": "螺丝"
        },
        {
            "id": 5,
            "part_name": "5mm螺丝",
            "price": 2,
            "type_id": 1,
            "isDel": 0,
            "count": 0,
            "type_name": "螺丝"
        }
    ]
}
```
***
### 新增/修改/删除零件
#### 请求
```http
POST /part
```
#### 参数
```json
id: 零件id
part_name: 零件名称     // 支持关键字查询
type_id: 类别id
isDel: 删除     // 0:未删, 1: 已删
price: 价格
count: 剩余数量
```
#### 响应
```json
{
    "code": 20000,
    "msg": "零件列表",
    "data": [
        {
            "id": 4,
            "part_name": "3mm螺丝",
            "price": 1,
            "type_id": 1,
            "isDel": 0,
            "count": 0,
            "type_name": "螺丝"
        },
        {
            "id": 5,
            "part_name": "5mm螺丝",
            "price": 2,
            "type_id": 1,
            "isDel": 0,
            "count": 0,
            "type_name": "螺丝"
        }
    ]
}
```
***
### 查询零件类型
#### 请求
```http
GET /partType
```
#### 参数
```
无
```
#### 响应
```json
{
    "code": 20000,
    "msg": "零件类型列表",
    "data": [
        {
            "id": 1,
            "type_name": "螺丝",
            "isDel": 0
        },
        {
            "id": 2,
            "type_name": "地漏",
            "isDel": 0
        }
    ]
}
```
***
### 新建/更新/删除零件类型
#### 请求
```http
POST /partType
```
#### 参数
```
id: 零件类型id
type_name: 类型名称     
isDel: 删除     // 0:未删, 1: 已删
```
#### 响应
```json
{
    "code": 20000,
    "msg": "更新成功"
}
```
***
### 新建/更新/删除零件订单
#### 请求
```http
POST /order
```
#### 参数
```
part_id: 零件id     
repair_id: 报修id
count: 出库量
```
#### 响应
```json
{
    "code": 20000,
    "msg": "更新成功"
}
```
***
### 获取零件订单
#### 请求
```http
GET /order
```
#### 参数
```
limit: 查询条数
page: 查询页数
```
#### 响应
```json
{
    "code":20000,
    "msg":"零件列表",
    "data":[{
            "id":4,
            "repair_id":1,
            "part_id":7,
            "count":50,
            "part_name":"一字改锥",
            "title":"title test"
        },{
            "id":5,
            "repair_id":1,
            "part_id":8,
            "count":1,
            "part_name":"新类型零件",
            "title":"title test"
        },{
            "id":6,
            "repair_id":30,
            "part_id":8,
            "count":10,
            "part_name":"新类型零件",
            "title":"测试1"
        },{
            "id":7,
            "repair_id":30,
            "part_id":8,
            "count":10,
            "part_name":"新类型零件",
            "title":"测试1"
        },{
            "id":8,
            "repair_id":30,
            "part_id":8,
            "count":1,
            "part_name":"新类型零件",
            "title":"测试1"
        },{
            "id":9,
            "repair_id":31,
            "part_id":9,
            "count":50,
            "part_name":"测试零件",
            "title":"测试新增"
        }]}
```
***
