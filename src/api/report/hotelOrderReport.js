import request from '@/utils/request'

export default {
  listOrderSituation: params => request({ url: `/saas/order/hotelOrderReport/listOrderSituation`, method: 'get', params }),

  listProfitDetail: params => request({ url: `/saas/order/hotelOrderReport/listProfitDetail`, method: 'get', params })

}
