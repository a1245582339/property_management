import request from '@/utils/request'
// 获取boss列表
export function getBoss() {
  return request({
    url: '/boss',
    method: 'get',
  })
}

// 审核boss
export function checkBoss(params) {
    return request({
      url: '/checkBoss',
      method: 'put',
      params
    })
  }
  
  // 删除boss
  export function delBoss(data) {
    return request({
      url: '/delBoss',
      method: 'put',
      data: { data }
    })
  }
  