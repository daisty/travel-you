<template>
  <div class="app-container">
    <el-main>
      <el-row class="title">
        酒店发布
      </el-row>

      <el-form ref="form" :model="hotelInfo" label-width="120px">
        <el-row>
          <el-col :span="16" class="area-class">
            <select-area @getAreaId="getAreaId" ref="selectArea"></select-area>
          </el-col>
        </el-row>
      <el-row>
        <el-col :span="8">
            <el-form-item label="酒店名称：" size="small">
              <el-input v-model="hotelInfo.hotelName"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="8">
          <span style="color: #F56C6C">*请修改为与飞猪酒店名称一致</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="英文酒店名称：" size="small">
            <el-input v-model="hotelInfo.hotelNameEn"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <span style="color: #F56C6C">*请修改为与飞猪酒店名称一致</span>
        </el-col>
      </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="酒店电话：" size="small">
              <el-input v-model="hotelInfo.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <span style="color: #F56C6C" class="el-icon-warning">*例如：0086#010#12345678 国家代码（最长6位）#区号（最长4位）#电话（最长20位）。国家代码提示：中国大陆0086、香港00852、澳门00853、台湾00886</span>
          </el-col>
        </el-row>
        <el-row>
        <el-col :span="8">
          <el-form-item label="酒店地址：" size="small">
            <el-input v-model="hotelInfo.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
      <el-row>
        <el-col :span="6" :offset="10">
          <el-button @click="cancelPush()">{{$t('common.cancel')}}</el-button>
          <el-button type="primary" @click="hotelPush()">发布</el-button>
        </el-col>
      </el-row>
    </el-main>
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
        initAreaId: 0,
        hotelInfo: {},
        areaId: {}
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
          this.initAreaId = res.areaId3 || res.areaId2 || res.areaId1
          // 手动调用子组件方法传值
          this.$refs['selectArea'].getForRead(this.initAreaId)
        })
      },
      productLoad() {
        const productId = this.$route.query.productId
        hotelProductApi.load(productId).then(res => {
          this.productInfo = res.hotelProduct
        })
      },
      // 地区组件值变化的时候进行回调获取
      getAreaId(val) {
        if (val.id) {
          this.areaId = val.id
        } else {
          this.areaId = '0'
        }
      },
      cancelPush() {
        this.$router.back(-1)
      },
      hotelPush() {
        const params = {
          distributorMchId: this.$route.query.distributorMchId,
          hotelId: this.$route.query.hotelId,
          hotelName: this.hotelInfo.hotelName,
          hotelNameEn: this.hotelInfo.hotelNameEn,
          hotelTel: this.hotelInfo.phone,
          hotelAddress: this.hotelInfo.address,
          cityId: this.areaId
        }
        AlitripApi.hotelPublish(params).then(res => {
          if (res.state === 'success') {
            this.$message({
              message: '发布成功',
              type: 'success'
            })
            this.$router.back(-1)
          } else {
            this.$message({
              message: res.msg,
              type: 'success'
            })
          }
        })
      }
    }
  }
</script>
<style scoped>

  .title {
    /*background: bisque;*/
    color: #555555;
    font-weight: bold;
    font-size: small;
    background-color: #D2E0F0;
    padding: 10px;
    border: 0px solid #D9B04C;
    margin-bottom: 15px;
    padding-left: 28px;
    background-position: 5px 5px;
  }

  .search-frame {
    margin-bottom: 15px;
  }
  .area-class {
    padding-left: 26px;
  }
</style>
