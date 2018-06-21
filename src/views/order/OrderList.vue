<template>
  <!-- 此组件的唯一根节点 -->
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form size="small"  label-width="85px" label-position="left" :inline=true class="boldform">
      <el-form-item :label="$t('hotelOrder.orderId')">
        <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:$t('hotelOrder.orderId')})"
                  v-model="orderId"></el-input>
      </el-form-item>
      <el-form-item label="渠道订单号">
        <el-input size="small"
                  :placeholder="$t('common.pleaseEnter',{name:$t('hotelOrder.channelOrderId')})"
                  v-model="channelOrderId" ></el-input>
      </el-form-item>
      <el-form-item :label="$t('hotelOrder.orderState')">
        <el-select v-model="orderState" placeholder="请选择" size="small">
          <el-option v-for="item in orderStates" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('hotelOrder.createDate')">
        <el-date-picker
          size="small"
          v-model="createStartDate"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="primary" size="small" @click="list">{{$t('common.search')}}</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据展示表格 -->
    <el-table :data="tableData" v-loading="tableLoading" element-loading-text="Loading" border fit
              highlight-current-row>
      <el-table-column align="center" :label="$t('hotelOrder.orderId')" width="95" prop="id"></el-table-column>
      <el-table-column label="订单信息" width="300" align="center" >
        <template slot-scope="scope">
          <router-link :to="{ path: '/order/hotelOrders/load', query: { orderId: scope.row.id, saasId: scope.row.saasId }}"><font color="#6495ed">订单号：{{scope.row.id}}</font><br></router-link>
          金额：<font color="red">{{scope.row.totalOrderPrice }}</font>元<br>
          支付：预存款支付
        </template>
      </el-table-column>
      <el-table-column label="预定信息" align="center" >
        <template slot-scope="scope">
          <font color="#6495ed">
            <router-link :to="{ path: '/booking/hotelBookings/listHotelProduct',
                   query: { productId: scope.row.productId }}">
              <span>{{scope.row.productName}}</span>
            </router-link>
          </font><br>
          下单：{{scope.row.createDate | formatTimeFilter}}<br>
          入住日期：{{scope.row.checkinDate | formatTimeFilter('{y}-{m}-{d}')}}<br>
          联系人：{{scope.row.contactName}}({{ scope.row.contactPhone }})
        </template>
      </el-table-column>
      <el-table-column label="分销商信息" align="center" >
        <template slot-scope="scope">
          分销商：<font color="#6495ed">
          <router-link :to="{ path: '/myInfo/saasMchInfo/load',
                   query: { mchId: scope.row.distributorMchId }}">
            <span>{{scope.row.distributorName}}</span>z
          </router-link>
        </font><br>
          单号：{{scope.row.channelOrderId}}
          <!--先屏蔽接单功能-->
          <!--<br><el-button type="text" size="mini" @click="accepOrder(scope.row.id)">接单</el-button>-->
          <!--录单人：录单人-->
        </template>
      </el-table-column>
      <el-table-column label="供应商信息" width="250px" align="center" >
        <template slot-scope="scope">
          供应商：<font color="#6495ed">
          <!--<router-link to="/order/orderReservation/orderReservation">Demo供应商</router-link>-->
          <router-link :to="{ path: '/myInfo/saasMchInfo/load',
                   query: { mchId: scope.row.supplierMchId }}">
            <span>{{scope.row.supplierName}}</span>
          </router-link>
        </font><br>
          单号：{{scope.row.supplierOrderId}}<br>
          <el-button v-if="isGenerateNotification(scope.row)" type="text" size="mini" @click="generateNotification(scope.row.id)" >{{computedSendMsg(scope.row.createNoticeDate)}}</el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('hotelOrder.orderState')" width="150px" align="center" >
        <template slot-scope="scope">
          {{ computedOrderState(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" header-align="center" width="150px" align="center" >
        <template slot-scope="scope">
          <el-dropdown size="small">
            <el-button type="primary" size="mini">
              {{$t('common.manage')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updateRemark(scope.row.id)">修改备注</el-dropdown-item>
              <el-dropdown-item @click.native="modifyRemark(scope.row.saasId, scope.row.id, '发送短信')" v-if="isDisplay(scope.row, '发送短信')">发送短信</el-dropdown-item>
              <el-dropdown-item @click.native="modifyRemark(scope.row.saasId, scope.row.id, '退款')" v-if="isDisplay(scope.row, '退款')">退款</el-dropdown-item>
              <el-dropdown-item @click.native="modifyRemark(scope.row.saasId, scope.row.id, '代客支付')" v-if="isDisplay(scope.row, '代客支付')">代客支付</el-dropdown-item>
              <el-dropdown-item @click.native="showDetail(scope.row.saasId, scope.row.id)">查看</el-dropdown-item>
              <el-dropdown-item @click.native="updateOrder(scope.row.saasId, scope.row.id)">{{$t('common.edit')}}</el-dropdown-item>
              <el-dropdown-item style="color: red;" v-if="isDisplay(scope.row, '取消')" @click.native="cancel(scope.row.id)">{{$t('common.cancel')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
        :page-sizes="[10, 20, 50, 100]"
        :page-size="resultNum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import HotelOrder from '@/api/order/hotelOrder'

  /**
   *  需要响应式的数据均需在data中提前写入
   */
  export default {
    // 页面数据源
    data() {
      return {
        tableData: null, // 表格数据源
        tableLoading: true,
        dialogType: null, // 弹窗类型，新增或编辑
        dialogFormVisible: false,
        formLabelWidth: '120px',
        currentPage: 1, // 当前页
        resultNum: 10, // 每页条数
        total: 0, // 总条数
        formLoading: false,
        tempData: {}, // 作为重置表单的临时存储、
        // 订单状态候选项 0-新订单 1-已确认 2-已成功 3-已取消 4-已完成
        orderStates: [
          { label: '全部', value: null },
          { label: '新订单', value: 0 },
          { label: '已确认', value: 1 },
          { label: '已成功', value: 2 },
          { label: '已取消', value: 3 },
          { label: '已完成', value: 4 }
        ],
        orderState: null, // 订单状态 0-新订单 1-已确认 2-已成功 3-已取消 4-已完成
        createStartDate: null, // 搜索时间[Date1, Date2]
        channelOrderId: null, // 渠道订单号
        orderId: null, // 订单号
        saasId: null, // 运营商编号
        isVerifySate: '', // 是否显示验证 按钮
        isOderDemoSate: '', // 是否显示修改备注按钮
        isSendMsgSate: '', // 是否显示发送短信按钮
        isModifyDateSate: '', // 是否显示改期按钮
        isCancelMoneySate: '', // 是否显示退款按钮
        isPayMonerSate: '' // 是否显示代客支付按钮
      }
    },
    // 计算属性
    computed: {

    },
    // Vue生命周期函数
    created() {
      this.list()
    },
    // 自定义方法
    methods: {
      isDisplay(order, content) {
        if (content === '代客支付') {
          if (order.payDate) {
            return false
          }
        } else if (content === '退款') {
          if (!order.payDate && order.cancelPrice) {
            return false
          }
        } else if (content === '取消' || content === 'Edit') {
          if (order.orderState === 3 || order.orderState === 4 || order.createNoticeDate) {
            return false
          }
        } else if (content === '发送短信') {
          if (order.orderState === 0 || order.orderState === 1) {
            return false
          }
        }
        return true
      },
      // 重发
      reSend(orderId) {
        this.$message({
          type: 'success',
          message: '重发：' + orderId
        })
      },
      // 接单
      accepOrder(orderId) {
        this.$message({
          type: 'success',
          message: '接单：' + orderId
        })
      },
      // 获取所有
      list() {
        // 格式化时间
        var startTimeStr = null
        var endTimeStr = null
        if (this.createStartDate) {
          const startTime = this.createStartDate[0]
          const endTime = this.createStartDate[1]
          startTimeStr = startTime.getTime()
          endTimeStr = endTime.getTime()
        }
        // 参数
        const params = {
          page: this.currentPage,
          resultNum: this.resultNum,
          state: this.orderState,
          createStartDate: startTimeStr,
          createEndDate: endTimeStr,
          channelOrderId: this.channelOrderId,
          orderId: this.orderId
        }
        this.tableLoading = true
        HotelOrder.list(params).then(res => {
          if (res.results && res.results.length) {
            this.tableData = res.results
            this.total = res.sizeAll
            this.tableLoading = false
          } else {
            this.tableData = null
            this.total = 0
            this.tableLoading = false
          }
        }).catch(err => {
          console.log(err)
          this.tableLoading = false
        })
      },
      // 验证订单
      confirmOrder(saasId, orderId) {
        this.$message({
          type: 'success',
          message: '验证订单 :' + saasId + ' -- ' + orderId
        })
      },
      // 修改备注
      modifyRemark(saasId, orderId, content) {
        if (content === '拆单') {
          // window.open('http://wwww.baidu.com')
          window.open('/hotelRoomInfos/index')
        } else {
          this.$message({
            type: 'success',
            message: content + saasId + ' -- ' + orderId
          })
        }
      },
      // 取消订单
      cancel(orderId) {
        this.$confirm('是否取消订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          HotelOrder.cancel(orderId).then(res => {
            if (res.status === 'success') {
              this.$message({
                message: '取消成功！',
                type: 'success',
                duration: 1000,
                onClose: res => {
                  this.list()
                }
              })
            } else {
              this.$message({
                message: res.msg,
                type: 'error',
                duration: 1000
              })
            }
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消操作'
          // })
        })
      },
      // 查看订单详情
      showDetail(saasId, orderId) {
        this.$router.push({ path: '/order/hotelOrders/load', query: { orderId: orderId, saasId: saasId }})
      },
      updateOrder(saasId, orderId) {
        this.$router.push({ path: 'editOrder', query: { orderId: orderId, saasId: saasId }})
      },
      // 新增
      add() {
        this.$router.push('/order/hotelOrders/add')
      },
      // 订单状态枚举转换
      computedOrderState(order) {
        let orderSate = this.orderStates[order.orderState + 1].label

        // 已确认未支付
        if (order.orderState === 1 && !order.payDate) {
          orderSate += ',未支付'
        }
        if (order.orderState === 2 && order.payDate) {
          orderSate += ',已支付'
        }
        if (order.orderState === 2 && order.payDate && order.createNoticeDate) {
          orderSate += ',已安排'
        }
        return orderSate
      },
      // 生成通知单按钮名称根据状态显示(现在先全部显示生成通知单)
      computedSendMsg(createNoticeDate) {
        if (createNoticeDate) {
          return '生成通知单'
        } else {
          return '生成通知单'
        }
      },
      // 是否显示生成通知单按钮
      isGenerateNotification(row) {
        return row.orderState === 2 && row.createNoticeDate === undefined
      },
      // 生成通知单
      generateNotification(id) {
        console.log('list', id)
        this.$router.push({ path: '/order/hotelOrders/loadNotification', query: { id: id }})
      },
      // 跳转修改备注
      updateRemark(id) {
        this.$router.push({ path: '/order/hotelOrders/updateOrderRemark', query: { orderId: id }})
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
</script>、
<style scoped>
</style>
