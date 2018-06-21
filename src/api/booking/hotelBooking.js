import request from '@/utils/request.js'

export default {
  list: params => request({ url: '/saas/booking/hotelBookings/list', method: 'get', params }),

  listForBooking: params => request({ url: '/saas/booking/hotelBookings/listForBooking', method: 'get', params }),

  loadMinPrice: (productIds, sdate, edate) => request({ url: '/saas/booking/hotelBookings/loadMinPrice', method: 'get', params: { productIds, sdate, edate }}),

  loadHotel: params => request({ url: '/saas/booking/hotelBookings/loadHotel', method: 'get', params }),

  listHotelProduct: hotelId => request({ url: '/saas/booking/hotelBookings/listHotelProduct', method: 'get', params: { hotelId }}),

  addOrder: data => request({ url: '/saas/booking/hotelBookings/saveOrder', method: 'post', data }),

  getProductPriceList: params => request({ url: '/saas/booking/hotelBookings/getPrice', method: 'get', params })
}
