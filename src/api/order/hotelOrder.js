import request from '@/utils/request'

export default {
  // 获取订单列表
  list: params => request({ url: '/saas/order/hotelOrders/list', method: 'get', params }),

  // 修改订单
  update: data => request({ url: `/saas/order/hotelOrders/update`, method: 'put', data }),

  // 修改订单备注
  updateOrderRemark: data => request({ url: `/saas/order/hotelOrders/updateOrderRemark`, method: 'put', data }),

  // 取消订单
  cancel: orderId => request({ url: `/saas/order/hotelOrders/cancel`, method: 'patch', params: { orderId }}),

  // 获取订单详情
  load: (saasId, orderId) => request({ url: `/saas/order/hotelOrders/load`, method: 'get', params: { saasId, orderId }}),

  // 获取订单详情，包含产品等额外信息
  loadDetails: orderId => request({ url: `/saas/order/hotelOrders/loadOrderDetail`, method: 'get', params: { orderId }}),

  // 获取创建通知单需要的信息
  loadNotification: orderId => request({ url: `/saas/order/hotelOrders/loadNotification`, method: 'get', params: { orderId }}),

  // 生成通知单
  saveNotification: data => request({ url: `/saas/order/hotelOrders/saveNotification`, method: 'put', data }),

  // 查看通知单列表
  listOrderNotification: params => request({ url: `/saas/order/hotelOrders/listOrderNotification`, method: 'get', params }),

  listPeople: orderId => request({ url: `/saas/order/hotelOrders/listPeople`, method: 'get', params: { orderId }}),

  // 新增订单
  addOrder: data => request({ url: `/saas/order/hotelOrders/addOrder`, method: 'post', data })
}
