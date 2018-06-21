<template>
  <div>
    <el-upload
      action="//up.qbox.me/"
      :file-list="imgList"
      :data="uploadToken"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :on-preview="preview"
      :on-success="successUpload"
      :on-error="failureUpload"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" top="0">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import qiniu from '@/api/qiniu'
  export default {
    name: 'qiniuUpload',
    data() {
      return {
        imgList: [],
        dialogImageUrl: '',
        uploadToken: null,
        dialogVisible: false,
        // 保存在数据库的上传记录
        recordList: []
      }
    },
    props: {
      // 相关联的产品id,必填
      productId: {
        type: Number,
        require: true
      },
      // 相关联的表名,必填
      refTable: {
        type: String,
        require: true
      }
    },
    methods: {
      beforeUpload(file) {
        console.log(file)
        if (file.size > 10 * 1024 * 1024) {
          this.$message.error('上传图片大小不能超过10MB')
          return false
        }
        const param = {
          objectType: this.refTable,
          objectId: this.productId,
          fileName: file.name,
          fileSize: file.size
        }
        this.uploadToken = null
        return qiniu.getToken(param).then(res => {
          if (!res && res.state === 'error') {
            this.$message.error('网络异常请重新上传')
            return false
          }
          this.uploadToken = {
            key: res.data.key,
            token: res.data.token
          }
          this.recordList.push({
            id: res.data.id,
            key: res.data.key
          })
        }).catch(() => {
          this.$message.error('网络异常请重新上传')
          return false
        })
      },
      // 预览图片
      preview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      successUpload(file) {
        console.log('successUpload')
        for (var f of this.recordList) {
          if (f.key === file.key) {
            const param = { id: f.id }
            file.id = f.id
            qiniu.success(param)
            break
          }
        }
      },
      failureUpload(file) {
        console.log('failureUpload')
        for (var f of this.recordList) {
          if (f.key === file.key) {
            const param = { id: f.id }
            qiniu.success(param)
            break
          }
        }
      },
      handleRemove(file, fileList) {
        const temp = this.recordList
        for (var f of temp) {
          if (f.key === file.name || (file.response && file.response.key === f.key)) {
            const param = { id: f.id }
            qiniu.deleteImg(param)
            return
          }
        }
      },
      // 将父组件传过来的默认图片转换,以方便element显示已经操作
      init() {
        const params = {
          objectId: this.productId,
          objectType: this.refTable
        }
        const recordList = []
        const imageLIst = []
        qiniu.relatedImgList(params).then(res => {
          const saasFileInfoList = res.results
          if (saasFileInfoList) {
            saasFileInfoList.forEach(saasFileInfo => {
              const record = {
                id: saasFileInfo.id,
                key: saasFileInfo.filePath
              }
              recordList.push(record)
              const img = {
                name: saasFileInfo.filePath,
                url: ('http://qnimg.zowoyoo.com/' + saasFileInfo.filePath)
              }
              imageLIst.push(img)
            })
            this.imgList = imageLIst
            this.recordList = recordList
          }
        })
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style scoped>

</style>
