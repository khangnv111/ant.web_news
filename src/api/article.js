import request from '@/utils/request'

const api = {
  artList: '/article/cms/get',
  artInsert: '/article/cms/insert-update',
  menuList: '/article/menu/get'
}

export default api

export function getArticleList (parameter) {
  return request({
    url: api.artList,
    method: 'get',
    params: parameter
  })
}

export function getMenuList (parameter) {
  return request({
    url: api.menuList,
    method: 'get',
    params: parameter
  })
}

export function articleInsert (parameter) {
  return request({
    url: api.artInsert,
    method: 'post',
    data: parameter
  })
}
