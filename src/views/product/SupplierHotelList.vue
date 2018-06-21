<template>
  <div class="app-container">
    <el-form size="small" :model="searchData" label-width="68px" label-position="left">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="接口选择">
            <el-select
              size="small"
              v-model="searchData.interfaceName"
              filterable
              @change="onChange"
              reserve-keyword
              placeholder="请输入关键词"
              :loading="loading">
              <el-option
                v-for="item in supplierInterfaceConfig"
                :key="item.value"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col >
        <el-col :span="20">
          <el-form-item label="酒店地区">
            <select-area @getAreaId="getAreaId"></select-area>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item :label="$t('hotelProductTable.hotelName')">
            <el-input size="small" :placeholder="$t('common.pleaseEnter',{name:$t('common.keywords')})" v-model="searchData.hotelName" >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="酒店星级">
            <el-select  size="small" v-model="searchData.hotelStar" placeholder="请选择">
              <el-option
                v-for="item in hotelStars"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col >
        <el-col :span="4">
          <el-form-item label="绑定状态">
            <el-select v-model="searchData.isBind" placeholder="请选择">
              <el-option :value=1 label="已绑定"></el-option>
              <el-option :value=0 label="未绑定"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button  type="primary" size="small" @click="getHotelList">{{$t('common.search')}}</el-button>
        </el-col>
      </el-row>
    </el-form>
      <!-- 数据展示表格 -->
    <el-table :data="tableData" v-loading="tableLoading" element-loading-text="Loading" border fit
              highlight-current-row >
      <el-table-column align="center" label='ID' width="95" prop="id"></el-table-column>
      <el-table-column label="酒店名" align="center" prop="hotelName"></el-table-column>
      <el-table-column label="地址" align="center" prop="address">
      </el-table-column>
      <el-table-column label="酒店电话" align="center" prop="phone"></el-table-column>
      <el-table-column label="匹配状态" align="center">
        <template slot-scope="scope">
          {{scope.row.hotelId ? '已匹配' : '未匹配'}}
        </template>
      </el-table-column>
      <el-table-column label="创建日期" align="center" :formatter="dateTimeFormat"></el-table-column>
      <el-table-column :label="$t('common.operation')" align="center" width="200">
        <template slot-scope="scope">
          <router-link v-if="isAdd" :to="{path:'/product/hotelProducts/save', query: {hotelId:scope.row.id, hotelName:scope.row.hotelName, areaId: scope.row.areaId3 || scope.row.areaId2 || scope.row.areaId1 || scope.row.areaId0}}">
            <el-button type="primary" size="small">{{$t('hotelProductTable.issueProduct')}}</el-button>
          </router-link>

          <el-button v-else type="primary" size="small" :disabled="!scope.row.hotelId" @click="onImportProduct(scope.row)">导入产品</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页内容 -->
    <div class="pagination-container text-right">
      <el-pagination
        background
        @size-change="pageSizeChange"
        @current-change="pageCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="resultNum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="导入产品"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="closeDialog">
      <el-row>
        <header class="block-title">供应商酒店[{{checkedRow.hotelName}}]产品列表</header>
      </el-row>
      <el-row>
        <!-- 数据展示表格 -->
        <el-table :data="dTableData" v-loading="dTableLoading" element-loading-text="Loading" border fit ref="multipleTable"
                  highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="房型" align="center">
            <template slot-scope="scope">
              {{scope.row.roomName}}
            </template>
          </el-table-column>
          <el-table-column :label="'预订政策'" align="center">
            <template slot-scope="scope">
              提前预订时间 {{timeWithUnit(minute2DHM(scope.row.minAdvMinutes))}} ~ {{timeWithUnit(minute2DHM(scope.row.maxAdvMinutes))}}<br>
              入住天数 {{scope.row.minDays}}天 ~ {{scope.row.maxDays}}天 <br>
              预订间数 {{scope.row.minRoomNum}}间 ~ {{scope.row.maxRoomNum}}间
            </template>
          </el-table-column>
          <el-table-column label="创建日期" align="center" :formatter="dateTimeFormat"></el-table-column>
        </el-table>
      </el-row>
      <el-row >
        <br/>
        <el-col :offset="10" :span="4">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="batchSave">确定导入</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  import SelectArea from '@/views/product/common/SelectArea'
  import { parseTime } from '@/utils'
  import hotelInfoSuppliers from '@/api/hotel/hotelInfoSuppliers'
  import hotelProduct from '@/api/product/hotelProduct'
  import saasInterfaceInfo from '@/api/interface/saasInterfaceInfo'
  export default {
    name: 'SupplierHotelList',
    components: {
      SelectArea
    },
    data() {
      return {
        isAdd: this.$route.query.isAdd, // 是否点击添加产品进入的此页面
        tableData: [],
        tableLoading: false,
        loading: false,
        searchData: {
          areaId: '0',
          hotelName: '', // 酒店名称
          hotelStar: 0, // 酒店星级
          interfaceName: '', // 供应商接口名称
          mchId: '', // 商户id
          isBind: 1 // 是否已绑定
        },
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
        supplierInterfaceConfigs: [], // 供应商接口配置列表
        supplierInterfaceConfig: [], // 供应商接口配置列表 - 用于select控件
        currentPage: 1, // 当前页
        resultNum: 10, // 每页条数
        total: 0, // 总条数

        dialogVisible: false, // 导入酒店弹窗
        dTableData: [], // 弹窗表格
        localProducts: [], // 已导入的产品 - 弹窗表格
        localProductIds: [], // 已导入的产品id列表 - 弹窗表格
        dTableLoading: false, // 弹窗表格
        checkedRow: {}, // 当前选中行
        checkedData: [] // 选中要导入的产品集合
      }
    },
    mounted() {
      this.listSupplierInterfaceConfig()
      this.getHotelList()
    },
    methods: {
      // 获取酒店列表
      getHotelList() {
        if (!this.searchData.interfaceName) {
          this.$message.info('请选择供应商接口')
          return false
        }
        const params = {
          page: this.currentPage,
          resultNum: this.resultNum,
          ...this.searchData,
          supplierId: this.getSupplierInterfanceId(this.searchData.interfaceName)
        }
        this.tableLoading = true
        hotelInfoSuppliers.list(params).then(res => {
          if (res) {
            this.tableData = res.results || []
            this.total = res.sizeAll
          }
        }).finally(() => {
          this.tableLoading = false
        })
      },
      // 获取供应商接口配置
      listSupplierInterfaceConfig() {
        const params = {
          page: 1,
          resultNum: 100,
          type: 1
        }
        saasInterfaceInfo.listSupplierInterfaceConfig(params).then(res => {
          if (res.results && res.results.length && res.sizeAll !== '0') {
            const results = res.results
            const arr = []
            for (let i = 0; i < results.length; i++) {
              const ele = {
                value: results[i].configName,
                label: results[i].configName
              }
              arr.push(ele)
            }
            this.supplierInterfaceConfig = arr
            this.supplierInterfaceConfigs = results
          } else {
            this.supplierInterfaceConfig = []
          }
        })
      },
      // 获取供应商接口id
      getSupplierInterfanceId(interfaceName) {
        let interfaceId
        this.supplierInterfaceConfigs.forEach(row => {
          if (row.configName === interfaceName) {
            interfaceId = row.interfaceId
          }
        })
        return interfaceId
      },
      // 获取选中接口配置的商户编号
      getMchId(interfaceId) {
        let mchId
        this.supplierInterfaceConfigs.forEach(row => {
          if (row.interfaceId === interfaceId) {
            this.mchId = mchId = row.mchId
          }
        })
        return mchId
      },
      onChange(val) {
        this.getMchId(this.getSupplierInterfanceId(val))
        this.getHotelList()
      },
      // 地区组件值变化的时候进行回调获取
      getAreaId(val) {
        if (val.id) {
          this.searchData.areaId = val.id
        } else {
          this.searchData.areaId = '0'
        }
      },
      // 导入产品
      onImportProduct(row) {
        this.checkedRow = row
        this.dialogVisible = true
        this.getProducts()
      },
      // 获取供应商酒店下产品列表
      getProducts() {
        this.dTableLoading = true
        const params = {
          supplierId: this.mchId, // 供应商户id
          supplierHotelId: this.checkedRow.supplierHotelId // 供应商酒店id
        }
        hotelInfoSuppliers.listProducts(params).then(res => {
          if (res && res.state === 'success') {
            const result = res.data
            this.dTableData = result.suppliperProduct || []
            this.localProducts = result.products || []
            this.toggleSelection() // 选中已导入的行
          }
        }).finally(() => {
          this.dTableLoading = false
        })
      },
      // 关闭弹窗
      closeDialog() {
        this.checkedRow = {}
        this.dialogVisible = false
        this.dTableData = [] // 弹窗表格
        this.localProducts = [] // 弹窗表格
        this.localProductIds = [] // 弹窗表格
        this.checkedData = [] // 选中要导入的产品集合
      },
      // 批量保存
      batchSave() {
        const addProductVos = this.filterNotImport()
        if (!addProductVos || addProductVos.length === 0) {
          this.$message.error('请选择未导入的产品')
          return false
        }
        hotelProduct.batchSave(addProductVos).then(res => {
          if (res) {
            this.$message.success('导入成功')
            this.closeDialog()
          }
        }).finally(() => {
        })
      },
      // 过滤掉选中但已导入的产品
      filterNotImport() {
        const addProductVos = []
        if (this.checkedData && this.checkedData.length > 0) {
          this.checkedData.forEach(row => {
            if (this.localProductIds.indexOf(row.supplierProductId) === -1) {
              // 填充酒店信息到产品表
              row.areaId0 = this.checkedRow.areaId0
              row.areaId1 = this.checkedRow.areaId1
              row.areaId2 = this.checkedRow.areaId2
              row.areaId3 = this.checkedRow.areaId3
              row.hotelStar = this.checkedRow.hotelStar
              row.hotelId = this.checkedRow.hotelId
              addProductVos.push({ hotelProduct: row })
            }
          })
        }
        return addProductVos
      },
      // 传入的是当前列表中所有选中的值
      handleSelectionChange(val) {
        this.checkedData = val
      },
      // 选中已导入的行
      toggleSelection() {
        const that = this
        if (this.dTableData && this.dTableData.length && this.localProducts && this.localProducts.length) {
          // 这个回调函数在dom更新完成后调用
          this.$nextTick(function() {
            this.localProducts.forEach(localRow => {
              // 保存已导入的产品id列表
              that.localProductIds.push(localRow.supplierProductId)
              this.dTableData.forEach(row => {
                // 如果包含则默认选中
                if (localRow.supplierProductId === row.supplierProductId) {
                  row.createDate = localRow.createDate
                  that.$refs.multipleTable.toggleRowSelection(row)
                }
              })
            })
          })
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
      // 酒店时间格式
      dateTimeFormat(row) {
        return !row.createDate ? '未导入' : parseTime(row.createDate)
      },
      // 切换每页显示条数
      pageSizeChange(val) {
        this.resultNum = val
        this.getHotelList()
      },
      // 切换当前页
      pageCurrentChange(val) {
        this.currentPage = val
        this.getHotelList()
      }
    }
  }
</script>
<style scoped>

</style>
