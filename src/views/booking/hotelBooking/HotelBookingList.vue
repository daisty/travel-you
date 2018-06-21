<template>
  <div class="app-container">
    <!--搜索栏-->
    <el-form size="small" label-width="68px" label-position="left" class="boldform">
      <el-row :gutter="20">
        <el-col :span=24>
          <el-form-item label="酒店地区">
            <select-area @getAreaId="getAreaId" ref="selectArea"></select-area>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span=6>
          <el-form-item :label="$t('hotelProduct.checkInDate')">
            <el-date-picker
              v-model="allDate"
              type="daterange"
              size="small"
              :picker-options="validatorDate"
              :start-placeholder="$t('calendar.startDate')"
              :end-placeholder="$t('calendar.endDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="支付方式">
            <el-select  v-model="isOnlinePay" placeholder="请选择">
              <el-option v-for="item in $t('hotelProduct.isOnlinePays')"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="20">
        <el-col :span=6>
          <el-form-item :label="$t('hotelProductTable.hotelName')">
            <el-input :placeholder="$t('common.pleaseEnter',{name:$t('hotelProductTable.hotelName')})" v-model="hotelName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=4>
          <el-form-item label="酒店星级">
            <el-select  v-model="hotelStar" placeholder="请选择">
              <el-option
                v-for="item in hotelStars"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span=4>
          <el-form-item :label="$t('hotelProduct.confirmType')">
           <!-- <el-select>
              <el-option :value="2" :label="$t('hotelProduct.confirmTypes')[2].label"/>
              <el-option :value="1" :label="$t('hotelProduct.confirmTypes')[1].label"/>
              <el-option :value="0" :label="$t('hotelProduct.confirmTypes')[0].label"/>
            </el-select>-->
            <el-select  v-model="confirmType" placeholder="请选择">
              <el-option
                v-for="item in $t('hotelProduct.confirmTypes')"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span=6>
          <el-form-item label-width="0">
            <el-button type="primary" size="small" @click="search">{{$t('common.search')}}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 数据展示表格 -->
    <el-table :data="tableData" v-loading="tableLoading" element-loading-text="Loading" border
              highlight-current-row ref="hotelTable" @expand-change="onHotelRowExpand">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!--产品列表-不分页-->
          <el-table :data="scope.row.tableData" v-loading="productTableLoading" element-loading-text="Loading" border
                    highlight-current-row width="100%"><!--@expand-change="onExpand"-->
            <!--<el-table-column type="expand">
              <template slot-scope="productScope" style="background-color:lavender">
                &lt;!&ndash;默认价格计划&ndash;&gt;
                <div class="room">
                  <div  class="room-name">
                    <span style="font-weight:bold">标准价</span>
                  </div>
                  <div class="room-detail">
                    <span>
                      <span v-if="productScope.row.maxAdvMinutes == 0">可当天预订</span>
                      <span v-else-if="productScope.row.maxAdvMinutes < 1440">
                        可当天预订，必须在当天 {{ productScope.row.maxAdvMinutes | formatHour }} 时 0 分之前下单。
                      </span>
                      <span v-else-if="productScope.row.maxAdvMinutes > 1440">
                        需要提前{{ productScope.row.maxAdvMinutes | formatMin }} 天预订，最迟那一天必须在 {{ productScope.row.maxAdvMinutes | formatHour }} 时 0 分之前下单。
                      </span>
                      <span v-else-if="productScope.row.maxAdvMinutes = 1440">需要提前 1 天预订</span>
                      <span style="margin-right: 100px"></span>
                    </span>
                  </div>
                  <div class="room-price">
                    &lt;!&ndash;最低价格取此酒店的最低价&ndash;&gt;
                    <span class="price" v-if="productScope.row.minPrice === 0">暂无价格</span>
                    <span class="price" v-else>￥{{productScope.row.minPrice}}起</span>
                  </div>
                  <div class="room-button">
                    <el-button style="margin-top: -2px;" type="success" size="mini" round @click="booking(productScope.row.minPrice, productScope.row.id)">{{$t('hotelProductPlan.booking')}}</el-button>
                  </div>
                </div>
                &lt;!&ndash;如果还有价格计划&ndash;&gt;
                &lt;!&ndash;<div v-if="productScope.row.hotelProductPlans != null">&ndash;&gt;
                  <div class="room" v-for="item in productScope.row.hotelProductPlans">
                    <div  class="room-name">
                      <span>{{ item.name }}</span>
                    </div>
                    <div class="room-detail">
                      <span v-if="item.minDays == 0">最少连住晚数：不限</span>
                      <span v-else>需要提前 {{ item.minDays }} 天,最少连住晚数：{{ item.minDays }} 天</span>
                      <span v-if="item.minRoomNum == 0">,最少预订间数：不限</span>
                      <span v-else>最少预订间数：{{ item.minRoomNum }} 间</span>
                    </div>
                    <div class="room-price">
                      &lt;!&ndash;最低价格取此酒店的最低价&ndash;&gt;
                      <span class="price" v-if="productScope.row.minPrice === 0">暂无价格</span>
                      <span class="price" v-else>￥{{productScope.row.minPrice}}起</span>
                    </div>
                    <div class="room-button">
                      <el-button style="margin-top: -2px;" type="success" size="mini" round @click="anotherBooking(productScope.row.minPrice, item.productId, item.id)">{{$t('hotelProductPlan.booking')}}</el-button>
                    </div>
                  </div>
                &lt;!&ndash;</div>&ndash;&gt;
              </template>
            </el-table-column>-->
            <el-table-column align="center" :label="$t('hotelProduct.productName')" class="box-img" >
              <template slot-scope="productScope">
                <router-link class='url' :to="{ path: '/booking/hotelBookings/listHotelProduct',
                  query: { productId: productScope.row.id }}">
                  {{productScope.row.hotelName + ' ' + productScope.row.roomName}}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column align="center" label="房型" >
              <template slot-scope="productScope">
                <span>{{productScope.row.bedType}}</span>
                <!--<span v-if="scope.row.hotelRoomInfo.allowAddBed == 0">({{ $t('hotelProduct.allowAddBeds')[0].label }}),</span>
                <span v-else>{{ $t('hotelProduct.allowAddBeds')[1].label }}</span>
                <span v-if="scope.row.hotelRoomInfo.hasInternet == '0'">{{ $t('hotelProduct.hasInternets')[0].label }}</span>
                <span v-else>{{ $t('hotelProduct.hasInternets')[1].label }}</span>-->
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('预定政策')" width="350px">
              <template slot-scope="productScope">
                提前预订时间 {{timeWithUnit(minute2DHM(scope.row.minAdvMinutes))}} ~ {{timeWithUnit(minute2DHM(scope.row.maxAdvMinutes))}}<br>
                入住天数 {{scope.row.minDays}}天 ~ {{scope.row.maxDays}}天 <br>
                预订间数 {{scope.row.minRoomNum}}间 ~ {{scope.row.maxRoomNum}}间
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('hotelProductPlan.priceCodex')" width="250px">
              <template slot-scope="productScope">
                <span class="price" v-if="productScope.row.minPrice === 0">暂无价格</span>
                <span class="price" v-else>￥{{productScope.row.minPrice / 100}}起</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('操作')" class="box-img" >
              <template slot-scope="productScope">
                <!--<div class="room-button">-->
                  <el-button style="margin-top: -2px;" type="success" size="mini" round @click="booking(productScope.row.minPrice, productScope.row.id)">{{$t('hotelProductPlan.booking')}}</el-button>
                <!--</div>-->
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" label="酒店名称">
        <template slot-scope="scope">
          <div class="box-img">
            <div v-if="!scope.row.hotelInfo.imgMain">
              <img src="http://qnimg.zowoyoo.com/img/15463/1509533934407.jpg"/>
            </div>
            <div v-else>
              <img :src="scope.row.hotelInfo.imgMain"/>
            </div>
          </div>
          <div  class="box-text">
            <router-link class='url' :to="{ path: '/booking/hotelBookings/hotelDetail',
             query: { hotelId: scope.row.hotelId, sdate: allDate[0].getTime(), edate: allDate[1].getTime()}}">
              {{scope.row.hotelName}}
            </router-link>
            <span v-if="scope.row.hotelInfo.hotelNameEn !== undefined" style="margin-left: 10px;color: silver;">({{ scope.row.hotelInfo.hotelNameEn }})</span>
          </div>
          <!--<div>{{scope.row.hotelInfo.address}}</div>-->
        </template>
      </el-table-column>
      <el-table-column align="center" label="酒店地址" prop="hotelInfo.address"></el-table-column>
      <el-table-column align="center" label="酒店电话" prop="hotelInfo.phone"></el-table-column>
      <el-table-column align="center" label="酒店星级" >
        <template slot-scope="scope">
          {{scope.row.hotelStar}}星级
        </template>
      </el-table-column>
      <!--<el-table-column align="center" :label="$t('房间数量')" width="200px" class="box-img">
        <template slot-scope="scope">
          {{scope.row.hotelInfo.roomNum}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('公共服务')" width="200px" class="box-img">
        <template slot-scope="scope">
          {{scope.row.hotelInfo.infoService}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('娱乐服务')" width="200px" class="box-img">
        <template slot-scope="scope">
          {{scope.row.hotelInfo.infoEntertainment}}
        </template>
      </el-table-column>-->
      <el-table-column align="center" :label="$t('价格')" class="box-img" >
        <template slot-scope="scope">
          <span class="price">￥{{scope.row.productPrice / 100}}起</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页内容 -->
    <div class="pagination-container text-right">
      <el-pagination
        background
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10,20, 50, 100]"
        :page-size="resultNum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import hotelBooking from '@/api/booking/hotelBooking'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'
  import SelectArea from '@/views/product/common/SelectArea'
  export default {
    components: {
      ElCol,
      ElRow,
      SelectArea
    },
    name: 'ListHotel',
    data() {
      return {
        // 表格数据源
        tableData: null,
        tableLoading: true,
        productTableLoading: false,
        // 默认今天到明天
        allDate: [
          new Date(),
          new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        ],
        // 支付方式
        isOnlinePay: 2,
        // 确认方式
        confirmType: -1,
        formLabelWidth: '120px',
        // 酒店名称关键字
        hotelName: '',
        areaId: '', // 酒店地区id
        hotelStar: 0, // 酒店星级
        hotelStars: [
          { label: '全部', value: 0 },
          { label: '一星级', value: 1 },
          { label: '二星级', value: 2 },
          { label: '三星级', value: 3 },
          { label: '四星级', value: 4 },
          { label: '五星级', value: 5 },
          { label: '六星级', value: 6 },
          { label: '七星级', value: 7 }
        ], // 酒店星级
        // 当前页
        currentPage: 1,
        // 每页条数
        resultNum: 10,
        // 总条数
        total: 0,
        formLoading: false,
        // 无法选择昨天以前
        validatorDate: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e6
          }
        }
      }
    },
    filters: {
      // 转换成小时
      formatHour(val) {
        return parseInt((val % 1440) / 24)
      },
      // 转换成分钟
      formatMin(val) {
        return parseInt(val / 1440)
      }
    },
    mounted() {
      this.list()
    },
    methods: {
      // 获取所有酒店
      list() {
        const params = {
          page: this.currentPage,
          resultNum: this.resultNum,
          hotelName: this.hotelName,
          isOnlinePay: this.isOnlinePay,
          confirmType: this.confirmType,
          areaId: this.areaId,
          hotelStar: this.hotelStar,
          sdate: this.allDate[0],
          edate: this.allDate[1]
        }
        this.tableLoading = true
        hotelBooking.list(params).then(res => {
          if (res && res.results && res.results.length && res.sizeAll !== '0') {
            this.tableData = res.results
            this.total = res.sizeAll
          } else {
            this.tableData = null
            this.total = 0
          }
        }).finally(() => {
          this.tableLoading = false
        })
      },
      // 获取指定酒店所有产品,并赋值到选中的酒店行
      listProducts(hotelId, row) {
        const params = {
          hotelId,
          sdate: this.allDate[0],
          edate: this.allDate[1]
        }
        this.productTableLoading = true
        hotelBooking.listForBooking(params).then(res => {
          if (res) {
            // 先定义产品计划列表
            res.results.forEach(row => {
              row.hotelProductPlans = []
            })
            row.tableData = res.results
          }
        }).finally(() => {
          this.productTableLoading = false
        })
      },
      // 搜索按钮
      search() {
        this.currentPage = 1
        this.list()
      },
      // 酒店列表行展开 -- 查询酒店下所有产品
      onHotelRowExpand(row, expandRows) {
        // 由于展开和折叠都会进入此方法，则需要判断当前行是否展开，展开才请求数据
        if (expandRows.indexOf(row) === -1) {
          return false
        }
        this.listProducts(row.hotelId, row)
      },
      // 跳转订单预订
      booking(minPrice, productId) {
        if (minPrice === 0) {
          this.$message({
            type: 'warning',
            message: '此酒店暂时无法预订！'
          })
        } else {
          this.$router.push({ path: '/booking/hotelBookings/orderBooking', query: { productId: productId, sdate: this.allDate[0].getTime(), edate: this.allDate[1].getTime() }})
        }
      },
      // 跳转订单预订
      anotherBooking(minPrice, productId, planId) {
        if (minPrice === 0) {
          this.$message({
            type: 'warning',
            message: '此酒店暂时无法预订！'
          })
        } else {
          this.$router.push({ path: '/booking/hotelBookings/orderBooking', query: { productId: productId, planId: planId, sdate: this.allDate[0].getTime(), edate: this.allDate[1].getTime() }})
        }
      },
      // 将分钟数转成天、时、分
      minute2DHM(minuteNum) {
        const time = {
          days: 0,
          hours: 0,
          minutes: 0
        }
        if (minuteNum >= (60 * 24)) {
          time.days = Math.floor(minuteNum / (60 * 24))
        }
        if (minuteNum >= (60 * 24)) {
          time.hours = Math.floor((minuteNum % (60 * 24)) / 60)
        } else {
          time.hours = Math.floor(minuteNum / 60)
        }
        if (minuteNum >= 60) {
          time.minutes = Math.floor(minuteNum % 60)
        } else {
          time.minutes = minuteNum
        }
        return time
      },
      // 将天、时、分带上单位-- 4天7小时30分
      timeWithUnit(obj) {
        const day = obj.days ? obj.days + '天' : ''
        const hours = obj.hours ? obj.hours + '小时' : ''
        const minutes = obj.minutes ? obj.minutes + '分钟' : ''
        return day + hours + minutes || 0
      },
      // 地区组件值变化的时候进行回调获取
      getAreaId(val) {
        this.areaId = val.id
      },
      // 切换每页显示条数
      onSizeChange(val) {
        this.resultNum = val
        this.list()
      },
      // 切换当前页
      onCurrentChange(val) {
        this.currentPage = val
        this.list()
      }
    }
  }
</script>
<style scoped>
  img{
    width: 120px ;
    height: 80px ;
    padding: 2px
  }

  .price{
    color: red
  }
  .url{
    color: #0063dc;
  }
  .box-img {
    float:left;
    margin-right: 20px
  }
  .box-text {
    font-size: 17px;
    color: #26418c;
    margin-bottom: 30px;
  }
  .room{
    background-color:#f5f5f5;
    padding: 9px 31px;
    width: 100%;
    height: 40px;
  }
  .room-name{
    float: left;
    width: 200px;
    font-weight:bold;
  }
  .room-detail{
    float: left;
    width: 500px;
  }
  .room-price{
    float: left;
    width: 210px;
  }
  .room-button{
    float: right;
    margin-bottom: 1px;
    width: 150px;
  }
</style>
