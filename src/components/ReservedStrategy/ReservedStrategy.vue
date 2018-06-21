<!--酒店产品预定政策-->
<template>
  <span>
    <span v-if="hotelProduct.saleStartDate && hotelProduct.saleStopDate">
      开售时间段为:{{hotelProduct.saleStartDate | formatTimeFilter('{y}年{m}月{d}日')}}
      到{{hotelProduct.saleStartDate | formatTimeFilter('{y}年{m}月{d}日')}}<br/>
    </span>

    <span v-if="ConfirmTypes && ConfirmTypes.length > 0 && hotelProduct.confirmType != 0">
      确认类型:{{ConfirmTypes[hotelProduct.confirmType].name}}<br/>
    </span>

    <!--1440分钟代表一天-->
    <span v-if="(hotelProduct.minAdvMinutes < 1440 && hotelProduct.minAdvMinutes > 0) &&
        (hotelProduct.maxAdvMinutes < 1440 && hotelProduct.maxAdvMinutes > 0)">
      当日 {{hotelProduct.maxAdvMinutes | getDate}} 到 {{hotelProduct.minAdvMinutes | getDate}}  之间可预订<br/>
    </span>
    <span v-else-if="hotelProduct.minAdvMinutes !=0 && hotelProduct.maxAdvMinutes !=0">
      <span v-if="hotelProduct.maxAdvMinutes < 0">
        必须提前在: {{hotelProduct.minAdvMinutes | getHour}} 到第二天 {{ Math.abs(hotelProduct.maxAdvMinutes /60)}} 点预定,超过范围无效<br/>
      </span>
      <span v-else>
        必须提前在: {{hotelProduct.minAdvMinutes | getHour}} 到 {{hotelProduct.maxAdvMinutes | getHour}}  内预定,超过范围无效<br/>
      </span>
    </span>
    <span v-else-if="hotelProduct.minAdvMinutes !=0 && hotelProduct.maxAdvMinutes ===0">
      必须至少提前在 {{hotelProduct.minAdvMinutes | getHour}} 预定<br/>
    </span>
    <span v-else-if="hotelProduct.maxAdvMinutes !=0 && hotelProduct.minAdvMinutes ===0">
      <span v-if="hotelProduct.maxAdvMinutes < 0">
        必须最多提前在第二天 {{ Math.abs(hotelProduct.maxAdvMinutes/60 )}} "点预定<br/>
      </span>
      <span v-else-if="hotelProduct.minAdvMinutes !=0 && hotelProduct.maxAdvMinutes ===0">
        必须至少提前在{{hotelProduct.minAdvMinutes | getHour}} 预定<br/>
      </span>
    </span>

    <span v-if="hotelProduct.weekLimit">
      每周可售时间段为: {{hotelProduct.weekLimit | getWeekLimt}}<br/>
    </span>

    <span v-if="hotelProduct.dayStartTime && hotelProduct.dayEndTime">
      每日售卖时间段为: {{hotelProduct.dayStartTime | formatTimeFilter('{h}:{i}:{s}')}}  到 {{hotelProduct.dayEndTime | formatTimeFilter('{h}:{i}:{s}')}}<br/>
    </span>
    <span v-if="hotelProduct.arrivalStartTime && hotelProduct.arrivalEndTime">
      客人到店时间段为: {{hotelProduct.arrivalStartTime | formatTimeFilter('{h}:{i}:{s}')}} 到 {{hotelProduct.arrivalEndTime | formatTimeFilter('{h}:{i}:{s}')}}<br/>
    </span>
    <span v-if="hotelProduct.minDays != 0 && hotelProduct.maxDays === 0">
      最小入住天数: {{hotelProduct.minDays}}天<br/>
    </span>
    <span v-else-if="hotelProduct.maxDays != 0 && hotelProduct.minDays === 0">
      最大入住天数: {{hotelProduct.maxDays}})天<br/>
    </span>
    <span v-else-if="hotelProduct.maxDays != 0 && hotelProduct.minDays != 0">
      入住天数为: {{hotelProduct.minDays}} 到 {{hotelProduct.maxDays}}天<br/>
    </span>

    <span v-if="hotelProduct.minRoomNum != 0 && hotelProduct.maxRoomNum == 0">
      最小预定房间: {{hotelProduct.minRoomNum}}间<br/>
    </span>
    <span v-else-if="hotelProduct.maxRoomNum != 0 && hotelProduct.minRoomNum == 0">
      最大预定房间: {{hotelProduct.maxRoomNum}})间<br/>
    </span>
    <span v-else-if="hotelProduct.minRoomNum != 0 && hotelProduct.maxRoomNum != 0">
      预定房间数为: {{hotelProduct.minRoomNum}} 到 {{hotelProduct.maxRoomNum}}间<br/>
    </span>
    <span v-if="hotelProduct.cancelType && hotelProduct.cancelType != 0">
      取消政策 <span v-if="hotelProduct.cancelType === 1">允许</span>
      <span v-if="hotelProduct.cancelType === -1">不允许</span>
      <br/>
    </span>
    <span v-if="hotelProduct.cancelAdvMinutes != 0">
      需要提前{{hotelProduct.cancelAdvMinutes | getHour }}取消,过期无效<br/>
    </span>
  </span>
</template>

<script>
    export default {
      name: 'ReserveStrategy',
      data() {
        return {
          ConfirmTypes: [],
          CancelTypes: []
        }
      },
      props: {
        hotelProduct: {
          type: Object,
          require: true
        }
      },
      methods: {
        initData() {
          this.getCancelTypeList()
          this.getConfirmTypes()
        },
        // 获取确认类型枚举
        getConfirmTypes() {
          this.$store.dispatch('getConfirmTypeList').then(res => {
            this.confirmTypes = res
          })
        },
        // 获取取消类型枚举
        getCancelTypeList() {
          this.$store.dispatch('getCancelTypeList').then(res => {
            this.CancelTypes = res
          })
        }
      },
      created() {
        this.initData()
      },
      filters: {
        // 将分钟数转化为时分(还有多少时间预定有效),再24时减去它获得有效的时间段
        getDate(minutes) {
          let hour = Math.floor(minutes / 60)
          let minute = Math.floor(minutes % 60)
          if (minute === 0) {
            minute = 60
          } else {
            hour = hour + 1
          }
          return (24 - hour) + '点' + ((60 - minute) === 0 ? '00' : (60 - minute)) + '分'
        },
        // 将分钟改为时分
        getHour(minutes) {
          const hour = Math.abs(Math.floor(minutes / 60))
          const minute = Math.abs(Math.floor(minutes % 60))
          if (minute === 0) {
            return `${hour}小时`
          }
          return `${hour}小时${minute}分钟`
        },
        getWeekLimt(str) {
          const weekDays = ['日', '一', '二', '三', '四', '五', '六']
          const weeks = str.split(',')
          let s = '星期'
          weeks.forEach(function(item) {
            s += (weekDays[Math.abs(item)] + '/ ')
          })
          return s.substring(0, s.lastIndexOf('/'))
        }
      }
    }
</script>

<style scoped>

</style>
