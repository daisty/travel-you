import request from '@/utils/saasRequest'
export default {
  // saas-hotel-ui远程调用地址接口
  listForSelect: parentId => request({ url: '/openapi/area/areaInfos/listForSelect', method: 'get', params: { parentId }}),

  listForSelectView: areaId => request({ url: '/openapi/area/areaInfos/listForSelectView', method: 'get', params: { areaId }}),

  getZoneAndAreaForSelect: parentId => request({ url: '/openapi/area/areaInfos/getZoneAndAreaForSelect', method: 'get', params: { parentId }})
}
