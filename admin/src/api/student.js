import request from '@/utils/request'
// 获取学生列表
export function getStudentList(params) {
  return request({
    url: '/studentList',
    method: 'get',
    params
  })
}

// 审核学生
export function checkStudent(params) {
  return request({
    url: '/checkStudent',
    method: 'post',
    params
  })
}

// 删除学生
export function delStudent(data) {
  return request({
    url: '/delStudent',
    method: 'post',
    data: { data }
  })
}

// 更改学生
export function updateStudent(data) {
  return request({
    url: '/updateStudent',
    method: 'post',
    data
  })
}
