import request from '@/utils/request.js'

export default {
  list: params => request({ url: '/saas/product/supplierProduct/list', method: 'get', params }),

  listProducts: params => request({ url: '/saas/product/supplierProduct/realtimeList', method: 'get', params }),

  batchSave: params => request({ url: '/admin/supplierhotel/hotelInfos/unbind', method: 'patch', params })
}
