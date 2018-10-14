import request from '@/utils/request'
// 获取资讯列表
export function getNewsList(params) {
  return request({
    url: '/getNewsList',
    method: 'get',
    params
  })
}

// 获取资讯类型列表
export function getNewsType(params) {
  return request({
    url: '/getNewsType',
    method: 'get',
    params
  })
}

// 修改资讯基本信息
export function updateNews(data) {
  return request({
    url: '/updateNews',
    method: 'post',
    data
  })
}
// 修改课程类型
export function updateNewsType(data) {
  return request({
    url: '/updateNewsType',
    method: 'post',
    data
  })
}
// 删除资讯
export function delNews(data) {
  return request({
    url: '/delNews',
    method: 'post',
    data: { data }
  })
}
// 删除资讯类型
export function delNewsType(data) {
  return request({
    url: '/delNewsType',
    method: 'post',
    data: { data }
  })
}

// 获取文章内容类型
export function getHTML(params) {
  return request({
    url: '/getHTML',
    method: 'get',
    params
  })
}

// 获取访问日志
export function getNewsVisitLog(params) {
  return request({
    url: '/getNewsVisitLog',
    method: 'get',
    params
  })
}
