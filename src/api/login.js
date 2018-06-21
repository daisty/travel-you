import authServerRequest from '@/utils/authServerRequest'

export default {
  // 重置密码
  reset: data => authServerRequest({ url: '/client/user/reset', method: 'put', data }),

  // 获取用户权限列表
  getPermission: () => authServerRequest({ url: '/client/user/loadMenu', method: 'get' })

}

