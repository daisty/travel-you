import request from '@/utils/saasRequest'
export default {
  listSupplierInterfaceConfig: params => request({ url: '/saas/saasInterface/saasSupplierInterfaceConfig/list', params })
}
