import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/actionManage',
    method: 'get',
    params: query
  })
}
export function add(data) {
  return request({
    url: '/actionAdd',
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: '/actionDelete',
    method: 'post',
    data
  })
}
