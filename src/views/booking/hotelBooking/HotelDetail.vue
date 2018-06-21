<template>
  <div class="app-container">
    <!--酒店基本信息-->
    <div class="title">
      {{ $t('hotelBooking.hotelDetail') }}
    </div>

    <table width="80%" border="0" cellspacing="0" cellpadding="8" align="center" class="hotelProduct">
      <tbody>
      <tr>
        <th width="230px">{{ $t('hotelInfo.id') }}：</th>
        <td>&nbsp; {{ hotelInfo.id }} </td>
      </tr>
      <tr>
        <th>{{ $t('hotelInfo.hotelName') }}：</th>
        <td>&nbsp; {{ hotelInfo.hotelName }} </td>
      </tr>
      <tr>
        <th>{{ $t('hotelInfo.address') }}：</th>
        <td>&nbsp; {{ hotelInfo.address }}</td>
      </tr>
      <tr>
        <th>{{ $t('hotelInfo.phone') }}：</th>
        <td>&nbsp; {{ hotelInfo.phone }}</td>
      </tr>
      <tr>
        <th>{{ $t('hotelInfo.website') }}：</th>
        <td>&nbsp; {{ hotelInfo.website }}</td>
      </tr>
      </tbody>
    </table>

    <!--酒店房型信息-->
    <div class="title">
      {{ $t('hotelBooking.roomDetail') }}
    </div>

    <el-table :data="tableData" v-loading="tableLoading" element-loading-text="Loading" border fit
              highlight-current-row>
      <el-table-column align="center" :label="$t('hotelProduct.id')" width="150px">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('hotelProduct.productName')" align="center">
        <template slot-scope="scope">
          <router-link :to="{ path: '/booking/hotelBookings/listHotelProduct',
             query: { productId: scope.row.id, hotelStar: hotelInfo.hotelStar }}"
                       style="color: blue">
            {{scope.row.productName}}
          </router-link>
        </template>
      </el-table-column>

      <el-table-column :label="$t('hotelProductPlan.priceCodex')" width="150px" align="center">
        <template slot-scope="scope">
          <span style="color: red">￥{{scope.row.minPrice}}起</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('hotelProductPlan.salePriceCodex')" width="150px" align="center">
        <template slot-scope="scope">
          <span style="color: red">￥{{scope.row.minSalePrice}}起</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.operation')" width="200px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="booking(scope.row.id)">{{$t('hotelProductPlan.booking')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>


<script>
  import hotelBooking from '@/api/booking/hotelBooking'
  export default {
    data() {
      return {
        // 表格信息
        tableData: [],
        tableLoading: true,
        // 酒店信息
        hotelInfo: {},
        // 产品房型数组
        hotelProducts: [],
        rules: {}
      }
    },
    created() {
      this.loadHotel()
      this.loadRoom()
    },
    methods: {
      // 加载酒店详情
      loadHotel() {
        const params = {
          hotelId: this.$route.query.hotelId,
          areaId: 0
        }
        hotelBooking.loadHotel(params).then(res => {
          this.hotelInfo = res
        })
      },
      // 加载房型详情
      loadRoom() {
        hotelBooking.listHotelProduct(this.$route.query.hotelId).then(res => {
          if (res.results && res.results.length && res.sizeAll !== '0') {
            const arr = res.results
            const idArr = arr.map(ele => ele.id)
            this.loadMinPrice(idArr.join(','), arr)
          } else {
            this.tableData = null
          }
          this.tableLoading = false
        })
      },
      // 获取分销价和零售价
      loadMinPrice(ids, arr) {
        hotelBooking.loadMinPrice(ids, new Date(this.$route.query.sdate), new Date(this.$route.query.edate)).then(res => {
          arr.forEach((ele, index) => {
            ele.minSalePrice = res[index][0]
            ele.minPrice = res[index][1]
          })
          this.tableData = arr
          // let i = this.tableData.length
          // 去除价格为0的房型
          // while (i--) {
          //   if (this.tableData[i].minSalePrice === 0 || this.tableData[i].minPrice === 0) {
          //    this.tableData.splice(i, 1)
          //  }
          // }
        })
      },
      // 跳转订单预订
      booking(id) {
        this.$router.push({ path: '/booking/hotelBookings/orderBooking', query: { id: id }})
      }
    }
  }
</script>

<style type="text/css" scoped>

  .hotelProduct {
    margin-left: 25px;
  }

  .hotelProduct th, .hotelProduct td {
    padding: 4px 10px 3px 4px;
    height: 40px;
    border-style: solid;
    border-width: 1px;
    font-weight: 400;
    border-color: #E4E4E4;
  }

  .hotelProduct th {
    background-color: #F2F2F2;
    text-align: center;
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
  }

</style>
