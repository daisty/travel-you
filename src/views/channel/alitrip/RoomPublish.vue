<template>
  <div class="app-container">
    <div class="title">
      房型发布
    </div>
    <el-form ref="form" :model="hotelInfo" label-width="100px" size="small">
      <el-row>
        <el-col :span="8">
          <el-form-item label="酒店名称：" size="small" >
            {{hotelInfo.hotelName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="酒店地址：" size="small">
            {{hotelInfo.address}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="房型名称：" size="small">
            <el-input
              placeholder="请输入房型名称"
              v-model="roomInfo.roomTypeName">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="英文房型名称：" size="small">
            <el-input
              placeholder="请输入英文房型名称"
              v-model="roomInfo.roomTypeNameEn">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="床型名称：" size="small">
            <el-input
              placeholder="请输入床型名称"
              v-model="roomInfo.bedType">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="6" :offset="10">
        <el-button @click="cancelPush()">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="roomPush()">发布</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import SelectArea from '@/views/product/common/SelectArea'
  import TreeTable from '@/views/channel/alitrip/common/TreeTable'
  import AlitripApi from '@/api/channel/alitrip'
  import hotelProductApi from '@/api/product/hotelProduct'

  export default {
    name: 'ProductTable',
    components: {
      TreeTable,
      SelectArea
    },
    data() {
      return {
        hotelInfo: {},
        roomInfo: {
          roomTypeName: '',
          roomTypeNameEn: '',
          bedType: ''
        }
      }
    },
    mounted() {
      this.zwyHotelGet()
    },
    methods: {
      // 酒店列表
      zwyHotelGet() {
        const hotelId = this.$route.query.hotelId
        AlitripApi.zwyHotelGet(hotelId).then(res => {
          this.hotelInfo = res
        })
      },
      productLoad() {
        const productId = this.$route.query.productId
        hotelProductApi.load(productId).then(res => {
          this.productInfo = res.hotelProduct
        })
      },
      cancelPush() {
        this.$router.back(-1)
      },
      roomPush() {
        const params = {
          distributorMchId: this.$route.query.distributorMchId,
          channelHotelId: this.$route.query.channelHotelId,
          roomTypeName: this.roomInfo.roomTypeName,
          roomTypeNameEn: this.roomInfo.roomTypeNameEn,
          bedType: this.roomInfo.bedType
        }
        console.log(params)
        AlitripApi.roomPublish(params).then(res => {
          if (res.state === 'success') {
            this.$message({
              message: '发布成功',
              type: 'success'
            })
            this.$router.back(-1)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    }
  }
</script>
