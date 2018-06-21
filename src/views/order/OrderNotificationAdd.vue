<template>
  <div class="app-container">
    <div id="print">
    <!--大标题-->
    <el-row>
        <div align="center" class="top-title">【{{ supplierMchInfo.mchName }}】预订确认单 </div>
    </el-row>
    <!--联系信息-->
    <el-row>
      <table width="70%" border="0" cellspacing="0" cellpadding="0" class="l_detail" >
        <tbody>
        <tr><td>确认单编号：</td><td colspan="3">&nbsp;</td></tr>
        <tr>
          <td width="120">收件人：</td>
          <td width="280">&nbsp;{{ supplierMchInfo.mchName }}</td>
          <td width="120">发 自：</td>
          <td width="320">&nbsp;{{ saasInfo.saasName }}</td>
        </tr>
        <tr>
          <td>邮箱：</td>
          <td>&nbsp;{{ supplierMchInfo.contactEmail }}</td>
          <td>邮箱,传真：</td>
          <td>&nbsp;{{ saasInfo.contactEmail }},{{ saasInfo.contactFax }}</td>
        </tr>
        <tr>
          <td>电 话：</td>
          <td>&nbsp;{{ supplierMchInfo.contactPhone }},{{ supplierMchInfo.contactMobile }}</td>
          <td>电 话：</td>
          <td v-if="userInfo.mobile === ''">&nbsp;{{ saasInfo.contactPhone }}</td>
          <td v-else>&nbsp;{{ userInfo.mobile }}</td>
        </tr>
        <tr>
          <td>发送日期：</td>
          <td>&nbsp;{{ today }}</td>
          <td>发送人：</td>
          <td>&nbsp;{{ userInfo.realName }}</td>
        </tr>
        </tbody>
      </table>
    </el-row>
    <!--订单信息-->
    <el-row>
      <table width="70%" border="0" cellspacing="0" cellpadding="0" class="l_detail" >
        <tbody>
        <tr>
          <th height="25">预订内容：</th>
          <td colspan="5">&nbsp;{{ hotelName }}&nbsp;{{ hotelOrder.productName }}</td>
        </tr>
        <tr>
          <th height="25">入住日期：</th>
          <td>&nbsp;{{ hotelOrder.checkinDate }}</td>
          <th>离店日期：</th>
          <td>&nbsp;{{ hotelOrder.checkoutDate }}</td>
        </tr>
        <tr>
          <th height="25">联系人：</th>
          <td colspan="5" style="line-height:25px;">&nbsp;{{ hotelOrder.contact_lastname }}{{ hotelOrder.contact_firstname }}</td>
        </tr>
        <tr>
          <th height="25">入住人备注：</th>
          <td colspan="5" style="line-height:25px;">&nbsp;{{ hotelOrder.guestMemo }}</td>
        </tr>
        <tr>
          <th>联系电话：</th>
          <td colspan="5">&nbsp;{{ hotelOrder.contacPhone }}</td>
        </tr>
        <tr>
          <td colspan="6"></td>
        </tr>
        </tbody>
      </table>
    </el-row>

    <!--支付金额 -->
    <el-row>
      <table width="70%" border="0" cellspacing="0" cellpadding="0" class="l_detail" >
        <tbody>
        <tr>
          <!--<th>&nbsp;</th>-->
          <th align="center">订单号</th>
          <th align="center">间数</th>
          <th align="center">小计</th>
        </tr>
        <tr>
          <!--<td width="40">-->
            <!--<input type="checkbox" name="order_id" value="25405076" checked="">-->
          <!--</td>-->
          <td align="center">{{ hotelOrder.id }}</td>
          <td align="center">{{ hotelOrder.totalProductNum }}</td>
          <td align="center">¥{{ hotelOrder.totalProductPrice }}</td>
        </tr>
      </tbody>
      </table>
    </el-row>
    <!--付款方式-->
    <el-row>
      <table width="70%" border="0" cellspacing="0" cellpadding="0" class="l_detail" >
        <tbody>
        <tr>
          <th colspan="2">本单结算(币种：人民币 CNY)</th>
        </tr>
        <tr>
          <td width="100">预付金额：</td>
          <td>&nbsp;签约价金额(人民币)合计：<b>{{ hotelOrder.totalProductPrice }} </b>元</td>
        </tr>
        </tbody>
      </table>
    </el-row>
    </div>
    <!--按钮区域-->
    <el-row>
      <table width="70%" border="0" cellspacing="0" cellpadding="0" >
        <tbody>
        <tr>
          <td>
            <el-button class="button" type="primary" size="medium" @click="notify(hotelOrder.id)">{{$t('hotelOrder.confirmCreateNotification')}}</el-button>
            <el-button class="button" type="primary" size="medium" @click="print">{{$t('hotelOrder.print')}}</el-button>
          </td>
        </tr>
        </tbody>
      </table>
    </el-row>
    <!--提醒信息-->
    <el-row>
      <table width="70%" border="0" cellspacing="0" cellpadding="0" >
        <tbody>
        <tr>
          <td class="noticedMsg">
            1、避免重复操作，接待通知单一旦确认生成，将修改订单的状态，该订单下次就不能再生成接待通知单了。<br/>
            2、已经生成的接待通知单在历史名单中可以再次浏览和打印。<br/>
            3、代理商登录后台可以浏览、下载或者打印接待通知单。
          </td>
        </tr>
        </tbody>
      </table>
    </el-row>
  </div>

</template>

<script>
  import hotelOrder from '@/api/order/hotelOrder'
  import { parseTime } from '@/utils/index'
  /**
   *  需要响应式的数据均需在data中提前写入
   */
  export default {
    data() {
      return {
        // 供应商信息
        supplierMchInfo: {
        },
        // 登录用户信息
        userInfo: this.$store.getters.userInfo,
        // 登录商信息
        saasInfo: {
        },
        // 订单信息
        hotelOrder: {
        },
        // 订单详情信息
        hotelOrderDetail: [],
        // 通知单信息
        orderNotification: {},
        hotelName: '',
        // 今天的日期
        today: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
      }
    },
    // 计算属性
    computed: {

    },
    // Vue生命周期函数
    created() {
      this.load()
    },
    // 自定义方法
    methods: {
      // 获取订单信息
      load() {
        hotelOrder.loadNotification(this.$route.query.id).then(res => {
          if (res.results && res.results.length && res.sizeAll !== '0') {
            this.hotelOrder = res.results[0]
            this.supplierMchInfo = res.results[1]
            this.saasInfo = res.results[2]
            this.hotelOrderDetail = res.results[3]
            this.hotelName = res.results[4].hotelName
            this.hotelOrder.checkinDate = parseTime(this.hotelOrder.checkinDate).substring(0, 10)
            this.hotelOrder.checkoutDate = parseTime(this.hotelOrder.checkoutDate).substring(0, 10)
          }
        })
      },
      // 生成通知单
      notify() {
        // 通知单组装
        this.createOrderNotification()
        hotelOrder.saveNotification(this.orderNotification).then(res => {
          if (res && res.state === 'success') {
            this.$message({
              type: 'success',
              message: '生成通知单成功'
            })
            this.$router.push({ path: '/order/hotelorders/listOrderNotification' })
          } else {
            this.$message({
              type: 'error',
              message: '生成通知单失败'
            })
          }
        })
      },
      // 打印功能
      print() {
        const subOutputRankPrint = document.getElementById('print')
        const newContent = subOutputRankPrint.innerHTML
        const oldContent = document.body.innerHTML
        document.body.innerHTML = newContent
        window.print()
        // 跳转页面，如果没有，再次点击打印则无法弹出打印界面
        window.location.reload()
        document.body.innerHTML = oldContent
      },
      // 拼凑通知单信息
      // saas_id、开始时间、结束时间、通知单标题、通知单创建用户名字、通知单对应的数量
      // 、预付金额（当成是整个订单的金额）、结算模式、货币种类、生成通知单时候对应的汇率（先暂时不理）
      // ,settle_type结算方式
      createOrderNotification() {
        let title = this.hotelOrder.checkinDate.substring(0, 10) + '(' + this.hotelOrder.id + ')(' + this.hotelOrder.totalProductNum + '间)'
        title = '[' + title + ']' + '[' + this.supplierMchInfo.mchName + ']预订确认单'
        this.orderNotification.saasId = this.userInfo.saasId
        this.orderNotification.orderId = this.hotelOrder.id
        this.orderNotification.supplierMchId = this.supplierMchInfo.id
        this.orderNotification.checkinDate = this.hotelOrder.checkinDate
        this.orderNotification.checkoutDate = this.hotelOrder.checkoutDate
        this.orderNotification.title = title
        this.orderNotification.createUser = this.userInfo.name
        this.orderNotification.num = this.hotelOrder.totalProductNum
        this.orderNotification.payMoney = this.hotelOrder.payPrice
        this.orderNotification.payMode = this.saasInfo.paymentMode
        this.orderNotification.currencyType = this.saasInfo.saasCurrency
        this.orderNotification.settleTypes = this.saasInfo.settleTypes
      }
    }
  }
</script>、
<style scoped>
  .top-left .top-right{
    float: left;
  }
  table{
       margin-left: 25px;
     }

  .l_detail th, .l_detail td {
    padding: 4px 10px 3px 4px;
    height: 40px;
    border-style: solid;
    border-width: 1px;
    font-weight: 400;
    border-color: #E4E4E4;
  }

  .l_detail th {
    background-color: #F2F2F2;
    text-align: center;
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
  }
  .button{
    float: left;
  }
  .noticedMsg {
    color: #915a15;
    font-weight: bold;
    background-color: #FFE9B2;
    padding: 5px;
    border: 1px solid #D9B04C;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 28px;
    background-repeat: no-repeat;
    background-position: 5px 5px;
    -moz-border-radius: 3px;
    border-radius: 3px;
  }
  .top-title{
    width:70%;
    font-size: 24px;
    font-weight: bold;
  }
  .el-row{
    margin-top: 20px;
  }
  @media print {
    table{
      width: 210mm;
    }
    .top-title{
      width:100%;
      font-size: 24px;
      font-weight: bold;
    }
  }
</style>
