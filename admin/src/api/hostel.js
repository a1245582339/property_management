import request from '@/utils/request'
// 获取订单列表
export function getHostelList(params) {
  return request({
    url: "/hostList",
    method: "get",
    params
  });
}
// 删除订单
export function delHostel(data) {
  return request({
    url: "/delHostel",
    method: "put",
    data: { data }
  });
}


