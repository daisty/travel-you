<template >
  <div class="app-container">
      <!--选择区域-->
    <el-form label-width="80px" :inline=true class="boldform">
      <el-form-item :label="$t('hotelProduct.createDate')">
        <el-date-picker
          v-model="allDate"
          type="daterange"
          size="small"
          :start-placeholder="$t('calendar.startDate')"
          :end-placeholder="$t('calendar.endDate')"
          :picker-options="pickerOptions2">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('hotelOrderNotification.payState')">
        <el-select v-model="payState" :placeholder="$t('common.pleaseSelect',{name:$t('hotelOrderNotification.payState')})" size="small" class="search-item">
          <el-option
            v-for="item in $t('hotelOrderNotification.payStates')"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('hotelOrderNotification.orderId')">
        <el-input :placeholder="$t('common.pleaseEnter',{name:$t('hotelOrderNotification.orderId')})"
                  v-model="orderId"
                  class="search-item" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('hotelOrderNotification.id')">
        <el-input :placeholder="$t('common.pleaseEnter',{name:$t('hotelOrderNotification.id')})"
                  v-model="id"
                  class="search-item" size="small"></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="primary" size="small" @click="search">{{$t('common.search')}}</el-button>
      </el-form-item>

      <!--列表区域-->
    </el-form>

    <el-table :data="tableData" v-loading="tableLoading" element-loading-text="Loading" border fit
              highlight-current-row>
      <el-table-column align="center" :label="$t('hotelOrderNotification.id')" width="95" prop="id"></el-table-column>
      <el-table-column :label="$t('hotelOrderNotification.notificationMsg')" align="center">
        <template slot-scope="scope">
          <span>{{ $t('addProduct.supplier') }}：</span>
          <span class="url" @click="loadSupplierMchInfo(scope.row.supplierMchId)">{{ scope.row.mchName }}</span>
          <span>, {{ $t('hotelOrderNotification.num') }}：</span>
          <span>{{ scope.row.num }}</span>
          <span>, {{ $t('hotelOrderNotification.payMoney') }}：</span>
          <span>{{ scope.row.payMoney }} {{ scope.row.currencyType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('hotelOrderNotification.payMsg')" align="center">
        <template slot-scope="scope">
          <span>{{ $t('hotelOrderNotification.settleTypes') }}：</span>
          <span v-if="scope.row.settleTypes === 0">{{ $t('hotelOrderNotification.settleTypess')[0].label }}</span>
          <span v-else>{{ $t('hotelOrderNotification.settleTypess')[1].label }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('hotelOrderNotification.confirmState')" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.confirmState === 0">{{ $t('hotelOrderNotification.confirmStates')[0].label }}</span>
          <span v-else>{{ $t('hotelOrderNotification.confirmStates')[1].label }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="del(scope.row.id)">{{ $t('common.delete') }}</el-button>
        </template>
      </el-table-column>
      <!--<el-table-column type="expand">-->
        <!--暂无信息-->
      <!--</el-table-column>-->
    </el-table>

      <!-- 分页内容 -->
      <div class="pagination-container text-right" style="margin-top:10px;">
        <el-pagination
          background
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20 ,50, 100]"
          :page-size="resultNum"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
  </div>
</template>

<script>
  import HotelOrder from '@/api/order/hotelOrder'

  export default {
    // 页面数据源
    data() {
      return {
        // 表格数据源
        tableData: null,
        tableLoading: false,
        formLabelWidth: '120px',
        allDate: [
          new Date(),
          new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        ],
        // 支付状态
        payState: 2,
        // 通知单信息
        notificationMsg: 2,
        // 客人信息
        peopleMsg: '',
        // 订单id
        orderId: '',
        // 通知单id
        id: '',
        // 当前页
        currentPage: 1,
        // 每页条数
        resultNum: 10,
        // 总条数
        total: 0,
        // 日期选择
        pickerOptions2: {
          shortcuts: [
            {
              text: '昨天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '今天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                end.setTime(start.getTime() + 3600 * 1000 * 24)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            }]
        }
      }
    },
    // 计算属性
    computed: {},
    // Vue生命周期函数
    created() {
      this.list()
    },
    methods: {
      // 获取通知单列表
      list() {
        const params = {
          page: this.currentPage,
          resultNum: this.resultNum,
          payState: this.payState,
          id: this.id,
          orderId: this.orderId,
          sdate: this.allDate[0],
          edate: this.allDate[1]
        }
        this.tableLoading = true
        HotelOrder.listOrderNotification(params).then(res => {
          if (res.results && res.results.length && res.sizeAll !== '0') {
            this.tableData = res.results
            this.total = res.size
          } else {
            this.tableData = null
            this.total = 0
          }
          this.tableLoading = false
        })
      },
      // 搜索按钮
      search() {
        this.list()
      },
      // 跳转到供应商
      loadSupplierMchInfo(id) {
        this.$message({
          type: 'warning',
          message: '供应商商户详情页面还没做噢！'
        })
      },
      // 删除按钮
      del(id) {
        this.$message({
          type: 'error',
          message: '此处暂未实现，涉及到结算模式中对未已付款的不同处理，谨慎!',
          duration: 3000
        })
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
  .date-item{
   margin-left: 15px;
  }
  .table-item{
    margin-bottom: 15px;
  }
  .search-item {
    width: 200px;
    margin: 0 10px;
  }
  .url{
    color: #0063dc;
    font-size: 100%;
  }
  .text{
    font-size: 14px;
    color: #606266;
  }
</style>
