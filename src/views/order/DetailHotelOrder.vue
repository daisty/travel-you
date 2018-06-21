<template>
  <div class="app-container">
    <el-form ref="orderDetailForm" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-tabs type="border-card">
            <el-tab-pane label="订单信息">
              <el-row :gutter="0">
                <el-col :span="6">
                  <!--<span class="titleSpanClass">订单号：</span>-->
                  <el-form-item label="订单号" class="titleSpanClass">
                    {{order.id}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="入住日期" class="">
                    {{order.checkinDate | formatTimeFilter('{y}-{m}-{d}')}}~{{order.checkoutDate | formatTimeFilter('{y}-{m}-{d}')}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="0">
                <el-col :span="6"><!--<span class="titleSpanClass">状态：</span>{{computedOrderState(order.orderState)}}-->
                  <el-form-item label="状态" class="">
                    {{computedOrderState(order.orderState)}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="下单时间" class="">
                    {{order.createDate | formatTimeFilter}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="0">
                <el-col :span="6">
                  <el-form-item label="分销商" class="">
                    {{order.supplierName}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="供应商" class="">
                    {{order.distributorName}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date"></i> 操作日志</span>
              操作日志
            </el-tab-pane>
            <el-tab-pane label="变更日志">变更日志</el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
        <el-row>
          <el-col :span="24">
            <el-table :data="orderDetailData" style="width: 100%" >
              <el-table-column prop="productName" label="产品名称" width="280">
                <template slot-scope="scope">
                  {{product.productName}}<!--<br/>{{scope.row.checkinDate}}-->
                </template>
              </el-table-column>
              <el-table-column prop="supplierPrice" label="协议价" width="180">
                <template slot-scope="scope">
                  {{scope.row.conferPrice}}
                </template>
              </el-table-column>

              <el-table-column prop="channelPrice" label="分销价">
                <template slot-scope="scope">
                  {{scope.row.price}}
                </template>
              </el-table-column>
              <el-table-column prop="date" label="零售价" width="180">
                <template slot-scope="scope">
                  {{scope.row.salePrice}}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="数量" width="180">
                <template slot-scope="scope">
                  {{scope.row.totalNum}}
                </template>
              </el-table-column>
              <el-table-column prop="address" label="结算金额">
                <template slot-scope="scope">
                  {{(scope.row.salePrice)*scope.row.totalNum | filterMoney}}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="分销商利润" width="180">
                <template slot-scope="scope">
                  {{((scope.row.salePrice) - (scope.row.price))*scope.row.totalNum | filterMoney}}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="供应商利润" width="180">
                <template slot-scope="scope">
                  {{((scope.row.price) - (scope.row.conferPrice))*scope.row.totalNum | filterMoney}}
                </template>
              </el-table-column>
              <el-table-column prop="address" label="奖励">
                <template slot-scope="scope">
                  {{scope.row.totalOrderPrice }}
                </template>
              </el-table-column>
            </el-table>
            <br>
            <br>
          </el-col>
          <el-col :span="24">
            <font style="text-align: right;display: block;padding-right: 80px;">订单采购总价: {{order.totalOrderPrice}}，订单分销总价：{{order.channelPrice}}，本币价格公式：</font><hr/>
          </el-col>
        </el-row>
        <br>

        <el-row>
          <header class="block-title" style=""> 订单处理流程 </header>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-card class="box-card">
              <div><font>预订环节</font></div>
              <br>
              <el-steps :space="200" :active="this.isPayState" finish-status="success">
                <el-step v-for="(item, index) in payStates" :title="item.label" :description="item.value"
                         :key="index"></el-step>
              </el-steps>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card">
              <div><font>计调环节：</font></div>
              <br>
              <el-steps :space="200" :active="this.isNoticeState" finish-status="success">
                <el-step v-for="(item, index) in noticeStates" :title="item.label" :description="item.value"
                         :key="index"></el-step>
              </el-steps>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card">
              <div><font>结算环节：</font></div>
              <br>
              <el-steps :space="200" :active="this.isClearState" finish-status="success">
                <el-step v-for="(item, index) in clearStates" :title="item.label" :description="item.value"
                         :key="index"></el-step>
              </el-steps>
            </el-card>
          </el-col>
        </el-row>

        <el-row>
          <header class="block-title" style="">联系人资料</header>
        </el-row>
        <el-row>
          <el-col :span="3">
            <el-form-item label="联系人" class="">
              {{order.contactName}}
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="电话" class="">
              {{order.contactPhone}}
            </el-form-item>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>

        <el-row>
          <header class="block-title" style="">入住人资料</header>
        </el-row>
        <el-row>
          <el-row v-for="(people, index) in peopleListData" :key="index" class="text item">
            <el-col :span="3">
              <el-form-item label="联系人" class="">
                {{people.contactName}}
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="电话" class="">
                {{people.contactPhone}}
              </el-form-item>
            </el-col>
            <el-col :span="8"></el-col>
          </el-row>
        </el-row>
        <br>

        <el-row>
          <header class="block-title" style="">
            渠道对接信息<span style="color:#008000;width: 1200px; display:inline-block;"></span>
          </header>
        </el-row>
        <el-row>
          <el-col :span="5">
            <div style="margin: 10px 0;"><font>待提供</font></div>
          </el-col>
        </el-row>

        <el-row>
          <header class="block-title" style="">
            接口信息<span style="color:#008000;width: 1200px; display:inline-block;"></span>
          </header>
        </el-row>
        <el-row>
          <el-col :span="5">
            <div style="margin: 10px 0;"><font>待提供</font></div>
          </el-col>
        </el-row>

        <el-row>
          <header class="block-title" style="">
            订单备注<span style="color:#008000;width: 1200px; display:inline-block;"></span>
          </header>
        </el-row>
        <!--<el-row>
          <el-col :span="12">
            游客备注:<font style="font-size: 16px;color: red;">{{order.guestMemo}}</font><br/>
            公共备注:
            <div v-for="(oc, index) in orderMemos" :key="index" class="text item">{{oc.date}} - <font
              style="font-size: 16px;color: red;">{{oc.content}}</font>
            </div>
          </el-col>
          <el-col :span="12">
            内部备注:
            <div v-for="(ic, index) in innerMemos" :key="index" class="text item">
              {{ic.date}} - <font style="font-size: 16px;color: red;">{{ic.content}}</font>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span class="SpanClass">公共备注（分销商，供应商可见）</span>
            <el-input
              placeholder="请输入公共备注"
              v-model="orderMemo"
              clearable>
              <el-button slot="append" icon="el-icon-circle-plus" @click="updateOrderMemo(order,'PUBLIC')"></el-button>
            </el-input>
          </el-col>
          <el-col :span="12">
            <span class="SpanClass">内部备注（分销商、供应商均不可见）</span>
            <el-input
              placeholder="请输入内部备注"
              v-model="innerMemo"
              clearable>
              <el-button slot="append" icon="el-icon-circle-plus" @click="updateOrderMemo(order,'PRIVATE')"></el-button>
            </el-input>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="8">
            <el-form-item label="游客备注" class="">
              {{order.guestMemo}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公共备注" class="">
              <div v-for="(oc, index) in orderMemos" :key="index" class="text item">
                {{oc.date}} - <font style="font-size: 16px;color: red;">{{oc.content}}</font>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="isSaas">
            <el-form-item label="内部备注" class="">
              <div v-for="(ic, index) in innerMemos" :key="index" class="text item">
                {{ic.date}} - <font style="font-size: 16px;color: red;">{{ic.content}}</font>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :offset="8">
            <el-form-item label="添加公共备注" class="">
              <el-input
                style="width: 90%"
                placeholder="请输入公共备注"
                v-model="orderMemo"
                clearable>
                <el-button slot="append" icon="el-icon-circle-plus" @click="updateOrderMemo(order,'PUBLIC')"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="isSaas">
            <el-form-item label="添加内部备注" class="">
              <el-input
                style="width: 90%"
                placeholder="请输入内部备注"
                v-model="innerMemo"
                clearable>
                <el-button slot="append" icon="el-icon-circle-plus" @click="updateOrderMemo(order,'PRIVATE')"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-row>
          <el-col :span="12">
            <span class="SpanClass">公共备注（分销商，供应商可见）</span>
            <el-input
              placeholder="请输入公共备注"
              v-model="orderMemo"
              clearable>
              <el-button slot="append" icon="el-icon-edit" @click="updateOrderMemo(order,'PUBLIC')"></el-button>
            </el-input>
          </el-col>
          <el-col :span="12">
            <span class="SpanClass">内部备注（分销商、供应商均不可见）</span>
            <el-input
              placeholder="请输入内部备注"
              v-model="innerMemo"
              clearable>
              <el-button slot="append" icon="el-icon-edit" @click="updateOrderMemo(order,'PRIVATE')"></el-button>
            </el-input>
          </el-col>
        </el-row>-->
        <el-row>
          <header class="block-title" style="">订单应付款明细</header>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table :data="payables" style="width: 100%">
              <el-table-column prop="productName" label="应付金额" >
                <template slot-scope="scope">
                </template>
              </el-table-column>
              <el-table-column prop="productName" label="币种" >
                <template slot-scope="scope">
                </template>
              </el-table-column>
              <el-table-column prop="productName" label="应付商户">
                <template slot-scope="scope">
                </template>
              </el-table-column>
              <el-table-column prop="productName" label="对账金额" >
                <template slot-scope="scope">
                </template>
              </el-table-column>
              <el-table-column prop="productName" label="付款金额	" >
                <template slot-scope="scope">
                </template>
              </el-table-column>
              <el-table-column prop="productName" label="单号" >
                <template slot-scope="scope">
                </template>
              </el-table-column>
              <el-table-column prop="productName" label="付款日期" >
                <template slot-scope="scope">
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <div style="margin: 10px 0;">
          <el-button type="primary" @click="onClose" plain>关闭</el-button>
          <!--<el-button type="primary" plain>分销商预订</el-button>-->
          <!--<el-button type="primary" plain>供应商确认</el-button>-->
        </div>
    </el-form>
  </div>
</template>


<script>
  import hotelOrder from '@/api/order/hotelOrder'
  import hotelProduct from '@/api/product/hotelProduct'
  import '@/styles/block.css'
  import { parseTime } from '@/utils/index'

  export default {
    data() {
      return {
        isSaas: false, // 是否运营商
        payables: null,
        peopleListData: null,
        orderDetailData: null,
        orderMemos: [],
        innerMemos: [],
        orderMemo: '',
        innerMemo: '',
        product: {},
        order: {},
        orderState: '',
        noticeStates: [],
        payStates: [],
        clearStates: [],
        orderStates: [
          { label: '请选择', value: null },
          { label: '新订单', value: 0 },
          { label: '已确认', value: 1 },
          { label: '已成功', value: 2 },
          { label: '已取消', value: 3 },
          { label: '已完成', value: 4 }
        ],
        isPayState: 1,
        isNoticeState: 1,
        isClearState: 0
      }
    },
    filters: {
      filterMoney(val) {
        return Math.round(val)
      }
    },
    methods: {
      onClose() {
        this.toOrderList()
      },
      load() {
        const orderId = this.$route.query.orderId
        const saasId = this.$route.query.saasId
        hotelOrder.load(saasId, orderId).then((res) => {
          if (res) {
            this.order = res
            this.loadProduct(this.order.productId)
            this.loadOrderDetail(orderId)
            if (this.order.createNoticeDate) {
              this.isNoticeState = 2
              this.noticeStates = [{
                value: '无',
                label: '未生成通知单'
              }, {
                value: parseTime(this.order.createNoticeDate),
                label: '已生成通知单'
              }]
            } else {
              this.isNoticeState = 0
              this.noticeStates = [{
                value: '无',
                label: '未生成通知单'
              }]
            }
            if (this.order.payDate) {
              this.isPayState = 2
              this.payStates = [{
                value: parseTime(this.order.createDate),
                label: '分销商下单'
              }, {
                value: parseTime(this.order.payDate),
                label: '分销商已付款'
              }]
              this.isClearState = 2
              this.clearStates = [{
                value: parseTime(this.order.payDate),
                label: '分销商已支付'
              }, {
                value: parseTime(this.order.payDate),
                label: '已生成应付款'
              }]
            } else {
              this.isNoticeState = 0
              this.noticeStates = [{
                value: '无',
                label: '未生成通知单'
              }, {
                value: '无',
                label: '已生成通知单'
              }]
              this.isPayState = 1
              this.payStates = [{
                value: parseTime(this.order.createDate),
                label: '分销商下单'
              }, {
                value: '无',
                label: '分销商未付款'
              }]
              this.isClearState = 0
              this.clearStates = [{
                value: '无',
                label: '分销商未支付'
              }, {
                value: '无',
                label: '未生成应付款'
              }]
            }
            this.orderMemos = this.orderMemos.concat(this.memoFormat(this.order.orderMemo))
            // TODO:内部备注只有运营商账户能见
            this.innerMemos = this.innerMemos.concat(this.memoFormat(this.order.innerMemo))
            this.listPeople(orderId)
          }
        }).catch((e) => {
          console.log(e.message())
          this.$message({
            type: 'info',
            message: '订单详情加载失败'
          })
        })
      },
      memoFormat(content) {
        if (content) {
          var obj = JSON.parse(content)
          const formatBeiZhu = []
          for (let i = 0; i < obj.length; i++) {
            const ele = {
              content: obj[i].content,
              date: obj[i].date
            }
            formatBeiZhu.push(ele)
          }
          return formatBeiZhu
        }
        return []
      },
      loadProduct(productId) {
        hotelProduct.load(productId).then((res) => {
          if (res != null) {
            this.product = res.hotelProduct || {}
          }
        }).catch((e) => {
          console.log(e.message())
          this.$message({
            type: 'info',
            message: '产品详情加载失败'
          })
        })
      },
      loadOrderDetail(orderId) {
        hotelOrder.loadDetails(orderId).then((res) => {
          if (res) {
            this.orderDetailData = res
            for (let i = 0; i < res.length; i++) {
              this.orderDetailData[i].checkinDate = parseTime(this.orderDetailData[i].checkinDate, '{y}-{m}-{d}')
            }
          }
        }).catch((e) => {
          this.$message({
            type: 'info',
            message: '订单详情加载失败'
          })
        })
      },
      listPeople(orderId) {
        hotelOrder.listPeople(orderId).then((res) => {
          if (res) {
            this.peopleListData = res
          }
        }).catch((e) => {
          this.$message({
            type: 'info',
            message: '游客加载失败'
          })
        })
      },
      toOrderList() {
        this.$router.push('/order/hotelOrders/list')
      },
      // 订单状态枚举转换
      computedOrderState(state) {
        for (let i = 0; i < this.orderStates.length; i++) {
          if (this.orderStates[i].value === state) {
            return this.orderStates[i].label
          }
        }
        return 'unknown'
      },
      updateOrderMemo(data, contentType) {
        // const saasId = this.$route.query.saasId
        var contents = []
        var nowContent = {}
        if (contentType === 'PUBLIC') {
          if (!this.orderMemo) {
            this.$message({
              message: '请填写内容',
              type: 'info'
            })
            return false
          }
          nowContent.content = this.orderMemo
          contents = contents.concat(this.orderMemos)
        } else {
          if (!this.innerMemo) {
            this.$message({
              message: '请填写内容',
              type: 'info'
            })
            return false
          }
          nowContent.content = this.innerMemo
          contents = contents.concat(this.innerMemos)
        }
        nowContent.date = parseTime(new Date())
        contents.push(nowContent)
        const allContent = JSON.stringify(contents)
        if (contentType === 'PUBLIC') {
          data.orderMemo = allContent
        } else {
          data.innerMemo = allContent
        }
        hotelOrder.updateOrderRemark(data).then((res) => {
          if (res && res.state === 'success') {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            if (contentType === 'PUBLIC') {
              this.orderMemo = ''
              this.orderMemos.push(nowContent)
            } else {
              this.innerMemo = ''
              this.innerMemos.push(nowContent)
            }
          }
        }).catch((e) => {
          this.$message({
            type: 'info',
            message: '修改失败'
          })
        })
      }
    },
    mounted() {
      this.isSaas = this.$store.getters.userInfo.mchId === 0
      this.load()
    }
}
</script>

<style type="text/css" scoped>
.titleSpanClass {
  padding: 2px;
  color: cornflowerblue;
  width: 80px;
  display:inline-block;
}
.linkTitleClass {
  padding: 2px;
  color: cornflowerblue;
  width: 70px;
  display:inline-block;
}
.linkSpanClass {
  color: #304156;
  width: 230px;
  display:inline-block;
}
.SpanClass {
  color: #304156;
  width: 280px;
  display:inline-block;
}
font {
  color: #87cefa;
  font-size: 16px;
}
</style>
