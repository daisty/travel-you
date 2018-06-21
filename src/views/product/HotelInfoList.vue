<template>
  <div class="app-container">
    <el-form size="small" :model="searchData" label-width="68px" label-position="left" :inline=true>
      <el-form-item label="酒店地区">
        <select-area @getAreaId="getAreaId"></select-area>
      </el-form-item>
      <el-form-item :label="$t('hotelProductTable.hotelName')">
        <el-input size="small"  :placeholder="$t('common.pleaseEnter',{name:$t('common.keywords')})" v-model="searchData.keywords" >
        </el-input>
      </el-form-item>
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
      <el-form-item label-width="0">
        <el-button  type="primary" size="small" @click="getHotelList">{{$t('common.search')}}</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据展示表格 -->
    <el-table :data="tableData" v-loading="tableLoading" element-loading-text="Loading" border fit
              highlight-current-row :v-loading="loading">
      <el-table-column align="center" label='ID' width="95" prop="id"></el-table-column>
      <el-table-column label="酒店名" align="center" prop="hotelName"></el-table-column>
      <el-table-column label="地址" align="center" prop="address"></el-table-column>
      <el-table-column label="酒店电话" align="center" prop="phone"></el-table-column>
      <el-table-column label="创建日期" align="center" :formatter="dateTimeFormat"></el-table-column>
      <el-table-column :label="$t('common.operation')" align="center" width="200">
        <template slot-scope="scope">
          <!--<router-link  :to="{path:'/product/hotelProducts/save', query: {hotelId:scope.row.id, hotelName:scope.row.hotelName, areaId: scope.row.areaId3 || scope.row.areaId2 || scope.row.areaId1 || scope.row.areaId0}}">-->
            <!--<el-button type="primary" size="small">发布产品</el-button>-->
          <!--</router-link>-->
          <router-link  :to="{path:'/product/hotelProducts/save', query: {hotelId:scope.row.id, hotelName:scope.row.hotelName, areaId: scope.row.areaId3 || scope.row.areaId2 || scope.row.areaId1 || scope.row.areaId0}}">
            <el-button type="primary" size="small">{{$t('hotelProductTable.issueProduct')}}</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页内容 -->
    <div class="pagination-container text-right">
      <el-pagination
        background
        @size-change="pageSizeChange"
        @current-change="pageCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="resultNum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import SelectArea from '@/views/product/common/SelectArea'
  import { parseTime } from '@/utils'
  import hotelProduct from '@/api/product/hotelProduct'
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
          keywords: '', // 酒店名称
          hotelStar: 0, // 酒店星级
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
        page: 1, // 当前页
        startIndex: 0,
        resultNum: 10, // 每页条数
        total: 0 // 总条数
      }
    },
    mounted() {
      this.getHotelList()
    },
    methods: {
      // 获取酒店列表
      getHotelList() {
        this.loading = true
        const param = {
          page: this.page,
          resultNum: this.resultNum,
          ...this.searchData
        }
        hotelProduct.hotelList(param).then(res => {
          this.tableData = res.results
          this.total = res.sizeAll
          this.loading = false
        })
      },
      onChange(val) {
        this.getMchId(val)
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
        this.page = val
        this.getHotelList()
      }
    }
  }
</script>
<style scoped>

</style>
