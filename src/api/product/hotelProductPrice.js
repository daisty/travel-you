import request from '@/utils/request'
export default {
  list: (productId, year, month) => request({ url: '/saas/product/hotelProductPrices/list', method: 'get', params: { productId, year, month }}),

  save: data => request({ url: '/saas/product/hotelProductPrices/save', method: 'post', data }),

  update: data => request({ url: '/saas/product/hotelProductPrices/update', method: 'put', data }),

  del: data => request({ url: '/saas/product/hotelProductPrices/delete', method: 'delete', data }),

  getMinPrice: (productIds, year, month) => request({ url: '/saas/product/hotelProductPrices/getMinPrice', method: 'get', params: { productIds, year, month }})
}

