import request from '@/utils/request'
export default {
  // 分页查询房型列表
  list: params => request({ url: '/saas/hotel/hotelRoomInfos/list', method: 'get', params }),

  // 获取指定房型详情
  load: roomId => request({ url: '/saas/hotel/hotelRoomInfos/load', method: 'get', params: { roomId }}),

  // 不分页查询指定酒店下房型列表
  listForSelect: (hotelId, keyword) => request({ url: '/saas/hotel/hotelRoomInfos/listForSelect', method: 'get', params: { keyword, hotelId }})
}

