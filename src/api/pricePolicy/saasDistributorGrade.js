import fetch from '@/utils/saasRequest'
export default {
  // 分销商等级列表查询
  list: () => fetch({ url: '/saas/pricePolicy/distributionGrade/list', method: 'get' }),

  listForSelect: () => fetch({ url: '/saas/pricePolicy/distributionGrade/listForSelect', method: 'get' }),

  // 新增分销商等级
  save: data => fetch({ url: '/saas/pricePolicy/distributionGrade/save', method: 'post', data }),

  update: data => fetch({ url: '/saas/pricePolicy/distributionGrade/update', method: 'put', data }),

  // 删除分销商等级
  del: params => fetch({ url: '/saas/pricePolicy/saasDistributorGrade/delete', method: 'get', params })
}
