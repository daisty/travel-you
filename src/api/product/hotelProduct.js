import request from '@/utils/request'
export default {

  batchSave: data => request({ url: '/saas/product/hotelProducts/batchSave', method: 'post', data }),

  update: data => request({ url: '/saas/product/hotelProducts/update', method: 'put', data }),

  load: productId => request({ url: '/saas/product/hotelProducts/load', method: 'get', params: { productId }}),

  upload: data => request({ url: '/saas/product/hotelProducts/pictures', method: 'post', headers: { 'Content-Type': 'multipart/form-data' }, data }),

  // 酒店列表
  hotelList: params => request({ url: '/saas/product/hotelProducts/listForHotel', method: 'get', params }),

  // 删除产品
  hotelDelete: productId => request({ url: '/saas/product/hotelProducts/delete', method: 'delete', params: { productId }}),

  // 酒店产品列表或者价格计划列表
  productList: (params, url) => request({ url: `/saas/product/${url}/list`, method: 'get', params }),

  // 导出excel数据
  listForExport: params => request({ url: '/saas/product/hotelProducts/listForExport', method: 'get', params }),

  // 单个产品上下架
  updateByState: (productId, state) => request({ url: '/saas/product/hotelProducts/updateByState', method: 'put', params: { state, productId }})

}
