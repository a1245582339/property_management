
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
        "token": "1536906504242tokenddd"    // token
    }
}
```
***
### 拉取用户信息

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
### 更新/新增/删除用户信息

#### 请求
```http
POST /admin/userInfo
```
#### 参数
```json
{
    "id": 1,
    "name": "aaa",
    "password": "000000",
    "role": 2,
    "isDel": 1
}

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
GET /adminList
```
#### 参数
```json
limit: 查询条数
page: 查询页数
name: 用户名    // 支持关键字查询
role: 角色
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
        "token": "1536906504242tokenddd"    // token
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
POST /admin/userInfo
```
#### 参数
```json
{
    "id": 1,
    "name": "aaa",
    "password": "000000",
    "sex": 0,
    "room_id": 1,
    "role": 2,
    "tel": "13555555555",
    "isDel": 1
}

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