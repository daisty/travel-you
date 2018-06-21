<template>
  <!-- 此组件的唯一根节点 -->
  <div class="app-container">
    <el-form ref="orderInfoForm" :rules="rules" :model="orderInfoForm" label-width="120px">
      <div>
        <div class="title">预订信息录入</div>
        <el-row>
          <el-col :span="6" >
            <el-form-item :label="$t('hotelProduct.checkInDate')">
              <el-date-picker
                v-model="allDate"
                type="daterange"
                size="small"
                @change="dateChange"
                :clearable='false'
                :picker-options="validatorDate"
                :start-placeholder="$t('calendar.startDate')"
                :end-placeholder="$t('calendar.endDate')">
              </el-date-picker>
            </el-form-item>
            <!--{{ $t('hotelProduct.checkInDate') }}
            <el-date-picker
              v-model="allDate"
              type="daterange"
              size="small"
              @change="dateChange"
              :clearable='false'
              :picker-options="validatorDate"
              :start-placeholder="$t('calendar.startDate')"
              :end-placeholder="$t('calendar.endDate')">
            </el-date-picker>-->
          </el-col>
          <el-col :span="3">
            <el-form-item label="共计">
              <font color="red">{{ orderInfoForm.totalNight }}</font> <font color="#606266">晚</font>
            </el-form-item>
            <!--<div class="totalNightlabel" >共计：<font color="red">{{ orderInfoForm.totalNight }}</font> 晚</div>-->
          </el-col>
          <el-col :span="4" >
            <el-form-item label="最晚到店时间" prop="latestCheckinTime">
              <!--<el-date-picker v-model="orderInfoForm.latestCheckinTime" :editable=false :clearable=false type="datetime" placeholder="选择日期" ></el-date-picker>-->
              <el-time-select size="small" v-model="orderInfoForm.latestCheckinTime" :editable=false :clearable=false :picker-options="{ start: '07:00', step: '01:00', end: '24:00' }" placeholder="选择时间">
              </el-time-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="房间数量" prop="num">
            <el-input size="small" v-model="orderInfoForm.num" placeholder="请输入房间数量" style="width: 150px" ></el-input>
            <font color="red">*此数为每天的房间数量</font>
          </el-form-item>
        </el-row>
        <div><font color="blue">{{ orderInfoForm.roomTypeName }}</font></div>
        <div class="table">
          <el-table :data="orderInfoForm.tableData" ref="table" border style="width: 100%" @selection-change="handleSelectionChange" show-summary sum-text="产品金额小计">
            <el-table-column
              header-align="center"
              align="center"
              type="selection"
              label="选择"
              :selectable="noSelect"
              width="120">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="checkinDate"
              label="入住日期"
              width="180">
            </el-table-column>
            <!--<el-table-column
              :class-name="'num-center'"
              header-align="center"
              align="center"
              prop="num"
              label="数量(间)"
              width="180">
              <template slot-scope="scope">
                <el-form-item label="" label-width="0px" :prop="'tableData[' + scope.$index + '].num'" :rules="rules.num"> &lt;!&ndash;:prop="'touristInfos.' + index + '.name'" :rules="rules.name"&ndash;&gt;
                  <el-input v-model="scope.row.num" size="mini" placeholder="请输入数量" style="width: 105px" ></el-input>
                </el-form-item>
              </template>
            </el-table-column>-->
            <el-table-column
              header-align="center"
              align="center"
              prop="conferPrice"
              label="结算价(元)">
              <template slot-scope="scope">
                {{scope.row.conferPrice / 100}}
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="salePrice"
              label="零售价(元)">
              <template slot-scope="scope">
                {{scope.row.salePrice / 100}}
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="settlementAmount"
              label="结算金额(元)">
              <template slot-scope="scope">
                {{scope.row.settlementAmount / 100}}
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="salesProfit"
              label="销售利润(元)">
              <template slot-scope="scope">
                {{scope.row.salesProfit / 100}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="total" style="padding-top: 45px">
        <!--<div style="padding-right: 200px;text-align: right"><font color="green">订单费用总计：</font><font style="color: red">￥{{ orderInfoForm.totalPrice }}</font></div>-->
        <div style="padding-right: 200px;text-align: right"><font color="green">订单费用总计：</font><font style="color: red">
          {{ orderInfoForm.totalPrice | moneyFormat }}
        </font></div>
        <hr>
      </div>
      <div class="tip" style="padding: 10px">
        <font color="red">*声明：建议按照统一的建议零售价格进行销售，如果违反规定被查出，将取消分销资格，同时造成的一切后果自负</font>
      </div>
      <div class="">
        <div class="title">
          游客资料录入(必须输入游客资料，如资料有误，导致预订失败，供应商不承担责任。)
          <el-button size="mini" type="primary" @click="addTourist">加一人</el-button>
          <el-button size="mini" type="primary" @click="delTourist">减一人</el-button>
        </div>
        <div :class="{'touristInfo-template':index > 0}" v-for="(item, index) in orderInfoForm.touristInfos" :key="index">
          <!--:prop="'touristInfos[' + index + '].name'" 与 :prop="'touristInfos.' + index + '.name'" 效果一样-->
          <el-form-item required class="addPeople">
            <el-col :span="9">
              <el-form-item label="游客姓名" :prop="'touristInfos[' + index + '].contactName'" :rules="rules.contactName">
                <el-input v-model="item.contactName" placeholder="请输入游客姓名" class="touristInfo-input" style="width: 300px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="游客手机" :prop="'touristInfos.' + index + '.contactPhone'" :rules="rules.contactPhone">
                <el-input v-model="item.contactPhone" placeholder="请输入游客手机" class="touristInfo-input" style="width: 400px"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item required class="addPeople">
            <el-col :span="9">
              <el-form-item label="游客年龄" :prop="'touristInfos.' + index + '.contactAge'" :rules="rules.contactAge">
                <el-input-number v-model="item.contactAge" controls-position="right" :min="0" :max="200"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="游客国籍" :prop="'touristInfos.' + index + '.contactNationality'" :rules="rules.contactNationality">
                <el-select v-model="item.contactNationality" placeholder="请选择国籍" filterable>
                  <el-option label="中国" value="0"></el-option>
                  <el-option label="日本" value="1"></el-option>
                  <el-option label="韩国" value="2"></el-option>
                  <el-option label="法国" value="3"></el-option>
                  <el-option label="俄罗斯" value="4"></el-option>
                  <el-option label="意大利" value="5"></el-option>
                  <el-option label="德国" value="6"></el-option>
                  <el-option label="美国" value="7"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item required class="addPeople">
            <el-col :span="9">
              <el-form-item label="证件类型" :prop="'touristInfos.' + index + '.contactIdType'" :rules="rules.contactIdType">
                <el-select v-model="item.contactIdType" placeholder="请选择证件类型" filterable>
                  <el-option label="身份证" value="0"></el-option>
                  <el-option label="学生证" value="1"></el-option>
                  <el-option label="军官证" value="2"></el-option>
                  <el-option label="护照" value="3"></el-option>
                  <el-option label="户口本(儿童请选择此项)" value="4"></el-option>
                  <el-option label="港澳通行证" value="5"></el-option>
                  <el-option label="台胞证" value="6"></el-option>
                  <el-option label="入台证" value="7"></el-option>
                  <el-option label="香港居民往来内地通行证" value="8"></el-option>
                  <el-option label="警官证" value="9"></el-option>
                  <el-option label="驾驶证" value="10"></el-option>
                  <el-option label="海员证" value="11"></el-option>
                  <el-option label="外国人在中国永久居留证" value="12"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="证件号码" :prop="'touristInfos.' + index + '.contactIdNo'" :rules="rules.contactIdNo">
                <el-input v-model="item.contactIdNo" placeholder="请输入证件号码" class="touristInfo-input" :disabled="item.contactIdType === ''" style="width: 400px"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
        </div>
      </div>
      <div class="">
        <div class="title">
          订单附加信息
        </div>
        <el-form-item label="贵司订单号">
          <el-input v-model="orderInfoForm.orderNo" placeholder="请输入贵司订单号" class="touristInfo-input" ></el-input>
          <font color="green">便于查询和对账。</font>
        </el-form-item>
        <el-form-item label="公司备注">
          <el-input type="textarea" v-model="orderInfoForm.remark"  placeholder="请输入公司备注" class="touristInfo-input"></el-input>
          <font color="green"> 录入客人的一些情况和需求（房型备注需要回复确认才有效，否则尽量按备注安排），价格信息备注无效。</font>
        </el-form-item>
      </div>
      <div style="padding: 10px">
        <div >
          <el-button size="mini" type="primary" @click="save('orderInfoForm')">同意预订协议并保存订单</el-button>
          (<font style="color: red">*此产品为网络限价产品；</font>) (<font style="color: red">*必须在线支付成功后订单才会生效。</font>)
        </div>
        <hr color="#003333" size="2">
      </div>
      <editor @getContent="getContent" ref="editor" :h="330" :contenteditable="'false'" :id="'reservationProtocol'" :con="orderInfoForm.content" ></editor>
    </el-form>
  </div>
</template>

<script>
  import { parseTime } from '@/utils/index'
  import { dateFormatShort, validateIdCard } from '@/utils/tools'
  import hotelBooking from '@/api/booking/hotelBooking'
  import Editor from '@/components/Editor'
  // import VueNumeric from 'vue-numeric'
  /**
   *  需要响应式的数据均需在data中提前写入
   */
  export default {
    components: {
      Editor/* ,
      VueNumeric */
    },
    // 页面数据源
    data() {
      const that = this
      var validateNum = (rule, value, callback) => {
        const pattern = /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/ // 整数
        if (!value) {
          callback(new Error('数量不能为空'))
        } else if (!pattern.test(value)) {
          callback(new Error('请输入数字'))
        } else if (!pattern.test(value) || value < 1 || value > 10) {
          callback(new Error('只能预订1到10间'))
        } else {
          callback()
          // 改变数量后重新计算总价格
          this.calculateTotalPrice()
        }
      }
      // 校验身份证合法性
      var formValidateIdCard = (rule, value, callback) => {
        const arr = rule.field.split('.') // "touristInfos.0.contactIdNo"
        // 证件类型
        const isIdCard = that.orderInfoForm.touristInfos[arr[1]].contactIdType === '0'
        if (isIdCard) {
          const tip = validateIdCard(value)
          // 返回值不为空，则提示
          if (tip) {
            callback(new Error(tip))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        // 表单数据
        orderInfoForm: {
          num: 1, // 房间数量，每天的数量必须一样
          tableData: [],
          touristInfos: [
            {
              contactName: '', // 游客名称
              contactPhone: '', // 游客手机
              contactIdType: '', // 证件类型
              contactIdNo: '', // 证件号码
              contactNationality: '', // 国籍
              contactAge: '' // 年龄
            }
          ], // 游客信息，默认一个，可能多个
          roomTypeName: '',
          productId: '', // 产品编号
          hotelOrderDetails: [], // 订单详情，一天一个详情记录

          totalNight: 1, // 住的晚数
          totalPrice: 0, // 订单总价
          // checkinDate: new Date(), //
          // checkoutDate: new Date(new Date().setDate(new Date().getDate() + 1)), //
          latestCheckinTime: '12:00',
          content: '产品信息 ',
          orderNo: '', // 贵司单号
          remark: '' // 贵司备注
        },
        allDate: [new Date(), new Date(new Date().setDate(new Date().getDate() + 1))],
        // 无法选择昨天以前
        validatorDate: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e6
          }
        },
        // 表单验证
        rules: {
          latestCheckinTime: [
            { required: true, vmessage: '此项不能为空', trigger: 'blur' }
          ],
          contactName: [
            { required: true, message: '名字不能为空', trigger: 'blur' },
            { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
          ],
          contactPhone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: function(rule, value, callback) {
              if (/^1[34578]\d{9}$/.test(value) === false) {
                callback(new Error('请输入正确的手机号'))
              } else {
                callback()
              }
            }, trigger: 'blur' }
          ],
          contactIdType: [
            { required: true, message: '请选择证件类型', trigger: 'change' }
          ],
          contactIdNo: [
            { required: true, validator: formValidateIdCard, trigger: 'blur' }
          ],
          num: [
            { required: true, validator: validateNum, trigger: 'blur' }
          ],
          contactNationality: [
            { required: true, message: '国籍不能为空', trigger: 'change' }
          ],
          contactAge: [
            { required: true, message: '年龄不能为空', trigger: 'blur' },
            { validator: function(rule, value, callback) {
              if (value === 0) {
                callback(new Error('请输入正确的年龄'))
              } else {
                callback()
              }
            }, trigger: 'blur' }
          ]
        }
      }
    },
    // Vue生命周期函数
    created() {
      this.initDate()
      this.list()
    },
    // Vue生命周期函数
    mounted() {
      // 默认选中全部房间
      this.selectAll()
      // 使富文本框不能编辑
      this.disableEdit()
      // 计算订单总价
      this.calculateTotalPrice()
    },
    // 自定义方法
    methods: {
      // 计算下单房间总晚数
      calculateTotalNight() {
        this.orderInfoForm.totalNight = (this.allDate[1].getTime() - this.allDate[0].getTime()) / (3600 * 24 * 1000)
      },
      // 计算订单总价
      calculateTotalPrice() {
        let totalPrice = 0
        this.orderInfoForm.tableData.forEach(row => {
          row.settlementAmount = row.conferPrice * this.orderInfoForm.num // 结算金额
          row.salesProfit = (row.salePrice - row.conferPrice) * this.orderInfoForm.num // 销售利润
          totalPrice += row.salePrice * this.orderInfoForm.num // 订单费用总计
        })
        this.orderInfoForm.totalPrice = totalPrice
      },
      // 手动设置富文本不可编辑
      disableEdit() {
        document.querySelector('div[id="reservationProtocol"] div[contenteditable="true"]').setAttribute('contenteditable', 'false')
      },
      // 表格默认选中
      selectAll() {
        // 这个回调函数在dom更新完成后调用
        this.$nextTick(function() {
          this.orderInfoForm.tableData.forEach(row => {
            this.$refs.table.toggleRowSelection(row, true)
          })
        })
      },
      // 表格是否可以勾选
      noSelect(row, index) {
        return false
      },
      dateChange() {
        // 计算总晚数
        this.calculateTotalNight()
        this.list()
      },
      getContent(obj) {
        this.orderInfoForm.content = obj.html
      },
      arrivalTime2Int(arrivalTime) {
        return arrivalTime ? arrivalTime.split(':')[0] : 23
      },
      // 保存预订信息
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 补全订单详情
            this.orderInfoForm.hotelOrderDetails.forEach(row => {
              row.num = this.orderInfoForm.num // 产品数量
              row.orderTotalPrice = row.num * row.orderPrice
              //    this.orderInfoForm
            })
            const addOrderForm = {
              productId: this.orderInfoForm.productId, // 产品编号
              checkinDate: dateFormatShort(this.allDate[0]), // 入住日期
              checkoutDate: dateFormatShort(this.allDate[1]), // 离店日期
              arrivalTime: this.arrivalTime2Int(this.orderInfoForm.latestCheckinTime), // 最晚到店时间
              hotelOrderPeopleAddParams: this.orderInfoForm.touristInfos, // 游客信息list
              totalNum: this.orderInfoForm.totalNight * this.orderInfoForm.num, // 订单产品总数
              totalPrice: this.orderInfoForm.totalPrice, // 订单总价
              supplierOrderId: this.orderInfoForm.orderNo, // 贵司单号 -- 供应商订单号
              orderMemo: this.orderInfoForm.remark, // 贵司备注
              hotelOrderDetailAddParams: this.orderInfoForm.hotelOrderDetails // 订单详情，一天一个详情记录
            }
            hotelBooking.addOrder(addOrderForm).then(res => {
              if (res.state === 'success') {
                this.$message({
                  type: 'success',
                  message: '下单成功',
                  duration: 1000
                })
                this.$router.push({
                  path: '/order/hotelOrders/list'
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: res.msg,
                  duration: 2000
                })
                return false
              }
            }).catch(e => {
              console.log('e : ', e)
              this.$message({
                type: 'success',
                message: '下单失败'
              })
            })
          }
        })
      },
      // 添加游客
      addTourist() {
        const tourist = {
          contactName: '', // 游客名称
          contactPhone: '', // 游客手机
          contactIdType: '', // 证件类型
          contactIdNo: '' // 证件号码
        }
        this.orderInfoForm.touristInfos.push(tourist)
      },
      // 减少游客
      delTourist() {
        if (this.orderInfoForm.touristInfos.length > 1) {
          this.orderInfoForm.touristInfos.pop()
        } else {
          this.$message({
            type: 'info',
            message: '最少有一个游客'
          })
        }
      },
      // 表格选中事件
      handleSelectionChange() {
      },
      // 刚跳转到此页面时，初始化日期和晚数
      initDate() {
        // 入住时间
        const startDate = Number(this.$route.query.sdate) // * 1000
        this.allDate[0] = new Date(startDate)
        // 离店时间
        const endDate = Number(this.$route.query.edate) // * 1000
        this.allDate[1] = new Date(endDate)
        // 计算总晚数
        this.calculateTotalNight()
      },
      // 获取所有
      list() {
        // 入住时间
        const startDate = this.allDate[0].getTime()
        // 离店时间
        const endDate = this.allDate[1].getTime()

        this.orderInfoForm.productId = this.$route.query.productId // 保存产品编号
        const params = {
          productId: this.$route.query.productId, // 产品编号 'from router'
          planId: this.$route.query.planId, // 价格计划编号（产品计划）
          startDate: parseTime(startDate, '{y}-{m}-{d}'), // 入住时间
          endDate: parseTime(endDate, '{y}-{m}-{d}') // 离店时间
          // latestCheckinTime: this.orderInfoForm.latestCheckinTime // 最晚到店时间
        }
        this.tableLoading = true
        hotelBooking.getProductPriceList(params).then(res => {
          this.orderInfoForm.roomTypeName = res ? res.hotelName : '' // 显示产品名称
          this.orderInfoForm.content = res ? res.bookingInfo : ''// 富文本显示产品预订说明
          if (res && res.price && res.price.priceValueMap) {
            const priceValueMap = res.price.priceValueMap
            const newTableData = []
            const newHotelOrderDetails = []
            for (const checkinDate in priceValueMap) {
              const d = {
                checkinDate: checkinDate, // 入住日期yyyy-mm-dd
                conferPrice: priceValueMap[checkinDate].conferPrice, // 结算价
                salePrice: priceValueMap[checkinDate].salePrice, // 零售价
                settlementAmount: priceValueMap[checkinDate].conferPrice, // 结算金额
                salesProfit: priceValueMap[checkinDate].salePrice - priceValueMap[checkinDate].conferPrice // 销售利润
              }
              const hd = {
                checkinDate: checkinDate, // 入住日期yyyy-mm-dd
                orderPrice: priceValueMap[checkinDate].salePrice // 产品下单价格--零售价
              }
              newTableData.push(d)
              newHotelOrderDetails.push(hd)
            }
            this.orderInfoForm.tableData = newTableData
            this.orderInfoForm.hotelOrderDetails = newHotelOrderDetails
            // 默认选中全部房间
            this.selectAll()
            // 计算订单总价
            this.calculateTotalPrice()
          }
          this.tableLoading = false
        })
      }
    }
  }
</script>
<style scoped>
  .search-box {
    text-align: right;
    margin-bottom: 15px;
  }
  .search-box .left {
    float: left;
  }
  .search-item {
    width:200px;
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
  .line {
    color: #606266;
  }
  .paperArea {
    /*color: #555555;*/
    font-weight: bold;
    font-size: small;
    /*background-color: #e2eeff;*/
    padding: 10px;
    border: 0.5px solid #97a8be;
    margin: 15px;
    margin-left: 0px;
    padding-left: 28px;
    background-position: 5px 5px;
  }
  .app-container {
    margin-bottom: 50px;
  }
  .touristInfo-input {
    width: 30%;
  }
  .table {
    padding-top: 20px;
  }
  .totalNightlabel {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
  }
  .touristInfo-template {
    padding-top: 20px;
    border-top: 1px solid #ddd;
  }
  .addPeople {
    margin-left: -120px;
  }
  .textSize {
    width: 600px;
  }
</style>
<style>
  .num-center .el-form-item__error {
    width: 100%;
  }
</style>

