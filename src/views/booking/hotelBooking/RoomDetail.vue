<template>
  <div class="app-container">
    <!--产品信息-->
    <div class="title">
      {{ $t('hotelBooking.hotelDetail') }}
    </div>
    <table width="80%" border="0" cellspacing="0" cellpadding="0" class="hotelProduct">
      <tbody>
      <tr>
        <th>{{ $t('hotelProduct.id') }}：</th>
        <td colspan="3">&nbsp; {{ hotelProduct.id }}</td>
      </tr>
      <tr>
        <th width="120">{{ $t('hotelProduct.productName') }}：</th>
        <td colspan="3">&nbsp; {{ hotelProduct.productName }}</td>
      </tr>
      <tr>
        <th>{{ $t('hotelProduct.hotelName') }}：</th>
        <td colspan="3">&nbsp; {{ hotelProduct.hotelName }}</td>
      </tr>
      <tr>
        <th width="120">{{ $t('hotelInfo.hotelStar') }}：</th>
        <td v-if="hotelInfo.hotelStar === 0" width="230">&nbsp; {{ $t('hotelInfo.hotelStars')[0].label }}</td>
        <td v-else-if="hotelInfo.hotelStar === 1" width="230">&nbsp; {{ $t('hotelInfo.hotelStars')[1].label }}</td>
        <td v-else-if="hotelInfo.hotelStar === 2" width="230">&nbsp; {{ $t('hotelInfo.hotelStars')[2].label }}</td>
        <td v-else-if="hotelInfo.hotelStar === 3" width="230">&nbsp; {{ $t('hotelInfo.hotelStars')[3].label }}</td>
        <td v-else-if="hotelInfo.hotelStar === 4" width="230">&nbsp; {{ $t('hotelInfo.hotelStars')[4].label }}</td>
        <td v-else-if="hotelInfo.hotelStar === 5" width="230">&nbsp; {{ $t('hotelInfo.hotelStars')[5].label }}</td>
        <td v-else-if="hotelInfo.hotelStar === 6" width="230">&nbsp; {{ $t('hotelInfo.hotelStars')[6].label }}</td>
        <td v-else-if="hotelInfo.hotelStar === 7" width="230">&nbsp; {{ $t('hotelInfo.hotelStars')[7].label }}</td>
        <td v-else-if="hotelInfo.hotelStar === 8" width="230">&nbsp; {{ $t('hotelInfo.hotelStars')[8].label }}</td>
        <td v-else width="230">&nbsp; 无</td>
        <th width="120">所在城市：</th>
        <td width="230">&nbsp; 无
        </td>
      </tr>
      <tr>
        <th>{{ $t('hotelProduct.breakfastNum') }}：</th>
        <td v-if="hotelProduct.breakfastNum == 0 || hotelProduct.breakfastNum == underline"> &nbsp; 没有早餐 </td>
        <td v-else> &nbsp; 有 {{ hotelProduct.breakfastNum }} 份早餐</td>
        <th>{{ $t('addHotelProduct.broadband') }}：</th>
        <td v-if="hotelRoomInfo.hasInternet == 0 || hotelRoomInfo.hasInternet == underline">&nbsp; 没有宽带 </td>
        <td v-else>&nbsp; 有宽带</td>
      </tr>
      <tr>
        <th>{{ $t('hotelRoom.bedType') }}：</th>
        <td> &nbsp;{{ hotelRoomInfo.bedType }}</td>
        <th>{{ $t('addHotelProduct.allowAddBed') }}：</th>
        <td v-if="hotelRoomInfo.allowAddBed == 0 || hotelRoomInfo.allowAddBed == underline">&nbsp; 不能加床</td>
        <td v-else>&nbsp; 可加床</td>
      </tr>
      <tr>
        <th>{{ $t('hotelProduct.serialCheckinMin') }}：</th>
        <td v-if="hotelProduct.serialCheckinMin == 0 || hotelProduct.serialCheckinMin == underline"> &nbsp;无连住要求</td>
        <td v-else> &nbsp;需要连住 {{ hotelProduct.serialCheckinMin }} 晚</td>
        <th></th>
        <td>
        </td>
      </tr>
      </tbody>
    </table>
    <!--价格信息-->
    <div class="title">
      {{ $t('hotelBooking.priceAndPay') }}
    </div>
    <calendar :productId='this.$route.query.productId' ref="calendar"
              @setCalendarDayClear="setCalendarDayClear" @setData="setData"></calendar>

    <!--预订和退改说明-->
    <div class="title">
      {{ $t('hotelBooking.bookingAndCancel') }}
    </div>

    <table width="80%" border="0" cellspacing="0" cellpadding="8" align="center" class="hotelProduct">
      <tbody>
      <tr>
        <th width="230">{{ $t('priceStore.startDay') }}：</th>
        <td v-if="hotelProduct.earliestBookingDays == 0 || hotelRoomInfo.hasInternet == underline">
          &nbsp;当天可预订；并且只能在{{ hotelProduct.earliestBookingHourss }}时0分之前下单
        </td>
        <td v-else>
          &nbsp;需要提前 {{ hotelProduct.earliestBookingDays }} 天预订；并且只能在{{ hotelProduct.earliestBookingHourss }}时0分之前下单
        </td>
      </tr>
      <tr>
        <th>{{ $t('addProduct.orderConfirmationMethod') }}:</th>
        <td v-if="hotelProduct.confirmType == 0">&nbsp;延时确认</td>
        <td v-else-if="hotelProduct.confirmType == 1">&nbsp;即时确认</td>
        <td v-else>需要提前 {{ hotelProduct.latestBookingDays }}&nbsp;不确认</td>
      </tr>
      <tr>
        <th>{{ $t('hotelBooking.IsAllowRefund') }}：</th>
        <td v-if="hotelProduct.cancelPolicy == 1">&nbsp;允许退改 </td>
        <td v-else>&nbsp;不允许退改</td>
      </tr>
      <tr>
        <th>{{ $t('addProduct.backApplication') }}：</th>
        <td style="line-height: 20px;">{{ hotelProduct.cancelPolicyDesc }} </td>
      </tr>
      <tr>
        <th>其他说明：</th>
        <td style="line-height: 20px;">&nbsp;</td>
      </tr>
      </tbody>
    </table>

    <!--负责业务员信息-->
    <div class="title">
      {{ $t('hotelBooking.MchUserMsg') }}
    </div>
    <table width="80%" border="0" cellspacing="0" cellpadding="8" align="center" class="hotelProduct">
      <tbody>
      <tr>
        <th width="230px">{{ $t('merchantUser.displayName') }}：</th>
        <td>&nbsp; {{ userName }} </td>
      </tr>
      <tr>
        <th>{{ $t('merchantUser.mobile') }}：</th>
        <td>&nbsp; {{ userPhone }}</td>
      </tr>
      <tr>
        <th>{{ $t('merchantUser.email') }}：</th>
        <td>&nbsp; {{ userEmail }}</td>
      </tr>
      </tbody>
    </table>

    <!--产品详细描述-->
    <el-row>
      <el-row class="title">
        {{ $t('hotelProduct.productDesc') }}
      </el-row>

      <el-row>
        <table width="80%" border="0" cellspacing="0" cellpadding="8" align="center" class="hotelProduct">
          <tbody>
          <tr>
            <td v-html="hotelProduct.productDesc"></td>
          </tr>
          </tbody>
        </table>
      </el-row>

    </el-row>
    <!--预订按钮-->
    <el-row class="booking">
        <el-button type="primary" size="medium" @click="booking(hotelProduct.id)">{{$t('hotelProductPlan.booking')}}</el-button>

        <el-button size="medium" @click="close">{{$t('common.close')}}
      </el-button>
    </el-row>
  </div>
</template>


<script>
  import hotelProduct from '@/api/product/hotelProduct'
  import Calendar from '@/views/product/price/PriceCalendar'
  export default {
    components: {
      Calendar
    },
    data() {
      return {
        formData: {
          // 产品信息
          hotelProduct: {
          },
          // 产品详情信息
          hotelRoomInfo: {
          },
          // 酒店详情
          hotelInfo: {
          }
        },
        // 产品信息
        hotelProduct: {
        },
        // 产品详情信息
        hotelRoomInfo: {
        },
        // 酒店详情
        hotelInfo: {
        },
        // 业务员名字
        userName: '小王',
        // 业务员电话
        userPhone: '110',
        // 业务员邮箱
        userEmail: '136邮箱'
      }
    },
    created() {
      this.load()
    },
    methods: {
      // 加载房型详情（productId）
      load() {
        hotelProduct.load(this.$route.query.productId).then(res => {
          this.hotelProduct = res.hotelProduct
          this.hotelRoomInfo = res.hotelRoomInfo
          this.hotelInfo = res.hotelInfo
          // 表单信息
          this.formData.hotelProduct = res.hotelProduct
          this.formData.hotelRoomInfo = res.hotelRoomInfo
          this.formData.hotelInfo = res.hotelInfo
        })
      },
      setCalendarDayClear() {
        this.calendarDay = []
      },
      setData(year, month, obj, week) {
      },
      // 跳转订单预订
      booking(id) {
        this.$router.push({ path: '/booking/hotelBookings/orderBooking', query: { id: id }})
      },
      // 关闭
      close() {
        this.$router.push({ path: '/booking/hotelBookings/list' })
      }
    }
  }
</script>

<style type="text/css" scoped>
  .title {
    /*background: bisque;*/
    color: #555555;
    font-weight: bold;
    font-size: small;
    background-color: #D2E0F0;
    padding: 10px;
    border: 0 solid #D9B04C;
    margin-bottom: 15px;
    padding-left: 28px;
    background-position: 5px 5px;
  }
  table{
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
  .booking{
    margin-top: 20px;
    margin-left: 25px;
  }
</style>
