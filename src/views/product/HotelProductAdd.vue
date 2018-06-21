<template>
  <el-main>
    <el-row>
      <header class="block-title">酒店信息</header>
    </el-row>
    <el-row>
      <el-col :span="12">
        <!--酒店名称-->
        {{$t('addHotelProduct.correspondingHotel')}}
        <el-input size="small" v-model="formData.hotelName" style="width:300px;" :disabled="true"></el-input>
      </el-col>
      <el-col :span="12">
        <!--酒店地区-->
        <select-area @getAreaId="getAreaId" ref="selectArea" :readOnly="true"></select-area><!--:needZone="true"--><!--:readOnly="false"-->
      </el-col>
    </el-row>
    <!--房型信息-->
    <el-row>
      <header class="block-title">
        {{$t('addHotelProduct.roomInfo')}}（<span style="color:#008000;">{{$t('addHotelProduct.roomInfoHint')}}</span>）
        <el-tooltip class="item" effect="dark" :content="$t('addHotelProduct.operationTip')" placement="top">
          <i class="el-icon-information"></i>
        </el-tooltip>
      </header>
    </el-row>
    <el-row align="middle" :gutter=10>
      <el-col :span=2 class="row-middle">
        {{$t('addHotelProduct.needAddProductRoom')}}
      </el-col>
      <el-col :span=22 align="top">
        <el-tag
          type="primary"
          class="margin-right-bottom-5"
          :key="tag.id"
          v-for="tag in dynamicTags"
          :closable="true"
          :close-transition="false"
          @close="handleClose(tag)"
        >{{tag.title}}
        </el-tag>
      </el-col>
    </el-row>
    <el-row align="middle" :gutter="10">
      <el-col :span="2" class="row-middle">
        {{$t('addHotelProduct.roomManage')}}
      </el-col>
      <el-col :span="22" align="top">
        <el-input v-model="roomType" size="small" :placeholder="$t('addHotelProduct.prompt')"
                  style="width:220px;"></el-input>
        <el-button style="margin-left: 10px;" type="text" @click="queryRoomType" :disabled="!formData.currentHotel">
          {{$t('addHotelProduct.queryRoom')}}
        </el-button>
        <el-button type="text" @click="checkAll" :disabled="!roomList.length">
          {{$t('addHotelProduct.chooseAllRoom')}}
        </el-button>
        <!--<el-button type="text" :disabled="!formData.currentHotel" @click="releaseRoom">
          {{$t('addHotelProduct.issueRoom')}}
        </el-button>
        <el-button type="text" @click="toRoomTypeList" :disabled="!formData.currentHotel">
          {{$t('addHotelProduct.roomList')}}
        </el-button>-->
      </el-col>
    </el-row>
    <el-row align="middle" :gutter="10">
      <el-col :span="2" class="row-middle row-middle-m">
        {{$t('addHotelProduct.hotelRoom')}}
      </el-col>
      <el-col :span="22" align="top">
        <ul style="padding-left: 10px;" class="cf">
          <li class="room-item item-content" v-for="(item,index) in roomList" :key="index">
            <el-checkbox size="small" v-model="item.checked" @change="checkout($event,index)"
                         class="left" border style="width: 100%; height: 100%;">
              <div style="padding-left:25px;">
                <strong :style="{color:item.roomColor}">{{item.roomName}}</strong>
                <div class="qwqwqqw">
                  <span style="color:gray;">{{item.bedType}}</span>
                  <span style="color:gray;">{{item.hasInternet}}</span>
                  <span style="color:gray;">{{item.hasWifi}}</span>
                  <span style="color:gray;">{{item.allowAddbed}}</span>
                </div>
                <div>
                  <span style="color:gray;">{{item.infoRoom}} [{{item.roomId}}]</span>
                  <router-link :to="{path:'/productCommon/ModifyProductInfo',query:{productId:ele}}"></router-link>
                </div>
              </div>
            </el-checkbox>
          </li>
        </ul>
      </el-col>
    </el-row>
    <!--客房基本信息-->
    <el-row>
      <header class="block-title">客房基本信息</header>
    </el-row>
    <el-row align="middle" :gutter="10">
      <el-col :span="6" >
        <span class="consistent-color">{{$t('addProduct.supplier')}}</span>
        <select-supplier @getSupplier="getSupplier" :width="150" ref="accommodationSupplier"></select-supplier>
      </el-col>
    </el-row>

    <el-row>
      <table class="self-table">
        <colgroup>
          <col >
          <col>
        </colgroup>
        <tbody>
        <tr>
          <td><div class="consistent-color">{{$t('addProduct.roomSet')}}</div></td>
          <td  class="refundTable">
            <el-table :data="roomSettingsData" v-loading="roomSettingsLoading">
              <el-table-column :label="$t('addProduct.roomType')">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.room" @change="changeRoomType(scope.row.room,scope.row)" size="small" :disabled=true
                             :placeholder="$t('addProduct.pleaseSelect',{name:''})" >
                    <el-option
                      v-for="item in roomsOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('addProduct.bedType')">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.bed" size="small" :placeholder="$t('addProduct.pleaseSelect',{name:''})">
                    <el-option
                      v-for="item in bedOptionsArr[scope.row.room]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('addProduct.breakfast')">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.breaker" size="small"
                             :placeholder="$t('addProduct.pleaseSelect',{name:''})">
                    <el-option
                      v-for="item in breakfastOptions"
                      :key="item.name"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('addProduct.guestType')" width="140">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.guestType" size="small"
                             :placeholder="$t('addProduct.pleaseSelect',{name:''})">
                    <el-option v-for="item in guestTypes"
                               :value="item.value"
                               :label="item.label"
                               :key="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </td>
        </tr>
        </tbody>
      </table>

    </el-row>

    <el-row>
      <el-form :model="this" ref="hotelProductForm"  label-width="140px" label-position="left"><!--:rules="rules"-->
        <!--预订设置-->
        <div>
          <header class="block-title">{{ $t('addProduct.reservationSettings') }}</header>
        </div>
        <!--提前预订时间要求-->
        <el-row>
          <el-col :span="11">
            <el-form-item :label="$t('addProduct.scheduleTimeRestriction')" >

                  {{$t('hotelProductPlanType.minAdvMinutes')}}
                  <el-input-number v-model="minAdvDays" auto-complete="off" :min="0" size="mini"></el-input-number>
                  {{$t('hotelProductPlanType.dayUnit')}}
                  <el-input-number v-model="minAdvHours" auto-complete="off" :min="0" :max="24" size="mini"></el-input-number>
                  {{$t('hotelProductPlan.clock')}}
                  <el-input-number v-model="minAdvMinutes2" auto-complete="off" :min="0" :max="59" size="mini"></el-input-number>
                  {{$t('hotelProductPlanType.minuteUnit')}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('hotelProductPlanType.maxAdvMinutes')">
                  <el-input-number v-model="maxAdvDays" auto-complete="off" :min="0" size="mini"></el-input-number>
                  {{$t('hotelProductPlanType.dayUnit')}}
                  <el-input-number v-model="maxAdvHours" auto-complete="off" :min="0" :max="24" size="mini"></el-input-number>
                  {{$t('hotelProductPlan.clock')}}
                  <el-input-number v-model="maxAdvMinutes2" auto-complete="off" :min="0" :max="59" size="mini"></el-input-number>
                  {{$t('hotelProductPlanType.minuteUnit')}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!--入住天数要求-->
          <el-col :span="11">
            <el-form-item :label="$t('入住天数要求')"  >
                  {{$t('hotelProductPlanType.minDays')}}
                  <el-input-number v-model="minDays" auto-complete="off" :min="0" size="mini"></el-input-number>
                  {{$t('hotelProductPlanType.dayUnit')}}
                  {{$t('hotelProductPlanType.maxDays')}}
                  <el-input-number v-model="maxDays" auto-complete="off" :min="0" size="mini"></el-input-number>
                  {{$t('hotelProductPlanType.dayUnit')}}
            </el-form-item>
          </el-col>
          <!--预订房间数量限制-->
          <el-col :span="12">
            <el-form-item label="预订房间数量限制">
                  {{$t('hotelProductPlanType.minRoomNum')}}
                  <el-input-number v-model="minRoomNum" auto-complete="off" :min="0" size="mini"></el-input-number>
                  {{$t('hotelProductPlanType.dayUnit')}}
                  {{$t('hotelProductPlanType.maxRoomNum')}}
                  <el-input-number v-model="maxRoomNum" auto-complete="off" :min="0" size="mini"></el-input-number>
                  {{$t('hotelProductPlanType.dayUnit')}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span=11 >
            <el-form-item label="每日销售时间">
              <el-time-picker
                size="small"
                placeholder="起始时间"
                v-model="dayStartTime"
                :picker-options="{selectableRange:'00:00:00 - 23:59:59'}">
              </el-time-picker>
              <el-time-picker
                size="small"
                placeholder="结束时间"
                v-model="dayEndTime"
                :picker-options="{selectableRange:'00:00:00 - 23:59:59',minTime: arrivalStartTime}">
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <el-form-item label="客户到店时间">
              <el-time-picker
                size="small"
                placeholder="起始时间"
                v-model="arrivalStartTime"
                :picker-options="{selectableRange:'00:00:00 - 23:59:59'}">
              </el-time-picker>
              <el-time-picker
                size="small"
                placeholder="结束时间"
                v-model="arrivalEndTime"
                :picker-options="{selectableRange:'00:00:00 - 23:59:59',minTime: arrivalStartTime}">
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <!--预售时间-->
          <el-col :span=11>
            <el-form-item :label="$t('addProduct.launchTime')" ><!--prop="baseTableData.dateTimeRange"-->
              <el-date-picker
                v-model="baseTableData.dateTimeRange"
                :editable="false"
                size="small"
                type="daterange"
                :placeholder="$t('addProduct.pleaseSelect',{name:$t('addProduct.dateRange')})">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!--是否允许超卖-->
          <el-col :span=12 >
            <el-form-item :label="$t('addProduct.oversoldSettings')" prop="allowOversold">
              <el-radio-group v-model="allowOversold">
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
              <el-select v-model="saleRange" size="small"
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
          <!--产品标签-->
          <el-col :span=12>
            <el-form-item label="产品标签">
              <el-input v-model="productTag" size="small"
                        placeholder="请输入产品标签" style="width: 40%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!--退改申请设置-->
          <el-col :span=11>
            <el-form-item :label="$t('addProduct.backApplication')" prop="cancelPolicy">
              <el-select v-model="cancelPolicy" size="small" :placeholder="$t('addProduct.pleaseSelect',{name:''})" style="width:270px;">
                <el-option :label="$t('addProduct.allowRefund')" :value="1"></el-option>
                <el-option :label="$t('addProduct.notAllowRefund')" :value="-1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--取消提前分钟数限制-->
          <el-col :span=12 v-if="cancelPolicy == 1">
            <el-form-item :label="$t('取消提前分钟数限制')" prop="aheadCancelMinutes">
              <el-input-number v-model="cancelAdvMinutes" auto-complete="off" :min="0" size="mini"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

        </el-row>

        <!--计调设置-->
        <el-row>
          <header class="block-title">{{ $t('addProduct.controlSettings') }}</header>
        </el-row>
        <el-row>
          <!--通知单生成控制-->
          <el-col :span="11">
            <el-form-item :label="$t('addProduct.notification')" >
              <td style="padding:5px 10px;">
                <el-radio-group v-model="sendNotifyType">
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
              <el-radio-group v-model="isSendSms">
                <el-radio :label=1>{{$t('addProduct.sendMsg')}}</el-radio>
                <el-radio :label=0>{{$t('addProduct.noNeed')}}</el-radio>
              </el-radio-group>
              <el-collapse-transition>
                <div v-show="isSendSms=='1'">
                  <el-input type="textarea" autosize :placeholder="$t('addProduct.reserveSuccessfulTip')" v-model="sendSmsContent"></el-input>
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
      </el-form>
    </el-row>

    <el-row>
      <header class="block-title">{{$t('addProduct.bookingInst')}}</header>
      <editor :h="320" :id="'reserveIntro'" @getContent="getInfoBookingContent" ref="reserveIntro" :con="infoBooking" style="z-index: 0"></editor>
      <header class="block-title">{{$t('addProduct.proDes')}}（包含的服务，注意事项）</header>
      <editor :h="350" :id="'proDesc'" @getContent="getContent" ref="proDesc" :con="proDescDefaultContent" style="z-index: 0"></editor>
    </el-row>

    <!--保存提交数据-->
    <div class="text-center">
      <el-button type="primary" size="small" :disabled="!dynamicTags.length" @click="submit">保存</el-button>
    </div>
    <!--弹出框区域-->
    <!--<el-dialog :title="$t('addHotelProduct.newRoom')" :visible.sync="dialogFormVisible" @close="clearForm('roomForm')">
      <el-form :model="addRoomFormData" label-width="120px" :inline="true" label-suffix="：" class="roomForm"
               ref="roomForm" :rules="rules">
        <el-form-item :label="$t('addHotelProduct.roomName')" prop="roomName">
          <el-input size="small" v-model="addRoomFormData.roomName" auto-complete="off" class="width-210"></el-input>
        </el-form-item>
        <el-form-item :label="$t('addHotelProduct.roomAcreage')" prop="roomAcreage">
          <el-input v-model="addRoomFormData.roomAcreage" size="small" class="width-210"></el-input>
          ㎡
        </el-form-item>
        <el-form-item :label="$t('addHotelProduct.bed')" class="room-bed" prop="checkList" style="width:100%;">
          <el-checkbox-group v-model="addRoomFormData.checkList">
            <el-checkbox v-for="(item,index) in checkboxList" :key="index" :label="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('addHotelProduct.bedAcreage')" prop="acreage">
          <el-input v-model="addRoomFormData.acreage" size="small" class="width-210"></el-input>
        </el-form-item>
        <el-form-item :label="$t('addHotelProduct.allowAddBed')" prop="radio">
          <el-radio-group v-model="addRoomFormData.radio">
            <el-radio :label="0">{{$t('addHotelProduct.disallowed')}}</el-radio>
            <el-radio :label="1">{{$t('addHotelProduct.allowed')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('addHotelProduct.floor')" prop="floor">
          <el-input v-model="addRoomFormData.floor" size="small" class="width-210"></el-input>
        </el-form-item>
        <el-form-item :label="$t('addHotelProduct.facility')" prop="facility">
          <el-input size="small" class="width-210" v-model="addRoomFormData.facility"></el-input>
        </el-form-item>
        <el-form-item :label="$t('addHotelProduct.broadband')" prop="broadband">
          <el-radio-group v-model="addRoomFormData.broadband">
            <el-radio :label="broadbandOptions[0].value">{{broadbandOptions[0].label}}</el-radio>
            <el-radio :label="broadbandOptions[1].value">{{broadbandOptions[1].label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('addHotelProduct.wifi')" prop="wifi">
          <el-radio-group v-model="addRoomFormData.wifi">
            <el-radio :label="0">{{$t('addHotelProduct.nought')}}</el-radio>
            <el-radio :label="1">{{$t('addHotelProduct.free')}}</el-radio>
            <el-radio :label="2">{{$t('addHotelProduct.charge')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('addHotelProduct.remark')" class="room-remark" prop="textarea">
          <el-input
            type="textarea"
            autosize
            :placeholder="$t('addHotelProduct.prompt')"
            v-model="addRoomFormData.textarea">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('addHotelProduct.cancel')}}</el-button>
        <el-button @click="resetForm('roomForm')">{{$t('addHotelProduct.reset')}}</el-button>
        <el-button type="primary" @click="addRoomType('roomForm')">{{$t('addHotelProduct.confirm')}}</el-button>
      </div>
    </el-dialog>-->
  </el-main>
</template>
<script>
  import SelectArea from '@/views/product/common/SelectArea'
  import HotelRoomInfo from '@/api/product/hotelRoomInfo'
  import Editor from '@/components/Editor'
  import SelectSupplier from '@/views/product/common/SelectSupplier'
  import hotelProduct from '@/api/product/hotelProduct'
  import hotelInfo from '@/api/hotel/hotelInfo'
  import enumApi from '@/api/openapi/enumApi'
  export default {
    name: 'AddHotelProduct',
    components: {
      SelectArea,
      SelectSupplier,
      Editor
    },
    data() {
      const validateAcreage = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('addHotelProduct.prompt', { name: this.$t('addHotelProduct.numeric') })))
        } else {
          callback()
        }
      }
      return {
        dayStartTime: '00:00:00',
        dayEndTime: '23:59:59',
        arrivalStartTime: '00:00:00',
        arrivalEndTime: '23:59:59',
        cancelAdvMinutes: 0,
        hotelInfo: {},
        // *** 客房基本信息
        currentSupplier: '',
        roomSettingsLoading: false,
        roomSettingsData: [],
        bedOptionsArr: [],
        hotelRoomInfoForms: [],
        roomsOptions: [],
        breakfastOptions: [],
        guestTypes: [],
        hotelInfoForm: {
          id: '',
          hotelName: '',
          hotelNameEn: '',
          hotelDesc: '',
          hotelStar: '',
          areaId: '',
          zoneId: '',
          address: '',
          postCode: '',
          infoChild: '',
          infoPet: '',
          phone: '',
          fax: '',
          imgMain: '',
          imgList: '',
          roomNum: '',
          openDate: '',
          checkinTime: '',
          checkoutTime: '',
          website: '',
          geoLng: '',
          geoLat: '',
          geoHash: '',
          timeZone: '',
          infoEntertainment: '',
          infoService: '',
          infoRoom: '',
          infoCard: '',
          infoNetwork: '',
          infoMeeting: '',
          auditMemo: '',
          state: '',
          createDate: '',
          modifyDate: ''
        },
        // *** 客房基本信息
        // *** 相关设置
        minAdvMinutes: '0', // 总分钟数 -最小
        minAdvDays: '0', // 天 -最小
        minAdvHours: '0', // 小时 -最小
        minAdvMinutes2: '0', // 分钟 -最小
        maxAdvMinutes: '0', // 总分钟数 -最大
        maxAdvDays: '0', // 天 -最大
        maxAdvHours: '0', // 小时 -最大
        maxAdvMinutes2: '0', // 分钟 -最大
        minDays: 0,
        maxDays: 0,
        minRoomNum: 0,
        maxRoomNum: 0,
        aheadCancelMinutes: 0,
        // 是否发送短信
        isSendSms: 0,
        // 短信内容
        sendSmsContent: '',
        // 销售范围
        saleRange: 1,
        baseTableData: {
          interface: '',
          retailLimit: '0',
          saleScope: '3',
          idType: '0',
          numLimit: 0,
          isAllowed: '0',
          confirmWay: 0,
          noticeControl: '0',
          noticeDays: 1,
          applyBack: '1',
          depositMode: '0',
          deposit: '100',
          refund: ['0'],
          isAllowedSend: '0',
          noticeIsAllowedSend: '0',
          ack: '0',
          ackIsSend: '0',
          autoComplete: '0',
          encoding: '',
          encodingType: '',
          // 预售时间范围
          dateTimeRange: [],
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
        // 预售时间范围
        dateTimeRange: [],
        // 是否允许超卖
        allowOversold: 0,
        scopes: [{
          value: 1,
          label: '对同行和直客'
        }, {
          value: 2,
          label: '只对同行销售'
        }, {
          value: 3,
          label: '只对直客销售'
        }],
        // 生成通知单类型
        sendNotifyType: 0,
        // 退改申请设置
        cancelPolicy: 1,
        saveAndNext: 1,
        // *** 相关设置
        // *** 相关说明
        uploadTab: 'first',
        uploadShow: false,
        infoBooking: '',
        img: '',
        imgList: [],
        proDescDefaultContent: '',
        // *** 相关说明
        checkboxList: this.GLOBAL.RoomTypeList,
        dynamicTags: [],
        roomType: '',
        roomList: [],
        dialogFormVisible: false,
        // 地区需要设置初始值
        areaId: '0',
        formData: {
          currentHotel: '',
          hotelName: '',
          currentHotelAddress: '',
          defaultProvince: '',
          defaultCity: '',
          defaultArea: ''
        },
        rules: {
          roomName: [
            {
              required: true,
              message: this.$t('addHotelProduct.prompt', { name: this.$t('addHotelProduct.roomName').toLocaleLowerCase() }),
              trigger: 'blur'
            }
          ],
          roomAcreage: [
            { required: true, validator: validateAcreage, trigger: 'blur' }
          ],
          acreage: [
            { validator: validateAcreage, trigger: 'blur' }
          ],
          floor: [
            { validator: validateAcreage, trigger: 'blur' }
          ]
        },
        broadbandOptions: [{
          value: '0',
          label: '无宽带'
        }, {
          value: '1',
          label: '有宽带'
        }],
        hotelInfoForms: []
      }
    },
    methods: {
      // 房型信息
      // *** 相关说明
      // 获取预订说明
      getInfoBookingContent(obj) {
        this.infoBooking = obj.html
      },
      // 产品详细说明
      getContent(obj) {
        this.infoProduct = obj.html
      },
      // *** 相关说明
      // 地区组件值变化的时候进行回调获取
      getAreaId(val) {
        if (val.id) {
          this.areaId = val.id
        } else {
          this.areaId = '0'
        }
      },
      changeHotel() {
        this.queryRoomType()
      },
      // 标签自我删除
      handleClose(tag) {
        const idx = this.dynamicTags.map(ele => {
          return ele.id
        }).indexOf(tag.id)
        this.dynamicTags.splice(idx, 1)
        for (let i = 0; i < this.roomList.length; i++) {
          if (this.roomList[i]['roomId'] === tag.id) {
            this.roomList[i]['checked'] = false
          }
        }
      },
      queryRoomType() {
        this.roomList = []
        this.dynamicTags = []
        if (this.formData.currentHotel) {
          HotelRoomInfo.listForSelect(this.formData.currentHotel, this.roomType).then(res => {
            const arr = []
            const results = res.results
            if (results && results.length) {
              for (let i = 0; i < results.length; i++) {
                const ele = {
                  roomId: results[i].id,
                  roomName: results[i].roomName,
                  infoRoom: results[i].infoRoom,
                  bedType: results[i].bedType,
                  allowAddbed: results[i].allowAddbed === 0 ? '不允许加床' : '允许加床',
                  hasInternet: results[i].hasInternet === 0 ? '无宽带' : '有宽带',
                  hasWifi: results[i].hasWifi === 0 ? '无WIFI' : results[i].hasWifi === 1 ? '免费WIFI' : '收费WIFI',
                  roomColor: 'green',
                  checked: ''
                }
                arr.push(ele)
              }
              this.roomList = arr
            }
          })
        }
      },
      checkAll() {
        const _this = this
        if (this.dynamicTags.length >= this.roomList.length) {
          this.roomList.forEach(function(ele) {
            ele.checked = false
            _this.dynamicTags.splice(0)
          })
        } else {
          this.roomList.forEach(function(ele) {
            if (!ele.checked) {
              ele.checked = true
              _this.dynamicTags.push({
                title: ele.roomName,
                id: ele.roomId
              })
            }
          })
        }
      },
      toRoomTypeList() {
        this.$router.push({
          path: '/hotel/hotelRoomInfos/list',
          query: { hotelId: this.formData.currentHotel }
        })
      },
      releaseRoom() {
        this.dialogFormVisible = true
      },
      // 单选操作
      checkout(event, index) {
        // 判定是否选中
        if (!this.roomList[index].checked) {
          const idx = this.dynamicTags.map(ele => {
            return ele.id
          }).indexOf(this.roomList[index]['roomId'])
          this.dynamicTags.splice(idx, 1)
        } else {
          this.dynamicTags.push({
            title: this.roomList[index]['roomName'],
            id: this.roomList[index]['roomId']
          })
        }
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      // 清空表单
      clearForm(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      },
      initDate() {
        const pram = {
          hotelId: this.$route.query.hotelId,
          areaId: this.$route.query.areaId
        }
        hotelInfo.load(pram).then(res => {
          this.hotelInfo = res
        })
        // 获取所有房型
        HotelRoomInfo.listForSelect(this.$route.query.hotelId, '').then(res => {
          const results = res.results
          this.hotelRoomInfoForms = results
          if (results && results.length) {
            const arr = []
            for (let i = 0; i < results.length; i++) {
              const ele = {
                value: results[i].id,
                label: results[i].roomName
              }
              const bedTypeArr = []
              const bedTypes = results[i].bedType.split(',')
              for (let j = 0; j < bedTypes.length; j++) {
                const bedTypeEle = {
                  value: bedTypes[j],
                  label: bedTypes[j]
                }
                bedTypeArr.push(bedTypeEle)
              }
              this.bedOptionsArr[results[i].id] = bedTypeArr
              arr.push(ele)
            }
            this.roomsOptions = arr
          }
          if (this.roomList) {
            const initRoomSettingTable = []
            for (let i = 0; i < this.dynamicTags.length; i++) {
              const params = {
                room: this.dynamicTags[i],
                bed: '',
                breaker: '无',
                guestType: '',
                bedOptions: ''
              }
              initRoomSettingTable.push(params)
            }
            this.roomSettingsData = initRoomSettingTable
          }
        })
        // 获取早餐跟宾客的枚举值
        enumApi.breakfastList().then(res => {
          this.breakfastOptions = res
        })
        enumApi.guestTypeList().then(res => {
          this.guestTypes = res
        })
      },
      // 提交表单保存数据
      submit() {
        // 提交前的表单校验,因为这里没有用到element的form所以只能自己写校验,因为没时间重写只能这样
        if (this.currentSupplier === '') {
          this.$message('请选择供应商')
          return false
        } else if (!this.infoBooking || this.infoBooking === '') {
          this.$message('请输入预订说明')
          return false
        } else if (!this.infoProduct || this.infoProduct === '') {
          this.$message('请输入产品说明')
          return false
        }
        const addProductVos = []
        for (let i = 0; i < this.roomSettingsData.length; i++) {
          // const type = _this.getRoomType(ele.room)
          // const breakfast = _this.getBreakfast(ele.breaker)
          const params = {
            hotelProduct: {
              dayStartTime: this.dayStartTime,
              dayEndTime: this.dayEndTime,
              productTag: this.productTag,
              arrivalStartTime: this.arrivalStartTime,
              arrivalEndTime: this.arrivalEndTime,
              roomId: this.roomSettingsData[i].room.id || this.roomSettingsData[i].room,
              roomName: this.dynamicTags[i].title,
              bedType: this.roomSettingsData[i].bed,
              breaker: this.roomSettingsData[i].breaker,
              hotelId: this.$route.query.hotelId,
              hotelName: this.$route.query.hotelName,
              guestType: this.roomSettingsData[i].guestType,
              supplierMchId: this.currentSupplier,
              // 补充酒店信息到产品表 冗余字段--来自hotel_info表
              areaId0: this.hotelInfo.areaId0,
              areaId1: this.hotelInfo.areaId1,
              areaId2: this.hotelInfo.areaId2,
              areaId3: this.hotelInfo.areaId3,
              hotelStar: this.hotelInfo.hotelStar,
              // 产品相关设置
              minAdvMinutes: this.DHM2Minute(this.minAdvDays, this.minAdvHours, this.minAdvMinutes2),
              maxAdvMinutes: this.DHM2Minute(this.maxAdvDays, this.maxAdvHours, this.maxAdvMinutes2),
              saleRange: this.saleRange,
              permitBundle: this.permitBundle,
              cancelPolicy: this.cancelPolicy,
              sendNotifyType: this.sendNotifyType,
              minDays: this.minDays,
              maxDays: this.maxDays,
              minRoomNum: this.minRoomNum,
              maxRoomNum: this.maxRoomNum,
              isSendSms: this.isSendSms,
              sendSmsContent: this.sendSmsContent,
              cancelAdvMinutes: this.cancelAdvMinutes,
              saleStartDate: this.baseTableData.dateTimeRange[0], // 产品开售时间
              saleStopDate: this.baseTableData.dateTimeRange[1], // 产品停售时间,
              // 相关说明
              productInfo: this.infoProduct,
              bookingInfo: this.infoBooking
            }
          }
          addProductVos.push(params)
        }
        hotelProduct.batchSave(addProductVos).then(res => {
          if (res && res.length !== 0) {
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.$router.push({ path: '/product/hotelProducts/hotelInfoList' })
              }
            })
          } else {
            this.$message({
              message: '保存失败',
              type: 'error',
              duration: 1000
            })
          }
        })
      },
      getSupplier(val) {
        this.currentSupplier = val.id
      },
      // 将天、时、分转成分钟数
      DHM2Minute(d, h, m) {
        return d * (24 * 60) + h * 60 + m
      }
    },
    created() {
      this.formData.currentHotel = this.$route.query.hotelId
      this.formData.hotelName = this.$route.query.hotelName
      this.queryRoomType()
    },
    mounted() {
      // 手动调用子组件方法传值
      this.$refs['selectArea'].getForRead(this.$route.query.areaId)
      this.initDate()
    },
    watch: {
      dynamicTags: function() {
        HotelRoomInfo.listForSelect(this.formData.currentHotel, '').then(res => {
          const results = res.results
          this.hotelRoomInfoForms = results
          if (results && results.length) {
            const arr = []
            for (let i = 0; i < results.length; i++) {
              const ele = {
                value: results[i].id,
                label: results[i].roomName
              }
              const bedTypeArr = []
              const bedTypes = results[i].bedType.split(',')
              for (let j = 0; j < bedTypes.length; j++) {
                const bedTypeEle = {
                  value: bedTypes[j],
                  label: bedTypes[j]
                }
                bedTypeArr.push(bedTypeEle)
              }
              this.bedOptionsArr[results[i].id] = bedTypeArr
              arr.push(ele)
            }
            this.roomsOptions = arr
          }
          if (this.roomList) {
            const initRoomSettingTable = []
            for (let i = 0; i < this.dynamicTags.length; i++) {
              if (this.roomList[i].id === this.roomsOptions[i].id) {
                const params = {
                  room: this.dynamicTags[i].id,
                  breaker: null,
                  guestType: '',
                  bedOptions: ''
                }
                initRoomSettingTable.push(params)
              }
            }
            this.roomSettingsData = initRoomSettingTable
          }
        })
      }
    }
  }
</script>
<style>
  .add-hotel-container {
    padding: 15px;
  }
  .add-hotel-container .el-dialog--small{
    width:55%;
  }

  .room-bed .el-form-item__label{
    float: left;
  }
  .room-bed .el-form-item__content{
    margin-left: 120px;
    display: block;
  }
  .room-remark{
    width: 100%!important;
    margin-bottom: 0;
  }
  .room-remark .el-form-item__content{
    width: 80%;
  }
</style>
<style scoped>
  .self-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0px;
    border-color: grey;
    border-right: 1px solid #dfe6ec;
    border-bottom: 1px solid #dfe6ec;
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

  .self-table thead th {
    background-color: #eef1f6;
    font-size: 14px;
  }

  .add-hotel-container .el-form-item{
    margin-bottom:5px;
    padding-bottom: 5px;
  }

  .room-item {
    float: left;
    padding: 3px;
    width: 25%;
  }

  .room-item .item-content {
    padding: 5px;
    border: 1px solid #ddd;
  }

  .roomForm{
    font-size: 0;
  }
  .roomForm .el-checkbox{
    margin-left:0;
    margin-right: 15px;
  }
  .roomForm .el-form-item{
    width: 50%;
    margin-right:0;
    margin-bottom: 15px;
  }

  .width-210{
    width: 210px;
  }

  .margin-right-bottom-5{
    margin: 5px 5px 5px 0;
  }

  .block-title {
    clear: both;
    display: block;;
    background: #D2E0F0;
    padding: 10px;
    font-weight: bold;
    color: #555555;
  }
  .search-width {
    width: 100%;
  }
  .row-middle {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: right;
  }
  .row-middle-m {
    margin-top: 25px;
    margin-bottom: 25px;
  }
  .consistent-color {
    color:#606266;
  }
</style>

