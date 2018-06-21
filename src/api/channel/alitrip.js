import request from '@/utils/request'

export default {
  hotelList: params => request({ url: '/saas/channel/alitrip/hotelList', method: 'get', params }),

  productList: (params, url) => request({ url: `/saas/channel/alitrip/${url}`, method: 'get', params }),

  alitripHotelGet: params => request({ url: `/saas/channel/alitrip/alitripHotelSearch`, method: 'get', params }),

  alitripRoomGet: params => request({ url: `/saas/channel/alitrip/alitripRoomSearch`, method: 'get', params }),

  hotelGet: params => request({ url: `/saas/channel/alitrip/alitripHotel`, method: 'get', params }),

  zwyHotelGet: id => request({ url: `/saas/channel/alitrip/zwyHotel`, method: 'get', params: { id }}),

  roomListGet: params => request({ url: `/saas/channel/alitrip/alitripRoomList`, method: 'get', params }),

  hotelPublish: params => request({ url: `/saas/channel/alitrip/publishHotel`, method: 'post', params }),

  roomPublish: params => request({ url: `/saas/channel/alitrip/publishRoom`, method: 'post', params }),

  prodPublish: params => request({ url: `/saas/channel/alitrip/publishProduct`, method: 'post', params }),

  channelConfigs: () => request({ url: `/saas/channel/alitrip/list`, method: 'get' }),

  priceGet: params => request({ url: `/saas/channel/alitrip/getPrice`, method: 'get', params }),

  priceSync: params => request({ url: `/saas/channel/alitrip/syncPrice`, method: 'get', params }),

  prodUpdate: params => request({ url: `/saas/channel/alitrip/updateProduct`, method: 'post', params }),

  alitripHotelProduct: id => request({ url: `/saas/channel/alitrip/alitripHotelProduct`, method: 'get', params: { id }}),

  delProduct: (alitripProdId, distributorMchId) => request({ url: `/saas/channel/alitrip/delProduct`, method: 'get', params: { alitripProdId, distributorMchId }}),

  alitripIidSearch: alitripProductId => request({ url: `/saas/channel/alitrip/alitripIidSearch`, method: 'get', params: { alitripProductId }})
}
