import request from '@/utils/request'

const api = {
  artList: '/article/cms/get'
}

export default api

export function getArticleList (parameter) {
  return request({
    url: api.artList,
    method: 'get',
    params: parameter
  })
}
