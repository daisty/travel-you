<template>
  <div>
    <div class="cf">
      <label class="selectImg fl">
        <el-button size="small" type="primary">选取文件</el-button>
        <input type="file" @change="addImg" id="fmimg">
      </label>
      <el-button @click="upload" size="small" type="success" class="fl">开始上传</el-button>
    </div>
    <div style="width: 100%;">
      <load v-show="uploading" :h="100" :c="'文件上传中'"></load>
      <ul class="filelist" v-show="!uploading">
        <li v-for="(item,index) in fileList" :key="index"><i class="el-icon-picture"></i><span>{{item.name}}</span><i
          class="el-icon-delete" @click="deleteImg(index)"></i></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import hotelProduct from '@/api/product/hotelProduct'
  const formData = new FormData()
  export default {
    data() {
      return {
        fileList: [],
        uploading: false
      }
    },
    methods: {
      addImg() {
        const file = document.querySelector('#fmimg').files[0]
        this.fileList.push(file)
        document.querySelector('#fmimg').value = ''
      },
      deleteImg(index) {
        this.fileList.splice(index, 1)
      },
      upload() {
        if (this.fileList.length > 0) {
          for (let i = 0; i < this.fileList.length; i++) {
            formData.append('file', this.fileList[i])
          }
          this.uploading = true
          hotelProduct.upload(formData).then((res) => {
            if (res && res.state === 'success') {
              document.querySelector('#fmimg').value = ''
              formData.delete('file')
              this.fileList = []
              this.$message({
                message: '上传成功！',
                type: 'success'
              })
              this.uploading = false
              this.$emit('imglist', res.url)
            } else {
              this.$message({
                showClose: true,
                message: '上传失败，请重试！',
                type: 'error'
              })
            }
          })
        } else {
          this.$message({
            message: '请选择文件！',
            type: 'warning'
          })
        }
      }
    }
  }
</script>

<style scoped>
  .selectImg {
    margin-right: 10px;
    position: relative;
  }

  input[type=file] {
    width: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100%;
    opacity: 0;
    z-index: 100;
  }

  .filelist {
    margin-top: 15px;
    margin-left: 5px;
  }

  .filelist li {
    color: #324057;
    margin-bottom: 5px;

  }

  .filelist li i {
    color: #8492A6;
  }

  .filelist li span {
    margin-left: 10px;
    display: inline-block;
    width: calc(100% - 200px);
  }

  .el-icon-delete {
    cursor: pointer;
  }

  .el-icon-delete:hover {
    color: #20A0FF;
  }
</style>
