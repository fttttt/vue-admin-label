import request from '@/utils/request'

export default {
  getList(params) {
    return request({
      url: '/table/list',
      method: 'get',
      params
    })
  }
}
