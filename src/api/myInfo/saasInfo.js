import request from '@/utils/saasRequest.js'

export default {
  load: () => request({ url: '/saas/myInfo/saasInfo/load', method: 'get' }),

  update: data => request({ url: '/saas/myInfo/saasInfo/update', method: 'put', data })
}

