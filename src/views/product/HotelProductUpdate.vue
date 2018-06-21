<template>
  <div class="app-container consistent-color">
      <el-form :model="hotelProductForm" ref="hotelProductForm" :rules="rules" label-width="70px" label-position="left">
        <!--客房基本信息-->
        <div>
          <header class="block-title">{{ $t('addProduct.basicInfo') }}</header>
        </div>
        <el-row>
          <!--产品标签-->
          <el-col :span="12">
            <el-form-item label="产品标签" prop="productTag" >
              <el-input disabled style="width: 40%;" v-model="hotelProductForm.productTag" :placeholder="$t('addHotelProduct.prompt')" size="small"></el-input>
              <!--<br>
              <span class="p1">{{$t('addProduct.productNameHint')}}</span>-->
            </el-form-item>
          </el-col>
          <!--供应商-->
          <el-col :span="12" v-if="userInfo.custType=='3' && showSupplier">
            <el-form-item  :label="$t('addProduct.supplier')" prop="supplierMchId" >
              <select-supplier :disabled=true @getSupplier="getSupplier" :initSupplier.sync="hotelProductForm.supplierMchId" :width="'150'" ref="accommodationSupplier"></select-supplier>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!--房型-->
          <el-col :span="12">
            <el-form-item :label="$t('addProduct.roomType')" prop="roomId" >
              <el-select disabled v-model="hotelProductForm.roomId" @change="changeRoomType(hotelProductForm.roomId)" size="small"
                         filterable remote :remote-method="queryRoomList"
                         :placeholder="$t('addProduct.pleaseSelect',{name:''})">
                <el-option
                  v-for="item in roomsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!--<el-input size="small" v-model="roomKey" :placeholder="$t('addHotelProduct.prompt')"-->
                        <!--@keyup.enter.native="queryRoomList" style="width:250px;"></el-input>-->
              <!--<el-button class="queryButton" type="primary" @click="queryRoomList" size="small">{{$t('addHotelProduct.queryRoom')}}</el-button>-->
            </el-form-item>
          </el-col>
          <!--床型-->
          <el-col :span="12">
            <el-form-item :label="$t('addProduct.bedType')" prop="bedType" >
              <el-select disabled v-model="hotelProductForm.bedType" size="small"
                         :placeholder="$t('addProduct.pleaseSelect',{name:''})">
                <el-option
                  v-for="item in bedOptionsArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <!--早餐-->
          <el-col :span="12">
            <el-form-item :label="$t('addProduct.breakfast')" prop="breakfastNum" >
              <el-select v-model="hotelProductForm.breakfastNum" size="small"
                         :placeholder="$t('addProduct.pleaseSelect',{name:''})">
                <el-option
                  v-for="item in breakfastOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!--酒店所在地区-->
          <el-col :span=24 >
            <el-form-item label="地区">
              <select-area @getAreaId="getAreaId" ref="selectArea" :readOnly="true" ></select-area>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form :model="hotelProductForm" ref="hotelProductForm" :rules="rules" label-width="110px" label-position="left">
        <!--预订设置-->
        <el-row>
          <header class="block-title">{{ $t('addProduct.reservationSettings') }}</header>
        </el-row>
        <!--提前预订时间要求-->
        <el-row>
            <el-col :span="11">
              <el-form-item :label="$t('addProduct.scheduleTimeRestriction')" >
                    {{$t('hotelProductPlanType.minAdvMinutes')}}
                    <el-input-number v-model="hotelProductForm.minAdvDays" class="el-input-number-mini" controls-position="right" auto-complete="off" :min="0" size="mini"></el-input-number>
                    &nbsp;&nbsp;{{$t('hotelProductPlanType.dayUnit')}} &nbsp;&nbsp;
                    <el-input-number v-model="hotelProductForm.minAdvHours" class="el-input-number-mini" controls-position="right" auto-complete="off" :min="0" :max="24" size="mini"></el-input-number>
                    &nbsp;&nbsp;{{$t('hotelProductPlan.clock')}} &nbsp;&nbsp;
                    <el-input-number v-model="hotelProductForm.minAdvMinutes2" class="el-input-number-mini" controls-position="right" auto-complete="off" :min="0" :max="59" size="mini"></el-input-number>
                    &nbsp;&nbsp;{{$t('hotelProductPlanType.minuteUnit')}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('hotelProductPlanType.maxAdvMinutes')">
                <el-input-number v-model="hotelProductForm.maxAdvDays" class="el-input-number-mini" controls-position="right" auto-complete="off" :min="0" size="mini"></el-input-number>
                &nbsp;&nbsp;{{$t('hotelProductPlanType.dayUnit')}} &nbsp;&nbsp;
                <el-input-number v-model="hotelProductForm.maxAdvHours" class="el-input-number-mini" controls-position="right" auto-complete="off" :min="0" :max="24" size="mini"></el-input-number>
                &nbsp;&nbsp;{{$t('hotelProductPlan.clock')}} &nbsp;&nbsp;
                <el-input-number v-model="hotelProductForm.maxAdvMinutes2" class="el-input-number-mini" controls-position="right" auto-complete="off" :min="0" :max="59" size="mini"></el-input-number>
                &nbsp;&nbsp;{{$t('hotelProductPlanType.minuteUnit')}}
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <!--入住天数要求-->
          <el-col :span="11">
            <el-form-item label="入住天数要求"  >
              <el-row>
                <el-col :span="8">
                  {{$t('hotelProductPlanType.minDays')}}
                  <el-input-number v-model="hotelProductForm.minDays" class="el-input-number-mini" controls-position="right" auto-complete="off" :min="0" size="mini"></el-input-number>
                  &nbsp;&nbsp;{{$t('hotelProductPlanType.dayUnit')}}
                </el-col>
                <el-col :span="12">
                  {{$t('hotelProductPlanType.maxDays')}}
                  <el-input-number v-model="hotelProductForm.maxDays" class="el-input-number-mini" controls-position="right" auto-complete="off" :min="0" size="mini"></el-input-number>
                  &nbsp;&nbsp;{{$t('hotelProductPlanType.dayUnit')}}
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <!--预订房间数量限制-->
          <el-col :span="12">
            <el-form-item label="预订房间数量限制">
              <el-row>
                <el-col :span="8">
                  {{$t('hotelProductPlanType.minRoomNum')}}
                  <el-input-number v-model="hotelProductForm.minRoomNum" class="el-input-number-mini" controls-position="right" auto-complete="off" :min="0" size="mini"></el-input-number>
                  &nbsp;&nbsp;{{$t('hotelProductPlanType.dayUnit')}}
                </el-col>
                <el-col :span="12">
                  {{$t('hotelProductPlanType.maxRoomNum')}}
                  <el-input-number v-model="hotelProductForm.maxRoomNum" class="el-input-number-mini" controls-position="right" auto-complete="off" :min="0" size="mini"></el-input-number>
                  &nbsp;&nbsp;{{$t('hotelProductPlanType.dayUnit')}}
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span=11>
            <el-form-item label="每日销售时间">
              <el-time-picker
                size="small"
                placeholder="起始时间"
                v-model="hotelProductForm.dayStartTime"
                :picker-options="{selectableRange:'00:00:00 - 23:59:59'}">
              </el-time-picker>
              <el-time-picker
                size="small"
                placeholder="结束时间"
                v-model="hotelProductForm.dayEndTime"
                :picker-options="{selectableRange:'00:00:00 - 23:59:59',minTime: hotelProductForm.dayStartTime}">
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <el-form-item label="客户到店时间">
              <el-time-picker
                size="small"
                placeholder="起始时间"
                v-model="hotelProductForm.arrivalStartTime"
                :picker-options="{selectableRange:'00:00:00 - 23:59:59'}">
              </el-time-picker>
              <el-time-picker
                size="small"
                format='HH:mm:ss'
                placeholder="结束时间"
                v-model="hotelProductForm.arrivalEndTime"
                :picker-options="{selectableRange:'00:00:00 - 23:59:59',minTime: hotelProductForm.arrivalStartTime}">
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <!--预售时间-->
          <el-col :span=11 >
            <el-form-item :label="$t('addProduct.launchTime')">
              <el-date-picker
                v-model="hotelProductForm.dateTimeRange"
                size="small"
                type="daterange"
                :placeholder="$t('addProduct.pleaseSelect',{name:$t('addProduct.dateRange')})">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!--是否允许超卖-->
          <el-col :span=12>
            <el-form-item :label="$t('addProduct.oversoldSettings')" prop="allowOversold">
              <el-radio-group v-model="hotelProductForm.allowOversold">
                <el-radio :label=1 style="margin-bottom:5px;">{{$t('addProduct.allowOversold')}}</el-radio><br>
                <el-radio :label=0>{{$t('addProduct.OversoldNotAllowed')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <!--销售范围-->
          <el-col :span=11>
            <el-form-item :label="$t('addProduct.salesScope')" prop="saleRange">
              <el-select v-model="hotelProductForm.saleRange" size="small"
                         :placeholder="$t('addProduct.pleaseSelect',{name:''})">
                <el-option
                  v-for="item in scopes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--退改申请设置-->
          <el-col :span="6">
            <el-form-item :label="$t('addProduct.backApplication')" prop="cancelPolicy">
              <el-select v-model="hotelProductForm.cancelPolicy" size="small" :placeholder="$t('addProduct.pleaseSelect',{name:''})">
                <el-option :label="$t('addProduct.allowRefund')" :value=1></el-option>
                <el-option :label="$t('addProduct.notAllowRefund')" :value=-1></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!--取消提前分钟数限制-->
            <el-form-item label="取消提前分钟数限制" prop="aheadCancelMinutes" v-if="hotelProductForm.cancelPolicy == 1">
              <el-input-number v-model="hotelProductForm.cancelAdvMinutes" class="el-input-number-mini" controls-position="right" auto-complete="off" :min="0" size="mini"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <!--计调设置-->
        <el-row>
          <header class="block-title">{{ $t('addProduct.controlSettings') }}</header>
        </el-row>
        <el-row>
          <!--通知单生成控制-->
          <el-col :span="11">
            <el-form-item :label="$t('addProduct.notification')" ><!--prop="hotelProductForm.sendNotifyType"-->
                <td style="padding:5px 10px;">
                  <el-radio-group v-model="hotelProductForm.sendNotifyType">
                    <el-radio :label=0>{{$t('addProduct.notificationThatDay')}}</el-radio>
                    <br>
                    <el-radio :label=1>
                      {{$t('addProduct.notificationBefore')}}
                      <el-select v-model="baseTableData.noticeDays" size="small" :placeholder="$t('addProduct.pleaseSelect',{name:''})" style="width:125px;">
                        <el-option :label="$t('addProduct.thatDay')" :value="0"></el-option>
                        <el-option
                          v-for="item in 20"
                          :key="item"
                          :label="item +' '+ $tc('addProduct.day',item)"
                          :value="item">
                        </el-option>
                      </el-select>
                      {{baseTableData.noticeDays !== 0?$t('addProduct.aheadOf'):''}} {{$t('addProduct.notificationGen')}}
                    </el-radio>
                    <br>
                    <el-radio :label=2>{{$t('addProduct.notificationAfter')}}<br>(<span style="color:green;">{{$t('addProduct.automaticTip')}}</span>)</el-radio>
                  </el-radio-group>
                </td>
            </el-form-item>
          </el-col>
          <!--是否发送短信-->
          <el-col :span="12">
            <el-form-item :label="$t('addProduct.isSendSms')" prop="isSendSms">
              <el-radio-group v-model="hotelProductForm.isSendSms">
                <el-radio :label=1>{{$t('addProduct.sendMsg')}}</el-radio>
                <el-radio :label=0>{{$t('addProduct.noNeed')}}</el-radio>
              </el-radio-group>
              <el-collapse-transition>
                <div v-show="hotelProductForm.isSendSms=='1'">
                  <el-input type="textarea" autosize :placeholder="$t('addProduct.reserveSuccessfulTip')" v-model="hotelProductForm.sendSmsContent"></el-input>
                  <el-collapse style="margin-top:5px;margin-bottom:5px;">
                    <el-collapse-item :title="$t('addProduct.codeMeaning')">
                      <el-row>
                        <el-col :span="6">$code${{$t('addProduct.orderId')}}</el-col>
                        <el-col :span="6">$num${{$t('addProduct.totalNights')}}</el-col>
                        <el-col :span="6">$dnum${{$t('addProduct.roomNum')}}</el-col>
                        <el-col :span="6">$nnum${{$t('addProduct.nightNum')}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6">$day${{$t('addProduct.arrivalDate')}}</el-col>
                        <el-col :span="6">$endday${{$t('addProduct.departureDate')}}</el-col>
                        <el-col :span="6">$breaker${{$t('addProduct.breakfast')}}</el-col>
                        <el-col :span="6">$name${{$t('addProduct.touristName')}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6">$phone${{$t('addProduct.touristPhone')}}</el-col>
                        <el-col :span="6">$price${{$t('addProduct.retailPrice')}}</el-col>
                        <el-col :span="6">$title${{$t('addProduct.productName')}}</el-col>
                        <el-col :span="6">$cond${{$t('addProduct.valueAdded')}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6">$hoteladdress${{$t('addProduct.hotelAddress')}}</el-col>
                        <el-col :span="6">$hotelphone${{$t('addProduct.hotelPhone')}}</el-col>
                        <el-col :span="6"></el-col>
                        <el-col :span="6"></el-col>
                      </el-row>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-collapse-transition>
            </el-form-item>
          </el-col>
        </el-row>

        <!--预订说明-->
        <el-row>
          <el-col :span="24">
            <header class="block-title">{{$t('addProduct.bookingInst')}}</header>
            <editor :h="320" @getContent="getbookingInfoContent" :id="'reserveIntro'" ref="reserveIntro" :con="hotelProductForm.bookingInfo" style="z-index: 0"></editor>
          </el-col>
        </el-row>
      </el-form>

      <el-row>
        <div class="margin-bottom-15">
          <header class="block-title">{{$t('addProduct.proDes')}}（包含的服务，注意事项）</header>
          <editor :h="350" :id="'proDesc'" @getContent="getContent" ref="proDesc" :con="hotelProductForm.productInfo" style="z-index: 0"></editor>
        </div>
      </el-row>
      <div class="padding-15">
        <div class="text-center" style="padding-bottom:32px;">
          <el-button type="primary" size="small" @click="save('hotelProductForm')">{{$t('addProduct.saveUpdate')}}</el-button>
        </div>
      </div>
  </div>

</template>
<script>
  import SelectArea from '@/views/product/common/SelectArea'
  import SelectSupplier from '@/views/product/common/SelectSupplier'
  import hotelRoomInfo from '@/api/product/hotelRoomInfo'
  import Editor from '@/components/Editor'
  import hotelProduct from '@/api/product/hotelProduct'
  import enumApi from '@/api/openapi/enumApi'
  export default {
    name: 'UpdateHotelProduct',
    components: {
      SelectSupplier, Editor, SelectArea
    },
    data() {
      return {
        defaultTime: [],
        // initAreaId: this.$route.query.areaId, // 用于初始化地区控件
        hotelProductForm: {
          dayStartTime: '',
          dayEndTime: '',
          arrivalStartTime: '',
          arrivalEndTime: '',
          // 是否发送短信
          isSendSms: 0,
          // 短信内容
          sendSmsContent: '',
          // 销售范围
          saleRange: 1,
          // 退改申请设置
          cancelPolicy: 1,
          // 生成通知单类型
          sendNotifyType: 0,
          // 是否允许超卖
          allowOversold: 0,
          minAdvMinutes: '0', // 总分钟数 -最小
          minAdvDays: '0', // 天 -最小
          minAdvHours: '0', // 小时 -最小
          minAdvMinutes2: '0', // 分钟 -最小
          maxAdvMinutes: '0', // 总分钟数 -最大
          maxAdvDays: '0', // 天 -最大
          maxAdvHours: '0', // 小时 -最大
          maxAdvMinutes2: '0', // 分钟 -最大
          saleStartDate: '', // 产品开售时间
          saleStopDate: '', // 产品停售时间
          bedType: '', // 床型 (name)
          dateTimeRange: [], // 预售时间范围
          id: '',
          // productName: '',
          productTag: '', // 产品标签
          bookingInfo: '',
          // productShortName: '',
          productInfo: '',
          zoneId: '',
          hotelId: '',
          hotelName: '',
          roomId: '',
          cancelPolicyDesc: '',
          confirmType: '',
          earliestBookingDays: '',
          earliestBookingHourss: '',
          latestBookingDays: '',
          latestBookingHourss: '',
          breakfastNum: '',
          lunchNum: '',
          dinnerNum: '',
          serialCheckinMin: '',
          serialCheckinMax: '',
          roomCountMin: '',
          roomCountMax: '',
          moveupCancelDays: '',
          moveupCancelHours: '',
          guestType: '',
          supplierId: '',
          supplierProductId: '',
          state: '',
          createDate: '',
          modifyDate: '',
          supplierMchId: '',
          // areaId: this.$route.query.areaId,
          img: ''
        },
        hotelProductTagAssociationForm: [
          {
            id: '',
            tagId: '',
            productId: '',
            createDate: '',
            modifyDate: '',
            state: ''
          }
        ],
        areaInfoForm: {
          id: '',
          areaName: '',
          areaCode: '',
          spell: '',
          shortSpell: '',
          parentId: '',
          areaDesc: '',
          geoLat: '',
          geoLng: '',
          geoHash: '',
          createDate: '',
          modifyDate: '',
          state: ''
        },
        hotelRoomInfoForm: {
          id: '',
          hotelId: '',
          areaId: '',
          name: '',
          nameEn: '',
          infoRoom: '',
          bedType: '',
          roomNum: '',
          adultsNum: '',
          childrenNum: '',
          childAge: '',
          bedNum: '',
          bedSize: '',
          bedName: '',
          bedDesc: '',
          allowAddbed: '',
          occupancyPerRoom: '',
          floor: '',
          notAllowSmoking: '',
          hasWindow: '',
          hasInternet: '',
          areaRange: '',
          facilities: '',
          remark: '',
          wifi: '',
          state: '',
          imageUrl: '',
          createDate: '',
          modifyDate: ''
        },
        productId: this.$route.query.productId,
        hotelId: this.$route.query.hotelId || -1,
        purchaseType: '0',
        room: '',
        currentHotel: '',
        hotelKey: '',
        roomKey: '',
        hotelList: [],
        roomSettingsLoading: false,
        roomSettingsData: [],
        showSupplier: true,
        ids: [], // this.$route.query.roomList,
        roomsOptions: [],
        bedOptionsArr: [],
        breakfastOptions: [],
        starOptions: this.GLOBAL.HotelStarList,
        userInfo: {
          custType: 3,
          roleId: 9
        },
        imgList: [],
        img: '',
        idTypes: [{
          value: '0',
          label: '订单'
        }, {
          value: '1',
          label: '手机号码'
        }, {
          value: '2',
          label: '身份证号码'
        }, {
          value: '3',
          label: 'IP地址'
        }, {
          value: '4',
          label: '分销商ID'
        }, {
          value: '5',
          label: '会员ID(C端)'
        }],
        depositModes: [{
          value: '0',
          label: '在线按产品总价的百分比支付'
        }, {
          value: '1',
          label: '在线指定金额支付'
        }],
        scopes: [{
          value: 0,
          label: '全部'
        }, {
          value: 1,
          label: '对同行和直客'
        }, {
          value: 2,
          label: '只对同行销售'
        }, {
          value: 3,
          label: '只对直客销售'
        }],
        baseTableData: {
          retailLimit: '0',
          saleScope: '3',
          idType: 0,
          numLimit: 0,
          isAllowed: '0',
          confirmWay: 0,
          noticeControl: '0',
          noticeDays: 1,
          applyBack: '1',
          depositMode: 0,
          deposit: '100',
          refund: ['0'],
          isAllowedSend: '0',
          noticeIsAllowedSend: '0',
          ack: '0',
          ackIsSend: '0',
          autoComplete: '0',
          encoding: '',
          // encodingType: '',
          isAllowTransshipment: '1',
          payMethod: 1,
          validityControl: '0',
          automaticCancel: 1440,
          guestInfo: '0',
          requiredInfo: ['link_man', 'link_phone'],
          applyPrice: '0',
          delivery: '0',
          undone: '0',
          deliveryMethod: [],
          deliveryCost: '',
          immediatePayment: '',
          consecutiveNights: 1,
          dateRange: [],
          isSendDate: '0',
          isSendTime: '24:00',
          proEncoding: '',
          noticeMsg: '',
          ackMsg: '',
          successMsg: '',
          innerNotes: '',
          notes: '',
          delayDays: '',
          endDate: '',
          timeLimit: '24:00'
        },
        // encodingTypes: [],
        encodingOptions: [],
        name: '名字',
        currentSupplier: 0,
        refundDataBefore: [],
        refundDataAfter: [],
        definedInputVisible: false,
        requiredTableData: [],
        interfaceOptions: [],
        distributionRefundOptions: [{
          value: '0',
          label: '固定价格'
        }, {
          value: '#order_money#-',
          label: '分销总金额 -'
        }, {
          value: '#order_money#*',
          label: '分销总金额 *'
        }, {
          value: '#price#-',
          label: '分销单价 -'
        }, {
          value: '#price#*',
          label: '分销单价 *'
        }],
        supplierRefundOptions: [{
          value: '0',
          label: '固定价格'
        }, {
          value: '#account_money#-',
          label: '采购总金额 -'
        }, {
          value: '#account_money#*',
          label: '采购总金额 *'
        }, {
          value: '#confer_price#-',
          label: '采购单价 -'
        }, {
          value: '#confer_price#*',
          label: '采购单价 *'
        }],
        rules: {
          notNull: [
            { required: true, message: this.$t('common.isNull'), trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.$refs['selectArea'].getForRead(this.$route.query.areaId)
      this.initData()
    },
    methods: {
      // 地区组件值变化的时候进行回调获取
      getAreaId(val) {
        // if (val.id) {
        //   this.hotelProductForm.areaId = val.id
        // } else {
        //   this.hotelProductForm.areaId = '0'
        // }
      },
      // 验证预订时付款输入
      validatePercentDeposit(event) {},
      // 折叠之后增加相应数据清除
      getCheckList(val) {},
      // 自定义输入项
      definedInputEvent() {
        this.definedInputVisible = !this.definedInputVisible
        // 隐藏之后清空数据
        if (!this.definedInputVisible) {
          this.requiredTableData = []
        }
      },
      // 增加自定义输入项
      addDefinedInput() {
        this.requiredTableData.push({
          name: '',
          dataType: 'dchar',
          isAllowedEmpty: '0',
          writeScope: '0',
          instruction: ''
        })
      },
      // 删除自定义输入项
      delDefinedInput(index) {
        this.requiredTableData.splice(index, 1)
      },
      // 增加退款规则
      addRefundRule(type) {
        if (type === 'Before') {
          this.refundDataBefore.push({
            day: 0, // 数字
            hour: '24:00',
            distributionRefund: '',
            supplierRefund: '',
            distributionSelect: '0',
            supplierSelect: '0'
          })
        } else if (type === 'After') {
          this.refundDataAfter.push({
            day: '-1', // 拼接之后的字符串
            hour: '24:00',
            distributionRefund: '',
            supplierRefund: '',
            distributionSelect: '0',
            supplierSelect: '0'
          })
        }
      },
      // 删除规则
      delRefundRule(index, type) {
        this['refundData' + type].splice(index, 1)
      },
      // 初始化数据
      initData() {
        // 查询酒店产品的详细信息
        if (this.productId) {
          hotelProduct.load(this.productId).then(res => {
            this.hotelProductForm = res.hotelProduct
            this.hotelInfo = res.hotelInfo // 暂存酒店信息
            // 获取开售/停售日期
            this.hotelProductForm.dateTimeRange = [res.hotelProduct.saleStartDate, res.hotelProduct.saleStopDate]
            if (res.hotelProduct.dayStartTime) {
              this.hotelProductForm.dayStartTime = new Date(res.hotelProduct.dayStartTime)
            }
            if (res.hotelProduct.dayEndTime) {
              this.hotelProductForm.dayEndTime = new Date(res.hotelProduct.dayEndTime)
            }

            if (res.hotelProduct.arrivalStartTime) {
              this.hotelProductForm.arrivalStartTime = new Date(res.hotelProduct.arrivalStartTime)
            }
            if (res.hotelProduct.arrivalEndTime) {
              this.hotelProductForm.arrivalEndTime = new Date(res.hotelProduct.arrivalEndTime)
            }
            // 最小提前预订时间
            const minTime = this.minute2DHM(this.hotelProductForm.minAdvMinutes)
            this.hotelProductForm.minAdvDays = minTime.days
            this.hotelProductForm.minAdvHours = minTime.hours
            this.hotelProductForm.minAdvMinutes2 = minTime.minutes
            // 最大提前预订时间
            const maxTime = this.minute2DHM(this.hotelProductForm.maxAdvMinutes)
            this.hotelProductForm.maxAdvDays = maxTime.days
            this.hotelProductForm.maxAdvHours = maxTime.hours
            this.hotelProductForm.maxAdvMinutes2 = maxTime.minutes

            this.hotelId = res.hotelProduct.hotelId
            this.hotelProductTagAssociationForm = res.hotelProductTagAssociation
            this.areaInfoForm = res.areaInfo
            this.hotelRoomInfoForm = res.hotelRoomInfo
            if (this.hotelRoomInfoForm && this.hotelRoomInfoForm.bedType) {
              const bedOptionsArrTemp = this.hotelRoomInfoForm.bedType.split(',')
              for (let i = 0; i < bedOptionsArrTemp.length; i++) {
                const ele = {
                  value: bedOptionsArrTemp[i],
                  label: bedOptionsArrTemp[i]
                }
                this.bedOptionsArr.push(ele)
              }
            }
            const _this = this
            const imgList = []
            if (this.hotelProductForm.signImg && this.hotelProductForm.signImg.split(','.length)) {
              this.hotelProductForm.signImg.split(',').forEach(function(value, index) {
                imgList.push({
                  value: index,
                  label: value
                })
                _this.img = value
              })
            }
            this.imgList = imgList
          })
        }
        // 查询酒店所有房型
        hotelRoomInfo.listForSelect(this.hotelId, '').then(res => {
          const arr = []
          const results = res.results
          if (results && results.length) {
            for (let i = 0; i < results.length; i++) {
              const ele = {
                value: results[i].id,
                label: results[i].roomName
              }
              arr.push(ele)
            }
            this.roomsOptions = arr
          }
        })
        const _this = this
        const initRoomSettingTable = this.ids.map((ele, idx) => {
          return {
            room: ele.id,
            bed: '',
            breakfast: null,
            star: _this.currentHotelStar,
            purchaseType: '0',
            guestType: '',
            bedOptions: ''
          }
        })
        this.roomSettingsData = initRoomSettingTable
        // 获取早餐
        enumApi.breakfastList().then(res => {
          this.breakfastOptions = res
        })
      },
      // 改变房型
      changeRoomType(val, row) {
        if (this.roomsOptions && this.roomsOptions.length > 0) {
          this.roomsOptions.forEach(row => {
            if (row.value === val) {
              this.hotelProductForm.roomName = row.label
            }
          })
        }
      },
      // 删除房型
      deleteRoomType(index) {
        this.roomSettingsData.splice(index, 1)
      },
      // 获取编码下拉
      getEncode() {
      },
      // 获取二级编码
      changeEncode() {
      },
      // 酒店修改
      changeHotel() {
      },
      // 搜索酒店列表信息
      queryHotelList() {
      },
      // 搜索房型列表信息
      queryRoomList(keyWord) {
        // 查询酒店所有房型
        hotelRoomInfo.listForSelect(this.hotelId, keyWord).then(res => {
          const arr = []
          this.hotelProductForm.roomId = ''
          const results = res.results
          if (results && results.length) {
            for (let i = 0; i < results.length; i++) {
              const ele = {
                value: results[i].id,
                label: results[i].roomName
              }
              arr.push(ele)
            }
            this.roomsOptions = arr
          }
        })
      },
      // 供应商组件值变化的时候进行回调获取
      getSupplier(val) {
        this.currentSupplier = val.id
      },
      // 保存前校验
      verify() {
      },
      // 获取文本内容
      getContent(obj) {
        this.hotelProductForm.productInfo = obj.html
      },
      // 获取预订说明
      getbookingInfoContent(obj) {
        this.hotelProductForm.bookingInfo = obj.html
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
      // 将天、时、分转成分钟数
      DHM2Minute(d, h, m) {
        return d * (24 * 60) + h * 60 + m
      },
      // 保存修改
      save(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            const _this = this
            if (this.currentSupplier !== 0) {
              this.hotelProductForm.supplierMchId = this.currentSupplier
            }
            // 最小
            this.hotelProductForm.minAdvMinutes = this.DHM2Minute(this.hotelProductForm.minAdvDays, this.hotelProductForm.minAdvHours, this.hotelProductForm.minAdvMinutes2)
            // 最大
            this.hotelProductForm.maxAdvMinutes = this.DHM2Minute(this.hotelProductForm.maxAdvDays, this.hotelProductForm.maxAdvHours, this.hotelProductForm.maxAdvMinutes2)
            // 获取开售/停售日期
            this.hotelProductForm.saleStartDate = this.hotelProductForm.dateTimeRange[0] || ''
            this.hotelProductForm.saleStopDate = this.hotelProductForm.dateTimeRange[1] || ''

            // 补充酒店信息到产品表 -- 每次修改都将这些字段更新为酒店对应的字段
            this.hotelProductForm.areaId0 = this.hotelInfo.areaId0
            this.hotelProductForm.areaId1 = this.hotelInfo.areaId1
            this.hotelProductForm.areaId2 = this.hotelInfo.areaId2
            this.hotelProductForm.areaId3 = this.hotelInfo.areaId3
            this.hotelProductForm.hotelName = this.hotelInfo.hotelName
            this.hotelProductForm.hotelStar = this.hotelInfo.hotelStar

            // 值提交产品信息
            const params = {
              hotelProduct: this.hotelProductForm
              // areaInfo: this.areaInfoForm,
              // hotelRoomInfo: this.hotelRoomInfoForm
            }
            hotelProduct.update(params).then(res => {
              if (res && res.state === 'success') {
                this.$message({
                  type: 'success',
                  showClose: true,
                  message: '保存成功',
                  onClose() {
                    _this.$router.push({
                      path: '/product/hotelProducts/list'
                    })
                  }
                })
              } else {
                this.$message({
                  type: 'error',
                  showClose: true,
                  message: '保存失败'
                })
              }
            })
          }
        })
      }
    }
  }
</script>
<style>
  .self-table{
    width: 100%;
    border-collapse: separate;
    border-spacing: 0px;
    border-color: grey;
    border-right:1px solid #dfe6ec;
    border-bottom:1px solid #dfe6ec;
    font-size: 14px;
    color: #606266;
  }
  .self-table thead th,.self-table tbody td:nth-child(1){
    border-right:0;
    border-bottom:0;
    text-align: right;
    height: 40px;
    padding: 0 10px 10px 0;
    min-width: 0;
    text-overflow: ellipsis;
    vertical-align: middle;
    empty-cells: show;
  }
  .self-table thead th{
    background-color: #eef1f6;
    font-size: 14px;
  }
  .addtr{
    border:1px solid #dfe6ec;
    border-top:0;
    text-align:center;
    padding:5px 0;
    font-size:0;
  }
  .addtr .el-icon-plus{
    font-size:20px;
    color:#dfe6ec;
    border:1px solid #dfe6ec;
    border-radius:50%;
    padding:5px;
  }
  .refundTable .el-table__empty-block{
    display: none;
  }

  .el-input-number-mini {
    width: 100px;
  }
  .consistent-color {
    color:#606266;
  }
  .self-table thead th, .self-table tbody td {
    border: 1px solid #dfe6ec;
    border-right: 0;
    border-bottom: 0;
    text-align: left;
    height: 40px;
    padding: 0 10px;
    min-width: 0;
    text-overflow: ellipsis;
    vertical-align: middle;
    empty-cells: show;
  }
</style>
