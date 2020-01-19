import request from '@/utils/request'
// import Qs from 'qs'
export function getList(data) {
  return request({
    url: 'query',
    method: 'post',
    data
  })
}
export function getAnalysis(data) {
  return request({
    url: 'analysis',
    method: 'post',
    data
  })
}

