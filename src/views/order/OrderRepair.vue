<template>
  <!-- 此组件的唯一根节点 -->
  <div class="app-container">
    <el-form ref="orderInfoForm" :rules="rules" :model="orderInfoForm" label-width="120px">
      <div class="title" style="">
        <span style="font-family:'Hiragino Sans GB'"> 请选择分销商</span><span style="color:#008000;width: 1200px; display:inline-block;"></span>
      </div>
      <el-card class="box-card margin-bottom-15">
        <div class="text item">
          <el-form-item prop="hotelId" class="textSize" style="margin-left:-100px">
            <strong>{{$t('hotelOrder.distributor')}}:</strong>
            <el-input style="width:240px;margin-left:10px" size="small" v-model="keyName" :placeholder="$t('hotelOrder.choosingDistributor')"></el-input>
            <el-button type="primary" size="mini" @click="transfer()">{{$t('hotelOrder.choosingDistributor')}}</el-button>
          </el-form-item>
        </div>
      </el-card>

      <div class="title" style="">
        <span style="font-family:'Hiragino Sans GB'">预订信息录入</span><span style="color:#008000;width: 1200px; display:inline-block;"></span>
      </div>
      <el-card class="box-card margin-bottom-15">
        <div class="text item">
          <el-form-item label="入住日期" required>
            <el-row>
              <el-col :span="4">
                <el-form-item  prop="checkinDate">
                  <el-date-picker @change="selectCheckinDate" :editable=false :clearable=false v-model="orderInfoForm.checkinDate" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="离店日期" prop="checkinDate">
                  <el-date-picker @change="selectCheckoutDate" v-model="orderInfoForm.checkoutDate" :editable=false :clearable=false type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <div class="totalNightlabel" >共计：<span style="color: red; ">{{ orderInfoForm.totalNight }}</span> 晚</div>
              </el-col>
              <el-col :span="4" >
                <el-form-item label="最晚到店时间" prop="latestCheckinTime">
                  <!--<el-date-picker v-model="orderInfoForm.latestCheckinTime" :editable=false :clearable=false type="datetime" placeholder="选择日期" ></el-date-picker>-->
                  <el-time-select v-model="orderInfoForm.latestCheckinTime" :editable=false :clearable=false :picker-options="{ start: '07:00', step: '01:00', end: '24:00' }" placeholder="选择时间">
                  </el-time-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="房间数量" prop="num">
            <el-input v-model="orderInfoForm.num" placeholder="请输入房间数量" style="width: 150px" ></el-input>
            <span style="color: #F56C6C;font-family:'Hiragino Sans GB' ">*此数为每天的房间数量</span>
          </el-form-item>
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
        <div class="total" style="padding-top: 20px">
          <div style="padding-right: 100px;text-align: right"><span style="color: #67C23A; ">订单费用总计：</span><span style="color: red">￥{{ orderInfoForm.totalPrice }}</span></div>
        </div>
        <div class="tip">
          <span style="color: #F56C6C;font-family:'Hiragino Sans GB' ">*声明：建议按照统一的建议零售价格进行销售，如果违反规定被查出，将取消分销资格，同时造成的一切后果自负</span>
        </div>
      </el-card>



      <div class="title" style="">
        <span style="font-family:'Hiragino Sans GB'">游客资料录入</span><span style="color:#008000;width: 1200px; display:inline-block;">
        </span>
      </div>
      <el-card class="box-card margin-bottom-15">
        <div class="text item">
          <div style="margin-top: -10px;margin-bottom: 10px;padding-left: 1400px">
            <el-button size="mini" type="primary" @click="delTourist">减一人</el-button>
            <el-button  size="mini" type="primary" @click="addTourist">加一人</el-button>
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
                  <div v-if="item.contactIdType === ''">
                    <el-input v-model="item.contactIdNo" placeholder="请输入证件号码" class="touristInfo-input" :disabled="true" style="width: 400px"></el-input>
                  </div>
                  <div v-else>
                    <el-input v-model="item.contactIdNo" placeholder="请输入证件号码" class="touristInfo-input" style="width: 400px"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-form-item>
          </div>
        </div>
      </el-card>


      <div class="title" style="">
        <span style="font-family:'Hiragino Sans GB'">订单附加信息</span><span style="color:#008000;width: 1200px; display:inline-block;"></span>
      </div>
      <el-card class="box-card margin-bottom-15">
        <div class="text item">
          <el-form-item label="贵司订单号">
            <el-input v-model="orderInfoForm.orderNo" placeholder="请输入贵司订单号" class="touristInfo-input" ></el-input>
            <span style="color: #67C23A; ">便于查询和对账。</span>
          </el-form-item>
          <el-form-item label="公司备注">
            <el-input type="textarea" v-model="orderInfoForm.remark"  placeholder="请输入公司备注" class="touristInfo-input"></el-input>
            <span style="color: #67C23A; "> 录入客人的一些情况和需求（房型备注需要回复确认才有效，否则尽量按备注安排），价格信息备注无效。</span>
          </el-form-item>
        </div>
      </el-card>

      <div style="padding-top: 25px">
        <div >
          <el-button  :plain="true" :round="true"  icon="el-icon-edit" size="mini" type="primary" @click="save('orderInfoForm')">同意预订协议并保存订单</el-button>
          (<span style="color: #F56C6C;font-family:'Hiragino Sans GB'">*此产品为网络限价产品；</span>) (<span style="color: #F56C6C;font-family:'Hiragino Sans GB'">*必须在线支付成功后订单才会生效。</span>)
        </div>
        <hr color="#ddd" size="2">
      </div>
      <editor @getContent="getContent" ref="editor" :h="330" :contenteditable="'false'" :id="'reservationProtocol'" :con="orderInfoForm.content" ></editor>
    </el-form>

    <!-- 转移弹窗 -->
    <el-dialog :title="$t('hotelOrder.choosingDistributor')" style="font-size: 20px" :visible.sync="transferDialogFormVisible" >

      <div class="list-filter" style="margin-bottom: 10px">
        <div style="margin-bottom: 10px;margin-top: 10px">
          <strong>商户所在地: </strong>
          <el-select size="small" class="select" :placeholder="$t('inventoryTransshipment.province')" v-model="queryParam.province">
          </el-select>
          <el-select size="small" class="select" :placeholder="$t('inventoryTransshipment.city')" v-model="queryParam.city">
          </el-select>
          <strong style="padding-left: 20px">商户等级: </strong>
          <el-select size="small" class="select" :placeholder="商户等级" v-model="rankId">
            <el-option
              v-for="item in distributor.rank"
              :key="item.id"
              :label="item.rankName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div style="margin-bottom: 10px">
          <strong>商户关键字: </strong>
          <el-input style="width:240px" size="small" v-model="distributor.nameKey" :placeholder="$t('hotelList.syncKey')"></el-input>
          <span class="search_text" style="margin-right: 20px;">(单位名称、姓名、手机号码、ID、用户登录名)</span>
          <el-button type="primary" size="mini" @click="list">查询</el-button>
        </div>
      </div>

      <el-table :data="distributor.tableData" v-loading="transferLoading" border fit
                highlight-current-row>
        <el-table-column align="center" label='ID' width="95">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.$index"></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="分销商名称">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column label="分销商等级">
          <template slot-scope="scope">
            {{scope.row.rank}}
          </template>
        </el-table-column>
        <el-table-column label="所在区域">
          <template slot-scope="scope">
            {{scope.row.areaId}}
          </template>
        </el-table-column>
        <el-table-column label="联系方式">
          <template slot-scope="scope">
            联系人:{{scope.row.linkMan}}<br>
            联系电话:{{scope.row.phone}}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{scope.row.status}}
          </template>
        </el-table-column>
        <el-table-column label="账户余额">
          <template slot-scope="scope">
            {{scope.row.account}}
          </template>
        </el-table-column>
        <el-table-column label="采购情况">
          <template slot-scope="scope">
            {{scope.row.purchaseNum}}
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页内容 -->
      <div class="pagination-box text-right" style="margin-top:10px;">
        <el-pagination
          @size-change="findonSizeChange"
          @current-change="findonCurrentChange"
          :current-page="distributor.currentPage"
          :page-sizes="[10, 20]"
          :page-size="distributor.resultNum"
          layout="total, sizes, prev, pager, next, jumper"
          :total="distributor.total">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="saveTransfer();transferDialogFormVisible = false">
          {{$t('addProduct.confirm')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Editor from '@/components/Editor'
  import hotelOrder from '@/api/order/hotelOrder'
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
        transferForm: {
          id: '',
          tagName: '',
          tagId: ''
        },
        distributor: {
          tableData: [
            {
              id: '1',
              name: 'Terry旅行社',
              phone: '18830987627',
              areaId: '1300',
              account: '8000',
              linkMan: 'Terry',
              rank: '1',
              purchaseNum: '6',
              status: '正常'
            },
            {
              id: '2',
              name: 'Ailey旅行社',
              phone: '18830987333',
              areaId: '1200',
              account: '5000',
              linkMan: 'Ailey',
              rank: '2',
              purchaseNum: '8',
              status: '正常'
            },
            {
              id: '3',
              name: 'Vivi旅行社',
              phone: '18430382627',
              areaId: '1900',
              account: '1000',
              linkMan: 'Vivi',
              rank: '3',
              purchaseNum: '10',
              status: '停用'
            }
          ],
          nameKey: '',
          rank: [
            { 'id': 1, 'rankName': 'OTA' },
            { 'id': 2, 'rankName': '代理商' },
            { 'id': 3, 'rankName': '享度店铺' },
            { 'id': 4, 'rankName': 'JTR' },
            { 'id': 5, 'rankName': '广东南湖国际旅行社有限责任公司(商旅部)' }
          ],
          total: 100,
          resultNum: 10,
          currentPage: 1
        },
        queryParam: {
          /* 保存开始日期结束日期的array */
          date: [],
          province: '',
          city: '',
          productType: '',
          /* 分页当前第几页 */
          currentPage: 1,
          /* 分页每页页数 */
          pageSize: 10,
          total: 0
        },
        // 表单数据
        orderInfoForm: {
          num: 1, // 每天的房间数量
          tableData: [
            {
              checkinDate: '2018-03-29',
              num: 1,
              retailPrice: 199,
              settlementPrice: 199,
              settlementAmount: 199,
              salesProfit: 199
            },
            {
              checkinDate: '2018-03-29',
              num: 1,
              retailPrice: 199,
              settlementPrice: 199,
              settlementAmount: 199,
              salesProfit: 199
            }
          ],
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
          roomTypeName: '七天酒店豪华大床房',

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
            { validator: function(rule, value, callback) {
              if (/^1[34578]\d{9}$/.test(value) === false) {
                callback(new Error('请输入正确的手机号'))
              } else {
                callback()
              }
            }, trigger: 'blur' }
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
    created() {},
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
            const addOrderForm = {
              productId: this.orderInfoForm.productId, // 产品编号
              checkinDate: this.orderInfoForm.checkinDate, // 入住日期
              checkoutDate: this.orderInfoForm.checkoutDate, // 离店日期
              hotelOrderPeople: this.orderInfoForm.touristInfos, // 游客信息list
              totalNight: this.orderInfoForm.totalNight, // 住的总晚数
              supplierOrderId: this.orderInfoForm.orderNo, // 贵司单号 -- 供应商订单号
              orderMemo: this.orderInfoForm.remark, // 贵司备注
              dateAndNums: this.orderInfoForm.num // 每晚的房间数量--每晚数量必须一样
            }
            hotelOrder.addOrder(addOrderForm).then(res => {
              if (res && res.state === 'success') {
                this.$message({
                  type: 'success',
                  message: '下单成功'
                })
              } else {
                this.$message.error(res)
                return false
              }
            }).catch(e => {
              this.$message.error('下单失败')
            })
          }
        })
      },
      // 添加游客
      addTourist() {
        const tourist = {
          name: '',
          mobile: '',
          idType: '',
          number: '',
          nationality: '',
          age: ''
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
        console.log('name_1: ' + this.orderInfoForm.touristInfos[0].name + '--' + 'name_2: ')
      },
      onSubmit() {
        console.log('submit!')
      },
      // 获取所有
      list() {
        // const params = {
        //   page: this.currentPage,
        //   resultNum: this.resultNum,
        //   name: this.nameKey
        // }
        // this.tableLoading = true
        // AreaInfo.list(params).then(res => {
        //   if (res.results && res.results.length) {
        //     this.tableData = res.results
        //     this.total = res.sizeAll
        //   }
        //   this.tableLoading = false
        // })
      },
      // 确认保存操作
      /* save(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const type = this.dialogType
            let data = this.areaForm
            if (type === 'add') {
              AreaInfo.save(data).then(res => {
                if (res.id) {
                  this.$message({
                    message: '添加成功！',
                    type: 'success',
                    duration: 1000,
                    onClose: res => {
                      this.list()
                    }
                  })
                } else {
                  this.$message({
                    message: '添加失败！',
                    type: 'error'
                  })
                }
              })
            } else {
              data = {
                ...this.areaForm,
                id: this.areaForm.id
              }
              AreaInfo.update(data).then(res => {
                if (res === 1) {
                  this.$message({
                    message: '修改成功！',
                    type: 'success',
                    duration: 1000,
                    onClose: res => {
                      this.list()
                    }
                  })
                } else {
                  this.$message({
                    message: '修改失败！',
                    type: 'error'
                  })
                }
              })
            }
            this.dialogFormVisible = false
          }
        })
      },*/
      // 打开转移主题弹出框
      transfer() {
        this.transferDialogFormVisible = true
        this.transferLoading = false
      },
      saveTransfer() {
        this.keyName = this.distributor.tableData[this.radio].name
        console.log(this.distributor.tableData[this.radio].name)
      },
      findonSizeChange(val) {
        this.distributor.resultNum = val
      },
      findonCurrentChange(val) {
        this.distributor.currentPage = val
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
  .search_text{
    color:#aaa;
    font-size:14px;
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
</style>
<style>
  .num-center .el-form-item__error {
    width: 100%;
  }
</style>

