import request from '@/utils/request'
// 获取boss列表
export function getVolun() {
  return request({
    url: '/volun',
    method: 'get',
  })
}

// 审核boss
export function checkVolun(params) {
    return request({
      url: '/checkVolun',
      method: 'put',
      params
    })
  }
  
  // 删除boss
  export function delVolun(data) {
    return request({
      url: '/delVolun',
      method: 'put',
      data: { data }
    })
  }