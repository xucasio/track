import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/userList',
    method: 'get',
    params: query
  })
}
export function add(data) {
  return request({
    url: '/addUser',
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: '/deleteUser',
    method: 'post',
    data
  })
}
