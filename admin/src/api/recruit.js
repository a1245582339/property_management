import request from '@/utils/request'
// 获取boss列表
export function getRecruit() {
  return request({
    url: '/recruit',
    method: 'get',
  })
}

// 审核boss
export function checkRecruit(params) {
    return request({
      url: '/checkRecruit',
      method: 'put',
      params
    })
  }
  
  // 删除boss
  export function delRecruit(data) {
    return request({
      url: '/delRecruit',
      method: 'put',
      data: { data }
    })
  }
  