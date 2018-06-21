<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form :model="searchData" label-width="100px" class="boldform" size="small">
      <el-row :gutter=20>
        <el-col :span=24>
          <el-form-item label="酒店地区">
            <select-area @getAreaId="getAreaId" ref="selectArea"></select-area>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter=20>
        <el-col :span=5>
          <el-form-item label="产品状态">
            <el-select v-model="searchData.productState" placeholder="请选择" @change="querySearch">
              <el-option v-for="item in productOption" :label="item.label" :value="item.value"
                         :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span=5>
          <el-form-item label="渠道产品状态">
            <el-select v-model="searchData.alitripProductState" placeholder="请选择"  @change="querySearch">
            <el-option v-for="item in alitripProductOption" :label="item.label" :value="item.value"
                       :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span=6>
          <el-form-item label="授权状态">
            <el-select>
              <el-option v-for="accredit in accreditOption" :label="accredit.label" :value="accredit.value" :key="accredit.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter=20>
        <el-col :span=5>
          <el-form-item label="系统酒店ID">
            <el-input :placeholder="$t('common.pleaseEnter',{name:$t('common.keywords')})"
                      v-model="searchData.hotelId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=5>
          <el-form-item label="飞猪酒店ID">
            <el-input  :placeholder="$t('common.pleaseEnter',{name:$t('common.keywords')})"
                              v-model="searchData.alitripHotelId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=5>
          <el-form-item :label="$t('common.keywords')">
            <el-input  :placeholder="$t('common.pleaseEnter',{name:$t('common.keywords')})"
                                                v-model="searchData.key"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=6>
          <el-form-item label-width="0">
            <el-button type="primary" @click="querySearch">{{$t('common.search')}}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <tree-table @expandRow="expandRow" :tableData.sync="tableData" ref="treeTable">
      <div slot="state" slot-scope="props">
        <div v-if="props.row.level === 2">
          <span v-if="props.row.rateState === 1">{{ $t('hotelProductTable.putAway') }}</span>
          <span v-if="props.row.rateState === 2">{{ $t('hotelProductTable.soldOut') }}</span>
          <span v-if="props.row.rateState === 3">异常</span>
        </div>
        <div v-else-if="props.row.level === 3">
          <span>{{props.row.state === 1 ? $t('hotelProductTable.enabled') : $t('hotelProductTable.unEnabled')}}</span>
        </div>
      </div>
      <div slot="operation" slot-scope="props">
        <div v-if="props.row.level === 1">

        </div>
        <div v-else-if="props.row.level === 2">
          <span v-if="props.row.rateState" style="color: #34679a;cursor:pointer;"
                @click="syncPrice(props.row, 0, $route.query.distributorMchId)">
           <span>同步</span>
          </span>
          <span v-if="props.row.rateState === 1" style="color: #34679a;cursor:pointer;"
                @click="productDowm(props.row, 2, $route.query.distributorMchId)">
           <span>下架</span>
          </span>
          <span v-if="props.row.rateState === 2" style="color: #34679a;cursor:pointer;"
                @click="productUp(props.row, 1, $route.query.distributorMchId)">
           <span>上架</span>
          </span>
          <!--修改产品-->
          <span v-if="props.row.rateState" style="color: #34679a;cursor:pointer;"
                @click="updateSelect(props.row.pId)">
           <span>变更</span>
          </span>

          <span v-if="props.row.rateState" style="color: #34679a;cursor:pointer;" @click="deleteSelect(props.row)">
           <span>删除</span>
          </span>
          <span v-if="props.row.rateState === 0" style="color: #34679a;cursor:pointer;">
            <router-link
              :to="{path:'/channel/alitrip/product', query: {distributorMchId:$route.query.distributorMchId, hotelId:props.row.hotelId, productId:props.row.id, planId:0}}">发布</router-link>
          </span>
          <span style="color: #34679a;cursor:pointer;" @click="showPrice(props.row)">
           <span>预览</span>
          </span>
          <span v-if="props.row.rateState" style="color: #34679a;cursor:pointer;" @click="link2Alitrip(props.row.pId)">
           <span>查看</span>
          </span>
          <!--<span style="color: #34679a;cursor:pointer;" @click="productShelveChoice(props.row)">-->
          <!--<span>{{props.row.state === 2 ? $t('hotelProductTable.putAway') : $t('hotelProductTable.soldOut')}}</span>-->
          <!--</span>-->
          <!--<router-link :to="{path:'/product/hotelProducts/priceStore', query: {productId:props.row.id}}">-->
          <!--<span style="color: #34679a">{{$t('hotelProductTable.priceAndStore')}}</span>-->
          <!--</router-link>-->
          <!--&lt;!&ndash;删除产品&ndash;&gt;-->
          <!--<span style="color: red;cursor:pointer;" @click="productDelete(props.row)">-->
          <!--<span>{{$t('common.delete')}}</span>-->
          <!--</span>-->
          <!--<router-link :to="{path:'/order/hotelOrders/addOrder', query: {productId:props.row.id}}">-->
          <!--<span style="color: #34679a">{{$t('route.addOrder')}}</span>-->
          <!--</router-link>-->
        </div>
        <div v-else-if="props.row.level === 3">
          <!--<span style="color: #34679a;cursor:pointer;" @click="updatePlan(props.row)">-->
          <!--<span>{{$t('hotelProductTable.updatePricePlan')}}</span>-->
          <!--</span>-->
          <!--<router-link :to="{path:'/product/hotelProducts/pricePlan', query: {planId:props.row.id}}">-->
          <!--<span style="color: #34679a">{{$t('hotelProductTable.priceCalendar')}}</span>-->
          <!--</router-link>-->
          <!--<span style="color: #34679a;cursor:pointer;" @click="planDisableOrplanEnableChoice(props.row)">-->
          <!--<span>{{props.row.state === 2 ? $t('hotelProductTable.enabled') : $t('hotelProductTable.unEnabled')}}</span>-->
          <!--</span>-->
        </div>
      </div>
    </tree-table>

    <el-dialog title="飞猪价格政策变更" :visible.sync="updateData.dialogVisible" width="35%">
      <el-form ref="form" :model="updateData" label-width="120px">
        <el-row>
          <el-form-item label="飞猪酒店名：" size="small">
            {{updateData.hotelName}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="飞猪房型名：" size="small">
            {{updateData.roomName}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="飞猪政策ID：" size="small">
            {{updateData.alitripGid}}-{{updateData.alitripRpid}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="房型政策名：" size="small">
              <el-input v-model="updateData.channelRpName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设置申请房：" size="small">
              <el-switch
                v-model="updateData.pushApplySet"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="推送间数：" size="small">
              <el-input v-model="updateData.applyNumSet" placeholder="" size="mini"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="销售渠道：">
            <el-checkbox-group v-model="updateData.selectChannel">
              <el-checkbox v-for="channel in alitripChannels" :label="channel.value" :key="channel.value">
                {{channel.label}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="productUpdate(updateData)">变更</el-button>
        <el-button @click="updateData.dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="飞猪价格预览" :visible.sync="viewData.dialogVisible" width="30%">
      <el-row><span>共获取到：{{viewData.hotelPrice.length}} 天价格</span></el-row>
      <div v-for="datePrice in viewData.hotelPrice" :label="datePrice.date">日期:{{datePrice.date}}，库存:{{datePrice.stock}} ，价格:{{datePrice.price}}，房态:{{datePrice.roomState === 1 ? 'open' : 'close'}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewData.dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="删除产品" :visible.sync="deleteData.dialogVisible" width="30%">
      <el-row><span>{{deleteData.pId}},确认删除该产品吗？</span></el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="productDel(deleteData.pId,deleteData.distributorMchId)">确认</el-button>
        <el-button @click="deleteData.dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 分页内容 -->
    <div class="pagination-container text-right">
      <el-pagination
        background
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        :current-page="pageData.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageData.resultNum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import SelectArea from '@/views/product/common/SelectArea'
  import TreeTable from '@/views/channel/alitrip/common/TreeTable'
  import Alitrip from '@/api/channel/alitrip'

  export default {
    name: 'ProductTable',
    components: {
      TreeTable,
      SelectArea
    },
    data() {
      return {
        accreditOption: [
          { value: '0', label: '全部' },
          { value: '1', label: '已发布' },
          { value: '2', label: '未发布' }
        ],
        productOption: [
          { value: '0', label: '全部' },
          { value: '1', label: '上架' },
          { value: '2', label: '下架' }
        ],
        alitripProductOption: [
          { value: '0', label: '全部' },
          { value: '1', label: '上架' },
          { value: '2', label: '下架' }
        ],
        viewData: {
          dialogVisible: false,
          hotelPrice: []
        },
        updateData: {
          dialogVisible: false,
          hotelName: '',
          roomName: '',
          alitripGid: 0,
          alitripRpid: 0,
          pushApplySet: false,
          applyNumSet: 0,
          channelRpName: '',
          pId: 0,
          selectChannel: [],
          alitripChannel: ''
        },
        deleteData: {
          dialogVisible: false,
          pId: 0,
          distributorMchId: 0
        },
        exportLoading: false,
        tableData: [],
        pageData: {
          currentPage: 1, // 当前页
          resultNum: 10, // 每页条数
          total: 0 // 总条数
        },
        hotelId: '0',
        searchData: {
          key: '',
          areaId: '',
          hotelId: '',
          accredit: '0',
          alitripHotelId: '',
          productState: '0',
          alitripProductState: '0',
          alitripChannel: ''
        },
        alitripChannelType: [{
          value: '',
          label: '全部'
        }, {
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
        }]
      }
    },
    mounted() {
      this.$refs['selectArea'].getForRead('1')
      // 手动调用子组件方法传值
      this.queryHotelList()
    },
    methods: {
      // 展开列表进行查询操作
      expandRow(obj) {
        const parentChecked = obj.row.checked
        let params = {
          page: 1,
          resultNum: 10
        }
        let url = ''
        if (obj.row.level === 1) {
          params = {
            ...params,
            hotelId: obj.row.id,
            keywords: this.searchData.key,
            distributorMchId: this.$route.query.distributorMchId,
            accredit: this.searchData.accredit,
            productState: this.searchData.productState,
            alitripProductState: this.searchData.alitripProductState,
            alitripChannel: this.searchData.alitripChannel
          }
          url = 'hotelProductList'
        } else if (obj.row.level === 2) {
          params = {
            ...params,
            productId: obj.row.id
          }
          url = '#'
        }
        obj.row.loading = true
        Alitrip.productList(params, url).then(res => {
          obj.row.loading = false
          const results = res && res.results && res.results.length ? res.results : []
          const data = results.map(ele => {
            return {
              ...ele,
              name: obj.row.level === 1 ? ((ele.roomName ? ele.roomName : '标准房') + ' ' + (ele.productTag ? ele.productTag : '无') + '(' + ele.id + ')') : ele.name,
              level: obj.row.level + 1,
              hasChild: obj.row.level < 2 ? 1 : null,
              checked: parentChecked,
              expanded: false,
              loading: false
            }
          })
          // 设置当前行row.hasChild,展开子集
          obj.row.hasChild = data.length
          this.loadNew(obj.row, obj.index, data, this)
        })
      },
      loadNew(row, index, data, vm) {
        row.expanded = !row.expanded
        const beforeRow = vm.tableData.slice(0, index + 1)
        const afterRow = vm.tableData.slice(index + 1)
        vm.tableData = beforeRow.concat(data).concat(afterRow)
      },
      // 酒店列表
      queryHotelList() {
        const params = {
          page: this.pageData.currentPage,
          resultNum: this.pageData.resultNum,
          keywords: this.searchData.key,
          areaId: this.searchData.areaId,
          distributorMchId: this.$route.query.distributorMchId,
          hotelId: this.searchData.hotelId,
          accredit: this.searchData.accredit,
          alitripHotelId: this.searchData.alitripHotelId,
          productState: this.searchData.productState,
          alitripProductState: this.searchData.alitripProductState,
          alitripChannel: this.searchData.alitripChannel
        }
        this.$refs.treeTable.loading()
        Alitrip.hotelList(params).then(res => {
          this.pageData.total = res.sizeAll
          const data = res && res.results && res.results.length ? res.results : []
          // 获取的数据处理
          this.tableData = data.map(ele => {
            return {
              ...ele,
              name: ele.hotelName + '(' + ele.id + ')',
              level: 1,
              hasChild: 1,
              checked: false,
              expanded: false,
              loading: false
            }
          })
        }).catch(e => {
          this.resetPageData()
        }).finally(() => {
          this.$refs.treeTable.unLoading()
        })
      },
      // 判断符合条件函数
      findParent(row, tableData) {
        let parentRow = null
        // 如果没找到则向后遍历，找到父级
        for (let j = 0; j < tableData.length; j++) {
          if ((tableData[j].level === row.level - 1) && tableData[j].id === row.hotelId) {
            parentRow = tableData[j]
            break
          }
        }
        return parentRow
      },
      // 切换每页显示条数
      onSizeChange(val) {
        this.pageData.resultNum = val
        this.queryHotelList()
      },
      // 切换当前页
      onCurrentChange(val) {
        this.pageData.currentPage = val
        this.queryHotelList()
      },
      // 搜索按钮，重置page参数
      querySearch(val) {
        this.pageData.currentPage = 1
        this.queryHotelList()
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      // 等分数组
      splitArr(arr, size) {
        const result = []
        for (let i = 0; i < arr.length; i += size) {
          result.push(arr.slice(i, i + size))
        }
        return result
      },
      updateSelect(pId) {
        // 飞猪产品id
        Alitrip.alitripHotelProduct(pId).then(res => {
          this.updateData.dialogVisible = true
          this.updateData.distributorMchId = res.distributorMchId
          this.updateData.pId = pId
          this.updateData.alitripGid = res.alitripGid
          this.updateData.alitripRpid = res.alitripRpid
          this.updateData.channelRpName = res.channelRpName
          this.updateData.applyNumSet = res.applyNumSet
          this.updateData.selectChannel = res.alitripChannel ? res.alitripChannel.split(',') : []
          if (res.pushApplySet === 1) {
            this.updateData.pushApplySet = true
          } else {
            this.updateData.pushApplySet = false
          }
          const searchHotel = {
            channelHotelId: res.channelHotelId,
            distributorMchId: res.distributorMchId
          }
          const searchRoom = {
            channelRoomId: res.channelRoomId,
            distributorMchId: res.distributorMchId
          }
          Alitrip.alitripHotelGet(searchHotel).then(res => {
            this.updateData.hotelName = res.msg
          })
          Alitrip.alitripRoomGet(searchRoom).then(res => {
            this.updateData.roomName = res.msg
          })
        })
      },
      showPrice(row) {
        const params = {
          productId: row.id,
          planId: 0,
          distributorMchId: row.distributorMchId
        }
        Alitrip.priceGet(params).then(res => {
          if (res.state === 'success') {
            this.viewData.dialogVisible = true
            const obj = res.data.priceValueMap
            if (obj) {
              const arr = Object.keys(obj).map(ele => {
                return {
                  date: ele,
                  stock: obj[ele]['num'],
                  price: obj[ele]['salePrice'],
                  roomState: obj[ele]['state']
                }
              })
              console.log(arr)
              this.viewData.hotelPrice = arr
            } else {
              this.viewData.hotelPrice = []
            }
          } else {
            this.viewData.dialogVisible = true
          }
        })
      },
      syncPrice(row, type, distributorMchId) {
        const params = {
          id: row.pId,
          type: type,
          distributorMchId: distributorMchId
        }
        Alitrip.priceSync(params).then(res => {
          if (res.state === 'success') {
            if (row.rateState === 3) {
              row.rateState = 1
            }
            this.$message({
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      },
      productDowm(row, type, distributorMchId) {
        const params = {
          id: row.pId,
          type: type,
          distributorMchId: distributorMchId
        }
        Alitrip.priceSync(params).then(res => {
          if (res.state === 'success') {
            row.rateState = 2
            this.$message({
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      },
      productUp(row, type, distributorMchId) {
        const params = {
          id: row.pId,
          type: type,
          distributorMchId: distributorMchId
        }
        Alitrip.priceSync(params).then(res => {
          if (res.state === 'success') {
            row.rateState = 1
            this.$message({
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      },
      productUpdate(updateData) {
        if (this.updateData.selectChannel) {
          this.updateData.alitripChannel = ''
          for (var i = 0; i < this.updateData.selectChannel.length; i++) {
            if (i > 0) {
              this.updateData.alitripChannel = this.updateData.alitripChannel + ','
            }
            this.updateData.alitripChannel = this.updateData.alitripChannel + this.updateData.selectChannel[i]
          }
        } else {
          this.updateData.alitripChannel = ''
        }
        const params = {
          id: updateData.pId,
          distributorMchId: updateData.distributorMchId,
          pushApplySet: updateData.pushApplySet === true ? 1 : 0,
          applyNumSet: updateData.applyNumSet,
          channelRpName: updateData.channelRpName,
          alitripChannel: this.updateData.alitripChannel
        }
        Alitrip.prodUpdate(params).then(res => {
          if (res.state === 'success') {
            updateData.dialogVisible = false
            this.$message({
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      },
      productDel(id, distributorMchId) {
        this.deleteData.dialogVisible = false
        Alitrip.delProduct(id, distributorMchId).then(res => {
          if (res.state === 'success') {
            this.$message({
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      },
      deleteSelect(row) {
        this.deleteData.pId = row.pId
        this.deleteData.distributorMchId = row.distributorMchId
        this.deleteData.dialogVisible = true
      },
      // 地区组件值变化的时候进行回调获取
      getAreaId(val) {
        if (val.id) {
          this.searchData.areaId = val.id
        } else {
          this.searchData.areaId = '0'
        }
      },
      link2Alitrip(alitripProductId) {
        Alitrip.alitripIidSearch(alitripProductId).then(res => {
          if (res.state === 'success') {
            window.open(res.msg)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  .search-box {
    float: left;
    margin-top: 15px;
    margin-left: 20px;
  }

  .search-item {
    width: 200px;
    margin: 0 10px;
  }

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

  .search-frame {
    margin-bottom: 15px;
  }
</style>
