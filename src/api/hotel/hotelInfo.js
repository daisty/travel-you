import request from '@/utils/request.js'

export default {
  save: data => request({ url: '/admin/hotel/hotelInfos/save', method: 'post', data }),

  delete: hotelId => request({ url: '/admin/hotel/hotelInfos/delete', method: 'delete', params: { hotelId }}),

  update: data => request({ url: '/admin/hotel/hotelInfos/update', method: 'put', data }),

  load: params => request({ url: '/saas/product/hotelProducts/loadForHotel', method: 'get', params }),

  loadHotel: params => request({ url: '/admin/hotel/hotelInfos/loadAndUpdate', method: 'get', params }),

  list: params => request({ url: '/admin/hotel/hotelInfos/list', method: 'get', params }),

  queryHotel: (keyword, areaId) => request({ url: '/saas/product/hotelProducts/queryHotel', method: 'get', params: { areaId, keyword }}),

  queryRoom: (hotelId, keyword) => request({ url: '/saas/hotel/hotelRoomInfos/queryRoom', method: 'get', params: { hotelId, keyword }}),

  syncHotel: params => request({ url: '/admin/hotel/hotelInfos/syncHotel', method: 'post', params }),

  syncRoom: params => request({ url: '/admin/hotel/hotelInfos/syncRoom', method: 'get', params })

}
