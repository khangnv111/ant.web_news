import request from '@/utils/request'

const api = {
  campain: '/GiftCode/campain-list'
}
export default api

export function getCampainList (parameter) {
  console.log('getCampainList: ', getCampainList)
  return request({
    url: api.campain,
    method: 'get',
    params: parameter
  })
}
