<template>
  <div class="app-container">
    <div class="title">
      酒店发布
    </div>
    <el-collapse v-model="activeHotel" @change="handleChange">
      <el-collapse-item title="酒店信息" name="1">
        <div v-if="hotelInfo">
          <div>飞猪酒店名： {{hotelInfo.channelHotelName}} ({{hotelInfo.channelHotelId}})</div>
          <div>飞猪地址： {{hotelInfo.channelHotelAddress}}</div>
        </div>
        <span v-if="hotelInfo === null">
            <div>系统酒店名： {{zwyHotelInfo.hotelName}} ({{zwyHotelInfo.id}})</div>
            <div>系统地址： {{zwyHotelInfo.address}}</div>
            <el-button type="primary" size="small"><router-link
              :to="{path:'/channel/alitrip/hotel', query: {distributorMchId:this.$route.query.distributorMchId,hotelId:productInfo.hotelId}}">立即发布</router-link>
            </el-button>
          </span>
      </el-collapse-item>
    </el-collapse>
    <div class="title">
      房型发布
    </div>
    <el-collapse v-model="activeRoom" @change="handleChange">
      <el-collapse-item title="房型列表" name="1">
        <el-row>
          <div v-if="roomkey">
            <el-radio-group v-model="roomkey">
              <el-radio v-for="room in roomList" :label="room.channelRoomId" :key="room.channelRoomId">
                {{room.channelRoomName}}({{room.channelRoomId}})
              </el-radio>
            </el-radio-group>
          </div>
          <div v-else>
            该酒店尚未发布房型
          </div>
        </el-row>
        <el-row>
        <span style="color: #F56C6C" class="el-icon-warning">
              提示：选择房型，不用重新发布。注意：一旦发布，不能修改。
        </span>
        </el-row>
        <el-row>
        <el-button type="primary" size="small" v-if="hotelInfo">
          <router-link
            :to="{path:'/channel/alitrip/room', query: {distributorMchId:this.$route.query.distributorMchId,hotelId:productInfo.hotelId,channelHotelId:hotelInfo.channelHotelId}}">
            发布新房型
          </router-link>
        </el-button>
        <span style="color: #F56C6C" class="el-icon-warning">
              提示：如果以上没有你想发布的房型则先去发布房型！
        </span>
        </el-row>
      </el-collapse-item>
    </el-collapse>
    <div class="title">
      产品发布
    </div>
    <el-collapse v-model="activeProduct" @change="handleChange">
      <el-collapse-item title="产品信息：" name="1">
        <el-form ref="form" :model="productInfo" label-width="125px">
          <el-row>
            <el-form-item label="产品名称：" size="small">
              {{productTitle}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="政策名称：">
                <el-input v-model="productInfo.roomName" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              *不要包含早餐信息
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-form-item label="设置申请房：">
                <el-switch
                  v-model="productPublishData.pushApplySet" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="申请房推送间数：">
                <el-input v-model="productPublishData.applyNumSet" placeholder="" size="mini"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="销售渠道：">
              <el-checkbox-group v-model="productPublishData.selectChannel">
                <el-checkbox v-for="channel in alitripChannels" :label="channel.value" :key="channel.value">{{channel.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-button type="primary" size="small" v-if="roomkey" @click="productPublish()">
                发布
              </el-button>
              <span v-else style="color: #F56C6C" class="el-icon-warning">
              发布产品前，请先选择对应房型!!!
              </span>
            </el-col>
            <el-col :span="4">
              <el-button  type="danger" size="small">
                <router-link :to="{path:'/channel/alitrip/hotelList', query: {distributorMchId:this.$route.query.distributorMchId}}">返回</router-link>
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
  import SelectArea from '@/views/product/common/SelectArea'
  import TreeTable from '@/views/channel/alitrip/common/TreeTable'
  import AlitripApi from '@/api/channel/alitrip'
  import hotelProductApi from '@/api/product/hotelProduct'
  import ElRow from 'element-ui/packages/row/src/row'

  export default {
    name: 'ProductTable',
    components: {
      ElRow,
      TreeTable,
      SelectArea
    },
    data() {
      return {
        hotelInfo: {},
        roomList: [],
        roomkey: '',
        productInfo: {},
        activeHotel: ['1'],
        activeRoom: ['1'],
        activeProduct: ['1'],
        zwyHotelInfo: {},
        alitripChannels: [{
          value: 'H',
          label: '飞猪'
        }, {
          value: 'M',
          label: '无线专享价'
        }, {
          value: 'O',
          label: '钉钉商旅'
        }, {
          value: 'A',
          label: '集团内部商旅'
        }],
        productTitle: '',
        productPublishData: {
          pushApplySet: false,
          applyNumSet: 0,
          alitripChannel: '',
          selectChannel: []
        }
      }
    },
    mounted() {
      this.hotelGet()
      this.productLoad()
    },
    methods: {
      // 酒店列表
      hotelGet() {
        const searchHotel = {
          hotelId: this.$route.query.hotelId,
          distributorMchId: this.$route.query.distributorMchId
        }
        AlitripApi.hotelGet(searchHotel).then(res => {
          this.hotelInfo = res
          if (this.hotelInfo) {
            const searchRoom = {
              channelHotelId: this.hotelInfo.channelHotelId,
              distributorMchId: this.$route.query.distributorMchId
            }
            AlitripApi.roomListGet(searchRoom).then(res => {
              this.roomList = res.results
              if (this.roomList) {
                this.roomkey = this.roomList[0].channelRoomId
              }
            })
          }
        })
      },
      productLoad() {
        const productId = this.$route.query.productId
        hotelProductApi.load(productId).then(res => {
          this.productInfo = res.hotelProduct
          this.zwyHotelInfo = res.hotelInfo
          this.productTitle = (this.productInfo.hotelName ? this.productInfo.hotelName : '') + ' ' + (this.productInfo.roomName ? this.productInfo.roomName : '') + ' ' + (this.productInfo.productTag ? this.productInfo.productTag : '')
        })
      },
      productPublish() {
        if (this.productPublishData.selectChannel) {
          this.productPublishData.alitripChannel = ''
          for (var i = 0; i < this.productPublishData.selectChannel.length; i++) {
            if (i > 0) {
              this.productPublishData.alitripChannel = this.productPublishData.alitripChannel + ','
            }
            this.productPublishData.alitripChannel = this.productPublishData.alitripChannel + this.productPublishData.selectChannel[i]
          }
        } else {
          this.productPublishData.alitripChannel = ''
        }
        const params = {
          distributorMchId: this.$route.query.distributorMchId,
          channelHotelId: this.hotelInfo.channelHotelId,
          hotelProductId: this.$route.query.productId,
          planId: this.$route.query.planId,
          channelRoomId: this.roomkey,
          alitripChannel: this.productPublishData.alitripChannel,
          pushApplySet: this.productPublishData.pushApplySet ? 1 : 0,
          applyNumSet: this.productPublishData.applyNumSet,
          rpName: this.productInfo.roomName
        }
        AlitripApi.prodPublish(params).then(res => {
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
      },
      handleChange(val) {
        console.log(val)
      }
    }
  }
</script>
