import request from '@/utils/saasRequest'
export default {

  // 供应商查询
  queryMerchantInfo: keyword => request({ url: '/saas/merchant/supplierInfos/loadForSelect', method: 'get', params: { keyword }}),

  // 分销商查询
  list: params => request({ url: '/saas/merchant/distributorInfos/list', method: 'get', params }),

  // 获取指定供应商详情
  load: mchId => request({ url: '/saas/myInfo/saasMchInfo/load', method: 'get', params: { mchId }}),

  // 更新供应商
  update: data => request({ url: '/saas/myInfo/saasMch/update', method: 'put', data })

}
