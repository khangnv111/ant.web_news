import request from '@/utils/request'

const api = {
  advertList: '/advert/get',
  advertInsert: '/advert/cms/insert-update',
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

export function insertAdvert (parameter) {
  return request({
    url: api.advertInsert,
    method: 'get',
    data: parameter
  })
}

export function getAdvertPostList (parameter) {
  return request({
    url: api.adPosList,
    method: 'get',
    params: parameter
  })
}
