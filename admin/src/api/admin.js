import request from '@/utils/request'

// 获取管理员类型列表
export function getAdminRoles(params) {
  return request({
    url: '/adminRoles',
    method: 'get',
    params
  })
}

// 获取当前管理员
export function getPersonalAdmin(params) {
  return request({
    url: '/personalAdmin',
    method: 'get',
    params
  })
}
// 获取管理员列表
export function getAdminList(params) {
  return request({
    url: '/adminList',
    method: 'get',
    params
  })
}

// 删除管理员
export function delAdmin(data) {
  return request({
    url: '/delAdmin',
    method: 'post',
    data: { data }
  })
}

// 更改管理员
export function updateAdmin(data) {
  return request({
    url: '/updateAdmin',
    method: 'post',
    data
  })
}
