import request from '@/utils/request'

export default {
  breakfastList: () => request({ method: 'get', url: '/openapi/enum/breakfasts' }),

  guestTypeList: () => request({ method: 'get', url: '/openapi/enum/guestTypes' }),

  getConfirmTypeList: () => request({ method: 'get', url: '/openapi/enum/confirmTypes' }),

  getCancelTypeList: () => request({ method: 'get', url: '/openapi/enum/cancelTypes' }),

  getHotelStarList: () => request({ method: 'get', url: '/openapi/enum/hotelStars' })
}
