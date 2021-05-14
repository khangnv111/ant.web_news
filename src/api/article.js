import request from '@/utils/request'

const api = {
  artList: '/article/cms/get',
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
