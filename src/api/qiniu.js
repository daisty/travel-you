import saasRequest from '@/utils/saasRequest.js'

const urlPrefix = '/saas/util/file'
export default {
  getToken: params => saasRequest({ url: `${urlPrefix}/token`, method: 'get', params }),

  // 文件上传成功时调用,确认文件上传状态
  success: params => saasRequest({ url: `${urlPrefix}/success`, method: 'patch', params }),

  // 文件上传失败时调用,确认文件上传状态
  failure: params => saasRequest({ url: `${urlPrefix}/failure`, method: 'patch', params }),

  deleteImg: params => saasRequest({ url: `${urlPrefix}/delete`, method: 'delete', params }),

  relatedImgList: params => saasRequest({ url: `${urlPrefix}/relatedImgList`, method: 'get', params })
}
