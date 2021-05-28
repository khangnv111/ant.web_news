import request from '@/utils/request'

const api = {
  advertList: '/advert/get',
  advertDetail: '/advert/detail',
  advertInsert: '/advert/cms/insert-update',
  advertDelete: '/advert/cms/delete',
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

export function getAdverDetail (parameter) {
  return request({
    url: api.advertDetail,
    method: 'get',
    params: parameter
  })
}

export function insertAdvert (parameter) {
  return request({
    url: api.advertInsert,
    method: 'post',
    data: parameter
  })
}

export function deleteAdvert (parameter) {
  return request({
    url: api.advertDelete,
    method: 'post',
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
