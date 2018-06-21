<template>
  <!-- 此组件的唯一根节点 -->
  <div class="app-container">
    <el-form ref="orderInfoForm" :rules="rules" :model="orderInfoForm" label-width="120px">
      <div class="title" style="">
        <span style="font-family:'Hiragino Sans GB'"> 订单详情</span><span style="color:#008000;width: 1200px; display:inline-block;"></span>
      </div>
      <el-card class="box-card margin-bottom-15">
        <div class="text item">
          <span class="orderTitle">订单状态:</span><span class="orderTitleNo">已确认，待支付</span><br>
          <div style="padding-top: 15px;margin-bottom: -10px">
            <span class="orderTitle">下单日期:</span><span class="orderTitleNo">2018-04-12 10:47</span>
          </div>
        </div>
      </el-card>

      <div class="title">
        <span class="fontUser">预订信息录入</span><span class="headStyle"></span>
      </div>
      <el-card class="box-card margin-bottom-15">
        <div class="text item">
          <el-form-item label="入住日期" required>
            <el-row>
              <el-col :span="4">
                <el-form-item prop="checkinDate">
                  <el-date-picker @change="selectCheckinDate" :editable=false :clearable=false
                                  v-model="orderInfoForm.checkinDate" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="离店日期" prop="checkinDate">
                  <el-date-picker @change="selectCheckoutDate" v-model="orderInfoForm.checkoutDate" :editable=false
                                  :clearable=false type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <div class="totalNightlabel">共计：<span class="totalRed">{{ orderInfoForm.totalNight }}</span> 晚</div>
              </el-col>
              <el-col :span="4">
                <el-form-item label="最晚到店时间" prop="latestCheckinTime">
                  <!--<el-date-picker v-model="orderInfoForm.latestCheckinTime" :editable=false :clearable=false type="datetime" placeholder="选择日期" ></el-date-picker>-->
                  <el-time-select v-model="orderInfoForm.latestCheckinTime" :editable=false :clearable=false
                                  :picker-options="{ start: '07:00', step: '01:00', end: '24:00' }" placeholder="选择时间">
                  </el-time-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="房间数量" prop="num">
            <el-input v-model="orderInfoForm.num" placeholder="请输入房间数量" class="widthHunFive"></el-input>
            <span class="fontUser colorRed">*此数为每天的房间数量</span>
          </el-form-item>
          <div class="table">
            <el-table :data="orderInfoForm.tableData" ref="table" border class="widthHunPr"
                      @selection-change="handleSelectionChange" show-summary sum-text="产品金额小计">
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
              <el-table-column
                header-align="center"
                align="center"
                prop="settlementPrice"
                label="结算价(元)">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="retailPrice"
                label="零售价(元)">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="settlementAmount"
                label="结算金额(元)">
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="salesProfit"
                label="销售利润(元)">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="total table">
          <div class="cost"><span class="colorGreen">订单费用总计：</span><span class="totalRed">￥{{ orderInfoForm.totalPrice
            }}</span></div>
        </div>
        <div class="tip">
          <span class="fontUser">*声明：建议按照统一的建议零售价格进行销售，如果违反规定被查出，将取消分销资格，同时造成的一切后果自负</span>
        </div>
      </el-card>


      <div class="title">
        <span class="fontUser">游客资料录入</span><span class="headStyle">
        </span>
      </div>
      <el-card class="box-card margin-bottom-15">
        <div class="text item">
          <div class="addPe">
            <el-button size="mini" type="primary" @click="delTourist">减一人</el-button>
            <el-button size="mini" type="primary" @click="addTourist">加一人</el-button>
          </div>
          <div :class="{'touristInfo-template':index > 0}" v-for="(item, index) in orderInfoForm.touristInfos" :key="index">
            <!--:prop="'touristInfos[' + index + '].name'" 与 :prop="'touristInfos.' + index + '.name'" 效果一样-->
            <el-form-item required class="addPeople">
              <el-col :span="9">
                <el-form-item label="游客姓名" :prop="'touristInfos[' + index + '].contactName'" :rules="rules.contactName">
                  <el-input v-model="item.contactName" placeholder="请输入游客姓名"
                            class="touristInfo-input widthThreeHun"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="游客手机" :prop="'touristInfos.' + index + '.contactPhone'"
                              :rules="rules.contactPhone">
                  <el-input v-model="item.contactPhone" placeholder="请输入游客手机"
                            class="touristInfo-input widthFourHun"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item required class="addPeople">
              <el-col :span="9">
                <el-form-item label="游客年龄" :prop="'touristInfos.' + index + '.contactAge'" :rules="rules.contactAge">
                  <el-input-number v-model="item.contactAge" controls-position="right" :min="0"
                                   :max="200"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="游客国籍" :prop="'touristInfos.' + index + '.contactNationality'"
                              :rules="rules.contactNationality">
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
                <el-form-item label="证件类型" :prop="'touristInfos.' + index + '.contactIdType'"
                              :rules="rules.contactIdType">
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
                  <div v-if="item.contactIdType === ''">
                    <el-input v-model="item.contactIdNo" placeholder="请输入证件号码" class="touristInfo-input widthFourHun"
                              :disabled="true"></el-input>
                  </div>
                  <div v-else>
                    <el-input v-model="item.contactIdNo" placeholder="请输入证件号码"
                              class="touristInfo-input widthFourHun"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-form-item>
          </div>
        </div>
      </el-card>


      <div class="title">
        <span class="fontUser">订单附加信息</span><span class="headStyle"></span>
      </div>
      <el-card class="box-card margin-bottom-15">
        <div class="text item">
          <el-form-item label="贵司订单号">
            <el-input v-model="orderInfoForm.orderNo" placeholder="请输入贵司订单号" class="touristInfo-input"></el-input>
            <span class="colorGreen">便于查询和对账。</span>
          </el-form-item>
          <el-form-item label="公司备注">
            <el-input type="textarea" v-model="orderInfoForm.remark" placeholder="请输入公司备注"
                      class="touristInfo-input"></el-input>
            <span class="colorGreen"> 录入客人的一些情况和需求（房型备注需要回复确认才有效，否则尽量按备注安排），价格信息备注无效。</span>
          </el-form-item>
        </div>
      </el-card>

      <div class="padTwoFiveTwo">
        <div>
          <el-button :plain="true" :round="true" icon="el-icon-edit" size="mini" type="primary"
                     @click="save('orderInfoForm')">同意预订协议并保存订单
          </el-button>
          (<span class="fontUser colorRed">*此产品为网络限价产品；</span>) (<span
          class="fontUser colorRed">*必须在线支付成功后订单才会生效。</span>)
        </div>
        <hr color="#ddd" size="2">
      </div>
      <editor @getContent="getContent" ref="editor" :h="330" :contenteditable="'false'" :id="'reservationProtocol'"
              :con="orderInfoForm.content"></editor>
    </el-form>
  </div>
</template>

<script>
  import { parseTime } from '@/utils/index'
  import Editor from '@/components/Editor'
  import hotelBooking from '@/api/booking/hotelBooking'

  /**
   *  需要响应式的数据均需在data中提前写入
   */
  export default {
    components: {
      Editor
    },
    // 页面数据源
    data() {
      var validateDate = (rule, value, callback) => {
        const checkinTime = this.orderInfoForm.checkinDate.setHours(0, 0, 0, 0) // 入住当天0点时间戳
        const checkoutTime = this.orderInfoForm.checkoutDate.setHours(0, 0, 0, 0) // 离店当天0点时间戳
        const nowTime = new Date().setHours(0, 0, 0, 0) // 填写当天0点时间戳
        if (checkinTime < nowTime) {
          callback(new Error('入住日期不能早于当前日期'))
        } else if (checkinTime >= checkoutTime) {
          callback(new Error('离店日期必须大于入住日期'))
        } else {
          callback()
        }
        // 校验通过后计算下单房间总晚数
        this.calculateTotalNight(checkinTime, checkoutTime)
      }
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
        }
        // 改变数量后重新计算总价格
        this.calculateTotalPrice()
      }
      return {
        rankId: '',
        radio: '',
        transferLoading: true, // 转移主题是否加载
        dialogType: null, // 弹窗类型，新增或编辑
        formLabelWidth: '150px', // 弹出框宽度
        dialogFormVisible: false, // 是否弹出弹出框
        transferDialogFormVisible: false, // 是否弹出转移主题弹出框
        keyName: '',
        distributorId: '',
        transferForm: {
          id: '',
          tagName: '',
          tagId: ''
        },
        queryParam: {
          /* 保存开始日期结束日期的array */
          date: [],
          province: '',
          city: '',
          productType: ''
        },
        // 表单数据
        orderInfoForm: {
          num: 1, // 每天的房间数量
          tableData: [],
          touristInfos: [
            {
              contactName: 'Terry', // 游客名称
              contactPhone: '13983728321', // 游客手机
              contactIdType: '1', // 证件类型
              contactIdNo: '1', // 证件号码
              contactNationality: '1', // 国籍
              contactAge: '22' // 年龄
            }
          ], // 游客信息，默认一个，可能多个
          roomTypeName: '七天酒店豪华大床房',
          productId: this.$route.query.productId,
          hotelOrderDetails: [], // 订单详情，一天一个详情记录
          totalNight: 1, // 住的晚数
          totalPrice: 0, // 订单总价
          checkinDate: new Date(),
          checkoutDate: new Date(new Date().setDate(new Date().getDate() + 1)),
          latestCheckinTime: '12:00',
          content: '协议内容 ',
          orderNo: '',
          remark: ''
        },
        // 表单验证
        rules: {
          checkinDate: [
            { required: true, validator: validateDate, trigger: 'blur' }
          ],
          checkoutDate: [
            { required: true, validator: validateDate, trigger: 'blur' }
          ],
          latestCheckinTime: [
            { required: true, vmessage: '此项不能为空', trigger: 'blur' }
          ],
          contactName: [
            { required: true, message: '名字不能为空', trigger: 'blur' }
          ],
          contactPhone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            {
              validator: function(rule, value, callback) {
                if (/^1[34578]\d{9}$/.test(value) === false) {
                  callback(new Error('请输入正确的手机号'))
                } else {
                  callback()
                }
              }, trigger: 'blur'
            }
          ],
          contactIdType: [
            { required: true, message: '请选择证件类型', trigger: 'blur' }
          ],
          contactIdNo: [
            { required: true, message: '证件编号不能为空', trigger: 'blur' }
          ],
          num: [
            { required: true, validator: validateNum, trigger: 'blur' }
          ],
          contactNationality: [
            { required: true, message: '国籍不能为空', trigger: 'blur' }
          ],
          contactAge: [
            { required: true, message: '年龄不能为空', trigger: 'blur' },
            {
              validator: function(rule, value, callback) {
                if (value === 0) {
                  callback(new Error('请输入正确的年龄'))
                } else {
                  callback()
                }
              }, trigger: 'blur'
            }
          ]
        }
      }
    },
    computed: {},
    // Vue生命周期函数
    created() {

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
      calculateTotalNight(checkinTime, checkoutTime) {
        this.orderInfoForm.totalNight = (checkoutTime - checkinTime) / (3600 * 24 * 1000)
      },
      // 计算订单总价
      calculateTotalPrice() {
        let totalPrice = 0
        this.orderInfoForm.tableData.forEach(row => {
          totalPrice += row.num * row.settlementAmount
        })
        this.orderInfoForm.totalPrice = totalPrice
      },
      // 手动设置富文本不可编辑
      disableEdit() {
        document.querySelector('div[id="reservationProtocol"] div[contenteditable="true"]').setAttribute('contenteditable', 'false')
      },
      // 表格默认选中
      selectAll() {
        this.orderInfoForm.tableData.forEach(row => {
          this.$refs.table.toggleRowSelection(row, true)
        })
      },
      // 表格是否可以勾选
      noSelect(row, index) {
        return false
      },
      selectCheckinDate() {
        this.$message({
          type: 'success',
          message: '入住日期' + this.orderInfoForm.checkinDate.getFullYear()
        })
        const checkinDatetime = this.orderInfoForm.checkinDate.getTime()
        this.orderInfoForm.checkoutDate = new Date(new Date(checkinDatetime).setDate(this.orderInfoForm.checkinDate.getDate() + 1))
        this.orderInfoForm.totalNight = 1
        this.list()
      },
      selectCheckoutDate() {
        this.$message({
          type: 'success',
          message: '离店日期' + this.orderInfoForm.checkoutDate.getFullYear()
        })
        this.list()
      },
      getContent(obj) {
        this.orderInfoForm.content = obj.html
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
              productId: this.orderInfoForm.productId ? 1645 : 1645, // 产品编号
              checkinDate: this.orderInfoForm.checkinDate, // 入住日期
              checkoutDate: this.orderInfoForm.checkoutDate, // 离店日期
              arrivalTime: this.orderInfoForm.latestCheckinTime, // 最晚到店时间
              hotelOrderPeopleAddParams: this.orderInfoForm.touristInfos, // 游客信息list
              totalNum: this.orderInfoForm.totalNight * this.orderInfoForm.num, // 订单产品总数
              totalPrice: this.orderInfoForm.totalPrice, // 订单总价
              supplierOrderId: this.orderInfoForm.orderNo, // 贵司单号 -- 供应商订单号
              hotelOrderDetailAddParams: this.orderInfoForm.hotelOrderDetails // 订单详情，一天一个详情记录
            }
            const extraParams = {
              orderMemo: this.orderInfoForm.remark, // 贵司备注
              roomNum: this.orderInfoForm.num // 每晚的房间数量--每晚数量必须一样
            }
            hotelBooking.addOrder(addOrderForm, extraParams).then(res => {
              if (res.status === 'success') {
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
            type: 'warning',
            message: '最少有一个游客'
          })
        }
      },
      // 表格选中事件
      handleSelectionChange() {
      },
      // 获取所有
      list() {
        const startDate = this.orderInfoForm.checkinDate ? this.orderInfoForm.checkinDate : new Date() // 入住时间
        const endDate = this.orderInfoForm.checkoutDate ? this.orderInfoForm.checkoutDate : new Date() // 离店时间
        this.orderInfoForm.productId = this.$route.query.productId // 保存产品编号
        const params = {
          productId: this.$route.query.productId, // 产品编号 'from router'
          // planId: '', // 价格计划编号（产品计划）
          startDate: parseTime(startDate, '{y}-{m}-{d}'), // 入住时间
          endDate: parseTime(endDate, '{y}-{m}-{d}') // 离店时间
          // latestCheckinTime: this.orderInfoForm.latestCheckinTime // 最晚到店时间
        }
        this.tableLoading = true
        hotelBooking.getProductPriceList(params).then(res => {
          console.log('res : ', res)
          if (res && res.price && res.price.priceValueMap) {
            res.productName ? this.orderInfoForm.roomTypeName = res.productName : this.orderInfoForm.roomTypeName = '#' // 保存产品名称
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
                conferPrice: priceValueMap[checkinDate].conferPrice, // 结算价
                salePrice: priceValueMap[checkinDate].salePrice, // 零售价
                price: priceValueMap[checkinDate].price // 分销价
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
    width: 550px;
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

  .textSize {
    width: 600px;
  }

  .left {
    float: left;
  }

  .touristInfo-template {
    padding-top: 20px;
    border-top: 1px solid #ddd;
  }

  .addPeople {
    margin-left: -120px;
  }

  .search_text {
    color: #aaa;
    font-size: 14px;
  }

  .list-filter {
    border: 1px solid #ddd;
    padding: 5px;
    background-color: #FCFCFC
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .fontUser {
    font-family: 'Hiragino Sans GB'
  }

  .headStyle {
    color: #008000;
    width: 1200px;
    display: inline-block
  }

  .inputSer {
    width: 240px;
    margin-left: 10px
  }

  .widthTwoFour {
    width: 240px;
  }

  .colorGreen {
    color: #67C23A;
  }

  .colorRed {
    color: #F56C6C
  }

  .tenBottom {
    margin-bottom: 10px
  }

  .tenTop {
    margin-top: 10px
  }

  .addPe {
    margin-top: -10px;
    margin-bottom: 10px;
    padding-left: 1400px
  }

  .leftHun {
    margin-left: -100px
  }

  .widthFourHun {
    width: 400px
  }

  .widthHunPr {
    width: 100%
  }

  .widthHunFive {
    width: 150px
  }

  .TwoRight {
    margin-right: 20px
  }

  .totalRed {
    color: red
  }

  .widthThreeHun {
    width: 300px
  }

  .TwoFontSize {
    font-size: 20px
  }

  .cost {
    padding-right: 100px;
    text-align: right
  }

  .padLeftTwo {
    padding-left: 20px
  }

  .padTwoFiveTwo {
    padding-top: 25px
  }
</style>
<style>
  .num-center .el-form-item__error {
    width: 100%;
  }
</style>
