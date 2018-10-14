import request from '@/utils/request'
// 获取课程列表
export function getCourseList(params) {
  return request({
    url: '/courseList',
    method: 'get',
    params
  })
}

// 获取课程类型列表
export function getCourseClass(params) {
  return request({
    url: '/courseClassList',
    method: 'get',
    params
  })
}

