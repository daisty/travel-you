<template>
  <div>
    <div class="cf setcal">
      <div class="fl setcal-a">
        <el-button type="text" @click="setCalendar(false);getData();setCalendarDayClear()"><i
          class="el-icon-caret-left"></i>{{month == 1 ? 12 : month - 1}}{{$t('calendar.month')}}
        </el-button>
      </div>
      <div class="fl setcal-b">{{year}}{{$t('calendar.year')}}{{month}}{{$t('calendar.month')}} &nbsp;
        <template>
        <el-checkbox v-model="checkedAll" @change="checkAll"></el-checkbox>
      </template>
      </div>
      <div class="fr setcal-a">
        <el-button type="text" @click="setCalendar(true);getData();setCalendarDayClear()">{{month == 12 ? 1 : month + 1}}{{$t('calendar.month')}}<i
          class="el-icon-caret-right"></i></el-button>
      </div>
    </div>
    <div class="tableHead cf">
      <div class="fl" v-for="(item,index) in weeks" :key="item.id">{{$t('calendar.' + item.zh)}}&nbsp;
        <template>
        <el-checkbox v-model="item.checked" @change="checkWeekAll(item, index)"></el-checkbox>
      </template>
      </div>
    </div>
    <div v-if="loadInitCalendar">
      <template>
        <el-table :data="calendarTable" border style="width: 100%" :show-header="false">
          <el-table-column v-for="(item, index) in weeks" :key="item.id">
            <template slot-scope="scope">
              <div class="calendar-item" v-if="scope.row[item.en].data">
                <div class="cf">
                  <div class="fl">{{scope.row[item.en].data}}</div>
                  <div class="fr" v-if="checkTodayDateLater(year+'-'+month+'-'+scope.row[item.en].data)<=0">
                    <template>
                      <el-checkbox v-model="scope.row[item.en].checked"
                                   @change="checkDay(index,scope.$index);setData(year, month, scope.row[item.en],item.en)"></el-checkbox>
                    </template>
                  </div>
                </div>
                <div class="calendar-item-invenroty" v-if="scope.row[item.en].info.show"
                     :style="{color: checkTodayDateLater(year+'-'+month+'-'+scope.row[item.en].data)<=0 ? '#1D8CE0' : '#8492A6'}">
                  <p>{{$t('calendar.conferPrice')}}：{{scope.row[item.en].info.conferPrice}}</p>
                  <p>{{$t('calendar.price')}}：{{scope.row[item.en].info.price}}</p>
                  <p>{{$t('calendar.salePrice')}}：{{scope.row[item.en].info.salePrice}}</p>
                  <p>{{$t('calendar.num')}}：{{scope.row[item.en].info.saleNum}}/{{scope.row[item.en].info.num}}</p>
                </div>
                <div class="calendar-item-invenroty" v-else style="opacity: 0">
                  <p>{{$t('calendar.conferPrice')}}：999</p>
                  <p>{{$t('calendar.price')}}：999</p>
                  <p>{{$t('calendar.salePrice')}}：999</p>
                  <p>{{$t('calendar.num')}}：0/0</p>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div v-else>
      <load :h="50"></load>
    </div>
  </div>
</template>

<script>
  import hotelProductPrice from '@/api/product/hotelProductPrice'
  function initCalendar(year, month) {
    var monthFirstDay = new Date(year, month - 1, 1)
    var firstDay = monthFirstDay.getDay() // 返回本月1号是星期几
    var monthLastDay = new Date(year, month, 0)
    var lastDay = monthLastDay.getDate()// 返回本月共有多少天,同时避免复杂的判断润年不润年
    var week = ['seven', 'one', 'two', 'three', 'four', 'five', 'six']
    var weekIndex = 0
    var dateList = []
    var dateData = {}
    var dateDataTemp = {}
    for (var i = 1; i <= 42; i++) {
      weekIndex++
      dateDataTemp = {}
      if (firstDay < i && i <= (lastDay + firstDay)) {
        const date = i - firstDay
        dateDataTemp.data = date// 几号对应星期几 o
        dateDataTemp.checked = false
      } else {
        dateDataTemp.data = false// 没数据
      }
      dateDataTemp.info = {
        show: false,
        conferPrice: '',
        price: '',
        salePrice: '',
        num: '',
        saleNum: '',
        id: ''
      }
      dateData[week[(weekIndex - 1) % 7]] = dateDataTemp
      if (i % 7 === 0) { // 新的一周
        dateList.push(dateData)
        dateData = {}
        weekIndex = 0
      }
    }
    let ifPop = true
    for (const key in dateList[5]) {
      // 日历第六行有数据
      if (dateList[5][key].data) {
        ifPop = false
        break
      }
    }
    ifPop ? dateList.pop() : ''
    return dateList
  }

  export default {
    props: ['productId'],
    name: 'Calendar',
    data() {
      return {
        infoId: '',
        loadInitCalendar: false,
        calendarTable: [{
          seven: { data: '', checked: false },
          one: { data: '', checked: false },
          two: { data: '', checked: false },
          three: { data: '', checked: false },
          four: { data: '', checked: false },
          five: { data: '', checked: false },
          six: { data: '', checked: false }
        }],
        year: 0,
        month: 0,
        checkedAll: false,
        checkedAllLen: 0,
        checkedAllNum: 0,
        weeks: [
          { id: '7', en: 'seven', zh: 'sunday', checked: false, checkedNum: 0, checkedLen: 0 },
          { id: '1', en: 'one', zh: 'monday', checked: false, checkedNum: 0, checkedLen: 0 },
          { id: '2', en: 'two', zh: 'tuesday', checked: false, checkedNum: 0, checkedLen: 0 },
          { id: '3', en: 'three', zh: 'wednesday', checked: false, checkedNum: 0, checkedLen: 0 },
          { id: '4', en: 'four', zh: 'thursday', checked: false, checkedNum: 0, checkedLen: 0 },
          { id: '5', en: 'five', zh: 'friday', checked: false, checkedNum: 0, checkedLen: 0 },
          { id: '6', en: 'six', zh: 'saturday', checked: false, checkedNum: 0, checkedLen: 0 }
        ]
      }
    },
    methods: {
      checkTodayDateLater(sDate2) { // sDate1和sDate2是2006-12-18格式
        var date = new Date()
        var sDate1 = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        var aDate, oDate1, oDate2, iDays
        aDate = sDate1.split('-')
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])// 转换为12-18-2006格式
        aDate = sDate2.split('-')
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
        iDays = parseInt((oDate1 - oDate2) / 1000 / 60 / 60 / 24)// 把相差的毫秒数转换为天数
        return iDays
      },
      setCalendar(w) {
        if (w) {
          if (this.month === 12) {
            this.month = 1
            this.year++
          } else {
            this.month++
          }
        } else {
          if (this.month === 1) {
            this.month = 12
            this.year--
          } else {
            this.month--
          }
        }
        this.calendarTable = initCalendar(this.year, this.month)
        this.setCheckedLen()
        this.$emit('setCalendarDayClear')
      },
      // 每个复选框
      checkDay(x, y) {
        const week = this.weeks[x]
        this.calendarTable[y][week.en].checked ? week.checkedNum++ : week.checkedNum--
        this.calendarTable[y][week.en].checked ? this.checkedAllNum++ : this.checkedAllNum--
        week.checked = week.checkedNum === week.checkedLen
        this.checkedAll = this.checkedAllNum === this.checkedAllLen
      },
      // 全选
      checkAll() {
        this.checkedAllNum = this.checkedAll ? this.checkedAllLen : 0
        for (let j = 0; j < this.weeks.length; j++) {
          const week = this.weeks[j]
          week.checked = this.checkedAll
          week.checkedNum = week.checked ? week.checkedLen : 0
        }
        for (let i = 0; i < this.calendarTable.length; i++) {
          const obj = this.calendarTable[i]
          for (const key in obj) {
            if (obj[key].data) {
              obj[key].checked = this.checkedAll
            }
          }
        }
        const _this = this
        this.calendarTable.forEach(function(value, index) {
          const week = ['seven', 'one', 'two', 'three', 'four', 'five', 'six']
          week.forEach(item => {
            if (value[item].data) {
              if (_this.checkTodayDateLater(_this.year + '-' + _this.month + '-' + value[item].data) <= 0) {
                _this.setData(_this.year, _this.month, value[item], item)
              }
            }
          })
        })
      },
      // 周x全选
      checkWeekAll(item, index) {
        const week = this.weeks[index]
        week.checked ? this.checkedAllNum += (week.checkedLen - week.checkedNum) : this.checkedAllNum -= week.checkedLen
        week.checkedNum = week.checked ? week.checkedLen : 0
        this.checkedAll = this.checkedAllNum === this.checkedAllLen
        for (let i = 0; i < this.calendarTable.length; i++) {
          this.calendarTable[i][week.en].checked = week.checked
        }
        const _this = this
        this.calendarTable.forEach(function(value, index) {
          if (_this.checkTodayDateLater(_this.year + '-' + _this.month + '-' + value[item.en].data) <= 0) {
            _this.setData(_this.year, _this.month, value[item.en], item.en)
          }
        })
      },
      // 周有多少个 用于全选
      setCheckedLen() {
        const tempObj = {
          seven: { checkedLen: 0 },
          one: { checkedLen: 0 },
          two: { checkedLen: 0 },
          three: { checkedLen: 0 },
          four: { checkedLen: 0 },
          five: { checkedLen: 0 },
          six: { checkedLen: 0 }
        }
        const _this = this
        let checkedAllLen = 0
        let flag = false
        for (let i = 0; i < this.calendarTable.length; i++) {
          const obj = this.calendarTable[i]
          for (const key in obj) {
            if (!flag) {
              if (_this.checkTodayDateLater(_this.year + '-' + _this.month + '-' + obj[key].data) <= 0) {
                flag = true
              }
            }
            if (obj[key].data && flag) {
              tempObj[key].checkedLen++
              checkedAllLen++
            }
          }
        }
        this.checkedAllLen = checkedAllLen
        this.checkedAllNum = 0
        this.checkedAll = false
        for (let j = 0; j < this.weeks.length; j++) {
          const week = this.weeks[j]
          week.checkedLen = tempObj[this.weeks[j].en].checkedLen
          week.checked = false
          week.checkedNum = 0
        }
      },
      getData(infoid) {
        if (infoid) {
          this.infoId = infoid
        }
        const week = ['seven', 'one', 'two', 'three', 'four', 'five', 'six']
        hotelProductPrice.list(this.productId, this.year, this.month).then(res => {
          if (!res || !res.priceValueMap) {
            this.loadInitCalendar = true
            return
          }
          const result = res.priceValueMap
          const _this = this
          if (result) {
            // 遍历result数组
            for (const key in result) {
              const priceDate = Number(key.split('-')[2])
              _this.calendarTable.forEach(function(value, index) {
                week.forEach(item => {
                  if (value[item].data && value[item].data === priceDate) {
                    value[item].info = {
                      show: true,
                      id: result[key].id,
                      conferPrice: result[key].conferPrice,
                      price: result[key].price,
                      salePrice: result[key].salePrice,
                      num: result[key].totalNum,
                      saleNum: result[key].saleNum,
                      startDay: result[key].minDays,
                      startNum: result[key].minRoomNum,
                      state: result[key].state,
                      currency: result[key].currency // 货币类型
                    }
                  }
                })
              })
            }
          }
          this.loadInitCalendar = true
        })
      },
      setData(year, month, obj, week) {
        this.$emit('setData', year, month, obj, week)
      },
      setCalendarDayClear() {
        this.$emit('setCalendarDayClear')
      },
      initData(year, month) {
        this.calendarTable = initCalendar(year, month)
        this.setCheckedLen()
        this.getData()
      }
    },
    mounted() {
      var date = new Date()// 系统时间对象
      this.year = date.getFullYear()// 完整的年份,千万不要使用getYear,firfox不支持
      this.month = date.getMonth() + 1// 注意获取的月份比实现的小1
      this.calendarTable = initCalendar(this.year, this.month)
      this.setCheckedLen()
      this.getData()
    }
  }
</script>

<style scoped>
  .setcal {
    line-height: 20px;
    border: 1px solid #D3DCE6;
    line-height: 50px;
  }

  .setcal-a {
    text-align: center;
    width: 20%;
  }

  .setcal-b {
    width: 60%;
    text-align: center;
    border-right: 1px solid #D3DCE6;
    border-left: 1px solid #D3DCE6;
  }

  .calendar-item {
    padding: 5px;
  }

  .calendar-item-invenroty {
    font-size: 12px;
  }

  .tableHead div {
    width: calc(100% / 7);
    text-align: center;
    line-height: 3;
    background: #eef1f6;
    font-weight: bold;
  }

  p {
    margin: 0;
    padding: 0;
  }
</style>
