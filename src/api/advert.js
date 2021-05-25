import request from '@/utils/request'

const api = {
  advertList: '/advert/get',
  adPosList: '/advert/pos/get-list'
}

export default api

export function getAdvertList (parameter) {
  return request({
    url: api.advertList,
    method: 'get',
    params: parameter
  })
}

export function getAdvertPostList (parameter) {
  return request({
    url: api.adPosList,
    method: 'get',
    params: parameter
  })
}
