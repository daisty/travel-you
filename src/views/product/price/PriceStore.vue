<template>
  <div class="InventoryAndPriceManageScope">
    <div class="btm cf">
      <div class="btm-left fl">
        <div style="margin-left: 20px;margin-bottom: 20px;">
          <calendar :productId='productId' ref="calendar"
                    @setCalendarDayClear="setCalendarDayClear" @setData="setData">

          </calendar>
        </div>
        <div class="inventoryInstructions" style="margin-left: 10px;">
          <p><span style="color: #cc9900">{{$t('priceStore.inventoryInstructions')}}：</span>{{$t('priceStore.inventoryInstructionsContent')}}：</p>
          <p><span style="color: #FF4949">{{$t('priceStore.full')}}：</span>{{$t('priceStore.fullContent')}}</p>
          <p><span style="color: #13CE66">{{$t('priceStore.footfull')}}：</span>{{$t('priceStore.footfullContent')}}</p>
          <p><span style="color: #1D8CE0">{{$t('priceStore.state')}}：</span>{{$t('priceStore.stateContent')}}</p>
          <p><span style="color: #8492A6">{{$t('priceStore.close')}}：</span>{{$t('priceStore.closeContent')}}</p>
          <p><span style="color: #F7BA2A">{{$t('priceStore.deduct')}}：</span>{{$t('priceStore.deductContent')}}</p>
          <p><span style="color: #FF4949">{{$t('priceStore.superDeduct')}}：</span>{{$t('priceStore.superDeductContent')}}</p>
        </div>
      </div>
      <div class="fl">
        <el-checkbox-group v-model="itemCheck" style="font-size: 15px;">
          <table class="block">
            <thead>
            <tr>
              <th colspan="3">{{$t('priceStore.updatePriceStore')}}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td no>{{$t('priceStore.project')}}</td>
              <td>{{$t('priceStore.projectValue')}}</td>
              <td no><span @click="selectAll" :class="itemAll ? 'check-yes' : 'check-no'"><i v-if="itemAll"
                                                                                             class="el-icon-check"></i></span>
              </td>
            </tr>
            <tr>
              <td no>{{$t('priceStore.storeNum')}}</td>
              <td>
                <el-input-number size="small" v-model="num" @blur="checkForm('num')"
                                 @change="itemInputChange('num')" :class="{'inputError': rules.num}"
                                 :min="-1">

                </el-input-number>
                <span>{{$t('priceStore.piece')}}</span></td>
              <td no>
                <template>
                  <el-checkbox label="num" @change="itemCheckChange"><i></i></el-checkbox>
                </template>
              </td>
            </tr>
            <tr>
              <td no>{{$t('priceStore.conferPriceRmb')}}</td>
              <td>
                <el-input v-model="conferPriceRmb" @blur="checkForm('conferPriceRmb')"
                          :class="{'inputError': rules.conferPriceRmb}"
                          @change="itemInputChange('conferPriceRmb')"
                          size="small" style="width: 200px;">

                </el-input>
                <span><!--{{currency}}-->CNY</span>
              </td>
              <td no>
                <template>
                  <el-checkbox label="conferPriceRmb" @change="itemCheckChange"><i></i></el-checkbox>
                </template>
              </td>
            </tr>
            <tr>
              <td no>{{$t('priceStore.priceRmb')}}</td>
              <td>
                <el-input v-model="priceRmb" @blur="checkForm('priceRmb')"
                          @change="itemInputChange('priceRmb')"
                          :class="{'inputError': rules.priceRmb}" size="small" style="width: 200px;">

                </el-input>
                <span><!--{{currency}}-->CNY</span>
              </td>
              <td no>
                <template>
                  <el-checkbox label="priceRmb" @change="itemCheckChange"><i></i></el-checkbox>
                </template>
              </td>
            </tr>
            <tr>
              <td no>{{$t('priceStore.salePriceRmb')}}</td>
              <td>
                <el-input v-model="salePriceRmb" @blur="checkForm('salePriceRmb')"
                          @change="itemInputChange('salePriceRmb')"
                          :class="{'inputError': rules.salePriceRmb}" size="small" style="width: 200px;">

                </el-input>
                <span><!--{{currency}}-->CNY</span>
              </td>
              <td no>
                <template>
                  <el-checkbox label="salePriceRmb" @change="itemCheckChange"><i></i></el-checkbox>
                </template>
              </td>
            </tr>
            <tr>
              <td no>{{$t('priceStore.startDay')}}</td>
              <td>
                <el-input-number size="small" v-model="startDay" @blur="checkForm('startDay')"
                                 @change="itemInputChange('startDay')" :class="{'inputError': rules.startDay}" :min="1" :disabled="true">

                </el-input-number>
                <span>{{$t('priceStore.day')}}</span></td>
              <td no>
                <template>
                  <el-checkbox label="startDay" @change="itemCheckChange"><i></i></el-checkbox>
                </template>
              </td>
            </tr>
            <tr>
              <td no>{{$t('priceStore.startNum')}}</td>
              <td>
                <el-input-number size="small" v-model="startNum" @blur="checkForm('startNum')"
                                 @change="itemInputChange('startNum')" :class="{'inputError': rules.startNum}" :min="1" :disabled="true">

                </el-input-number>
                <span>{{$t('priceStore.roomNum')}}</span></td>
              <td no>
                <template>
                  <el-checkbox label="startNum" @change="itemCheckChange"><i></i></el-checkbox>
                </template>
              </td>
            </tr>
            <tr>
              <td no>{{$t('priceStore.roomState')}}</td>
              <td>
                <template>
                  <el-select v-model="state" :placeholder="$t('common.pleaseSelectNoNmae')" size="small" @change="itemInputChange('state')">
                    <el-option
                      v-for="item in states"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </td>
              <td no>
                <template>
                  <el-checkbox label="state" @change="itemCheckChange"><i></i></el-checkbox>
                </template>
              </td>
            </tr>
            <tr>
              <td no>{{$t('priceStore.adjustReason')}}</td>
              <td colspan="2">
                <el-input v-model="adjustReason" type="textarea" size="mini" :placeholder="$t('common.pleaseSelectNoNmae')"></el-input>
              </td>
            </tr>
            <tr>
              <td no colspan="3">
                <el-button @click="save" size="small">{{$t('common.save')}}</el-button>
                <el-button size="small" @click="deletePrice">{{$t('common.delete')}}</el-button>
                <el-button size="small" @click="reset">{{$t('common.reset')}}</el-button>
              </td>
            </tr>
            </tbody>
          </table>
        </el-checkbox-group>

        <div class="inventoryInstructions" style="width: calc(40% + 200px);margin-top: 20px;">
          <p><span style="color: #cc9900">{{$t('priceStore.storeNumContent')}}</span></p>
          <p><span style="color: #FF4949">-1：{{$t('priceStore.fullExplain')}}；</span></p>
          <p><span style="color: #FF4949">0：{{$t('priceStore.noLimitExplain')}}；</span></p>
          <p><span style="color: #FF4949">*：{{$t('priceStore.saleExplain')}}；</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import hotelProductPrice from '@/api/product/hotelProductPrice'
  import Calendar from '@/views/product/price/PriceCalendar'
  import { isPrice } from '@/utils/tools'
  export default {
    components: {
      Calendar
    },
    data() {
      return {
        hotelProductPriceId: [],
        productId: this.$route.query.productId,
        adjustReason: '',
        conferPriceRmb: '',
        priceRmb: '',
        salePriceRmb: '',
        currency: '', // 货币类型
        num: '',
        startDay: '',
        startNum: '',
        state: 1,
        states: [
          { value: 1, label: '正常' },
          { value: 0, label: '关房' }
        ],
        // 值项目反选
        itemCheck: [],
        itemAll: false,
        year: '',
        month: '',
        calendarDay: [],
        itemCheckList: ['num', 'conferPriceRmb', 'priceRmb', 'salePriceRmb', 'startDay', 'startNum', 'state'],
        rules: {
          'conferPriceRmb': false,
          'priceRmb': false,
          'salePriceRmb': false
        }
      }
    },
    methods: {
      selectAll() {
        this.itemAll = !this.itemAll
        this.itemCheck = this.itemAll ? this.itemCheckList : []
      },
      itemCheckChange() {
        if (this.itemCheckList.length === this.itemCheck.length) {
          this.itemAll = true
        } else {
          this.itemAll = false
        }
      },
      reset() {
        this.itemAll = false
        this.itemCheck = []
        this.conferPriceRmb = ''
        this.priceRmb = ''
        this.salePriceRmb = ''
        this.state = '0'
        this.startNum = ''
        this.startDay = ''
        this.num = ''
        this.adjustReason = ''
      },
      checkForm(key) {
        switch (key) {
          case 'conferPriceRmb':
            this.rules.conferPriceRmb = !isPrice(this.conferPriceRmb)
            break
          case 'priceRmb':
            this.rules.priceRmb = !isPrice(this.priceRmb)
            break
          case 'salePriceRmb':
            this.rules.salePriceRmb = !isPrice(this.salePriceRmb)
            break
        }
      },
      itemInputChange(val) {
        let change = true
        for (let i = 0; i < this.itemCheck.length; i++) {
          if (val === this.itemCheck[i]) {
            change = false
            break
          }
        }
        if (change) {
          this.itemCheck.push(val)
        }
        if (this.itemCheckList.length === this.itemCheck.length) {
          this.itemAll = true
        }
      },
      setCalendarDayClear() {
        this.calendarDay = []
        this.hotelProductPriceId = []
      },
      setData(year, month, obj, week) {
        this.year = year
        this.month = month
        const _this = this
        if (obj.checked) {
          this.calendarDay.push([obj.data, week])
          if (obj.info) {
            const data = obj.info
            this.num = data.num
            this.conferPriceRmb = data.conferPrice
            this.priceRmb = data.price
            this.salePriceRmb = data.salePrice
            this.currency = data.currency // 货币类型
            this.startDay = data.startDay
            this.startNum = data.startNum
            this.state = data.state || 1
            this.itemCheck = _this.itemCheckList
            this.itemAll = true
            let calendarDay = obj.data
            if (month <= 9) {
              month = '0' + month
            }
            if (obj.data <= 9) {
              calendarDay = '0' + obj.data
            }
            this.hotelProductPriceId.push(year + '-' + month + '-' + calendarDay + ':' + data.id)
          }
        } else {
          for (let i = 0; i < this.calendarDay.length; i++) {
            if (this.calendarDay[i][0] === obj.data) {
              this.calendarDay.splice(i, 1)
              this.hotelProductPriceId.splice(i, 1)
            }
          }
        }
      },
      deletePrice() {
        if (this.hotelProductPriceId.length !== 0) {
          hotelProductPrice.del(this.hotelProductPriceId).then(res => {
            this.setCalendarDayClear()
            if (res && res.state === 'success') {
              this.$message.success('删除酒店产品价格成功')
              this.$refs.calendar.initData(this.year, this.month)
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          this.$message.error('请选择需要删除的日期')
        }
      },
      save() {
        for (const key in this.rules) {
          this.checkForm(key)
          if (this.rules[key]) {
            this.$message.error('请填写完整信息')
            return
          }
        }
        const day = []
        for (let i = 0; i < this.calendarDay.length; i++) {
          let calendarDay = this.calendarDay[i][0]
          let month = this.month
          if (month <= 9) {
            month = '0' + month
          }
          if (calendarDay <= 9) {
            calendarDay = '0' + calendarDay
          }
          day.push(this.year + '-' + month + '-' + calendarDay)
        }
        if (day.length === 0) {
          this.$message.error('请填选择日期')
          return
        }
        if (this.salePriceRmb <= this.priceRmb) {
          this.$confirm('您设置的零售价[' + this.salePriceRmb + ']小于或者等于分销价[' + this.priceRmb + ']，请确认是否要继续保存？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.saveCallBack(day)
          }).catch(() => {
          })
        } else {
          this.saveCallBack(day)
        }
      },
      saveCallBack(day) {
        const addHotelPriceVo = {
          priceDates: day,
          ids: this.hotelProductPriceId,
          hotelProductPrice: {
            productId: this.productId,
            conferPrice: this.conferPriceRmb,
            price: this.priceRmb,
            salePrice: this.salePriceRmb,
            stock: this.num,
            state: this.state
          }
        }
        hotelProductPrice.save(addHotelPriceVo).then(res => {
          this.setCalendarDayClear()
          if (res && res.state === 'success') {
            this.$message.success('保存酒店产品价格成功')
            this.$refs.calendar.initData(this.year, this.month)
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
</script>
<style>
  .InventoryAndPriceManageScope .inputError * {
    border: 1px solid red;
  }

  .block {
    width: 100%;
    border: 1px solid #ccc;
    margin-bottom: 20px;
  }

  .block thead th {
    text-align: left;
    background: #D2E0F0;
    padding: 10px;
  }

  .block tbody tr td:nth-of-type(odd):not([no]) {
    text-align: center;
    /*background: #EFF2F7;*/
    white-space: nowrap;
    width: 130px;
  }

  .block tbody tr td {
    padding: 10px;
  }

</style>
<style scoped>
  /*.InventoryAndPriceManageScope {*/
  /*padding: 20px;*/
  /*}*/

  .btm {
    margin-top: 20px;
  }

  .btm-left {
    margin-right: 20px;
  }

  .btm-left {
    width: 60%;
  }

  .btm-right {
    width: calc(40% - 20px);
  }

  .inventoryInstructions {
    background: #FFE9B2;
    color: #D9B04C;
    padding: 5px 20px;
    margin-bottom: 20px;
  }

  .inventoryInstructions span {
    font-weight: bold;
  }

  .check-yes {
    width: 20px;
    height: 23px;
    border: 1px solid white;
    border-radius: 5px;
    background: #20A0FF;
    display: inline-block;
    cursor: pointer;
  }

  .check-no {
    width: 20px;
    height: 20px;
    border: 1px solid #C0CCDA;
    border-radius: 5px;
    background: white;
    display: inline-block;
    cursor: pointer;
  }

  .check-yes i {
    color: white;
    transform: scale(0.5, 0.5) translateY(8px);
    transform-origin: 40% 30%;
  }
</style>
