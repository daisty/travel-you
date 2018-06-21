<template>
  <span>
    <!--<el-form :model="areaData" >-->
      <!--<el-form-item :label="$t('addHotelProduct.hotelArea')">-->
        <el-select v-model="areaData.country" @change="getProvinces" size="small" style="width: 140px;"
                   :placeholder="$t('addHotelProduct.promptCountry')" filterable :disabled="readOnly">
          <el-option
            v-for="item in countries"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="areaData.province" @change="getCities" size="small" :disabled="readOnly" style="width: 150px;"
                   :placeholder="$t('addHotelProduct.promptProvince')" filterable>
          <el-option
            v-for="item in provinces"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="areaData.city" size="small" @change="getAreasAndZones" :disabled="readOnly" style="width: 150px;"
                   :placeholder="$t('addHotelProduct.promptCity')"
                   :loading="cityLoading" filterable>
          <el-option
            v-for="item in cities"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="areaData.area" @change="changeAreas" size="small" :disabled="readOnly" style="width: 150px;"
                   :placeholder="$t('addHotelProduct.promptArea')" v-if="areas.length" filterable>
          <el-option
            v-for="item in areas"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="areaData.zone" @change="changeZones" size="small" :disabled="readOnly"
                   :placeholder="$t('addHotelProduct.promptZone')" v-if="zones.length && needZone" filterable>
          <el-option
            v-for="item in zones"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      <!--</el-form-item>-->
    <!--</el-form>-->
  </span>
</template>
<script>
  /**
   * :needZone="true"  -- 是否需要商圈
   * :readOnly="false"  -- 是否只读
   * ref="selectArea" -- 给父组件提供地区组件的引用
   * // 手动调用子组件方法传值
   * this.$refs['selectArea'].getForRead(this.initAreaId) -- 在mounted 钩子内调用
   */
  import areaInfo from '@/api/openapi/areaInfo'
  export default {
    name: 'SelectArea',
    props: ['needZone', 'initAreaId', 'readOnly'],
    watch: {
      initAreaId(curVal, oldVal) {
      }
    },
    mounted() {
    },
    data() {
      return {
        countries: [],
        provinces: [],
        provinceLoading: false,
        cities: [],
        cityLoading: false,
        areas: [],
        zones: [], // 商圈数据
        areaData: {
          country: '',
          province: '',
          area: '',
          city: '',
          zone: '',
          currentHotel: '',
          currentHotelAddress: '',
          defaultProvince: '',
          defaultCity: '',
          defaultArea: ''
        }
      }
    },
    created() {
      this.initData()
    },
    methods: {
      // 初始地址国家列表数据
      getForRead(areaId) {
        areaInfo.listForSelectView(areaId).then(res => {
          const results = res || {}
          const area0 = results.area0 // 选中国家
          // const areaInfos0 = results.areaInfos0 // 所有国家
          const area1 = results.area1 // 选中省份
          const areaInfos1 = results.areaInfos1 // 所有省份
          const area2 = results.area2 // 选中城市
          const areaInfos2 = results.areaInfos2 // 所有城市
          const area3 = results.area3 // 选中区域
          const areaInfos3 = results.areaInfos3 // 所有区域

          // all
          const d = {
            value: -2,
            label: '全部'
          }
          // 显示国家 -- 国家选项在创建时已经初始化过一次
          if (area0) {
            this.areaData.country = area0.id
            // 如果下级为空，把下级也赋值上
            if (!area1) {
              this.provinces = this.createdSelectItem(areaInfos1)
              this.provinces.unshift(d)
            }
          }
          // 显示省份
          if (area1) {
            this.provinces = this.createdSelectItem(areaInfos1)
            this.provinces.unshift(d)
            this.areaData.province = area1.id
            // 如果下级为空，把下级也赋值上
            if (!area2) {
              this.cities = this.createdSelectItem(areaInfos2)
              this.cities.unshift(d)
            }
          }
          // 显示城市
          if (area2) {
            this.cities = this.createdSelectItem(areaInfos2)
            this.cities.unshift(d)
            this.areaData.city = area2.id
            // 如果下级为空，把下级也赋值上
            if (!area3) {
              this.areas = this.createdSelectItem(areaInfos3)
              this.areas.unshift(d)
            }
          }
          // 显示区域
          if (area3) {
            this.areas = this.createdSelectItem(areaInfos3)
            this.areas.unshift(d)
            this.areaData.area = area3.id
          }
        })
      },
      createdSelectItem(items) {
        const arr = []
        if (items && items.length > 0) {
          items.forEach(row => {
            arr.push({
              label: row.areaName,
              value: row.id
            })
          })
        }
        return arr
      },
      // 初始地址国家列表数据
      initData() {
        this.getCountries()
      },
      // 校验id是否为空
      isNull(areaId) {
        return !areaId || areaId.length === 0 || areaId === -2 // -2为约定的空值
      },
      // 改变地址
      changeAreaId(id) {
        let provideId = ''
        let name = ''
        if (!this.isNull(this.areaData.zone)) {
          provideId = this.areaData.zone
          name = 'zone'
        } else if (!this.isNull(this.areaData.area)) {
          provideId = this.areaData.area
          name = 'area'
        } else if (!this.isNull(this.areaData.city)) {
          provideId = this.areaData.city
          name = 'city'
        } else if (!this.isNull(this.areaData.province)) {
          provideId = this.areaData.province
          name = 'province'
        } else if (!this.isNull(this.areaData.country)) {
          provideId = this.areaData.country
          name = 'country'
        }
        id = provideId
        console.log('选择的区域是：' + name)
        this.$emit('getAreaId', { id })
      },
      getCountries() {
        this.initAreaData('country')
        this.countries = this.areaDataChange()
      },
      getProvinces() {
        this.provinceLoading = true
        const id = this.areaData.country
        this.initAreaData('province')
        this.provinces = this.areaDataChange(id)
        this.provinceLoading = false
      },
      getCities() {
        this.cityLoading = true
        const id = this.areaData.province
        this.initAreaData('city')
        this.cities = this.areaDataChange(id)
        this.cityLoading = false
      },
      changeAreas() {
        // this.initAreaData('area')
        const id = this.areaData.zone ? this.areaData.zone : this.areaData.area
        this.changeAreaId(id)
        // this.zones =  this.areaDataChange(id)
      },
      changeZones() {
        this.changeAreaId(this.areaData.zone)
      },
      getAreasAndZones() {
        const id = this.areaData.city
        this.initAreaData('area')
        this.cityDataChange(id)
      },
      areaDataChange(id) {
        this.changeAreaId(id)
        const arr = []
        const ele = {
          value: -2,
          label: '全部'
        }
        arr.push(ele)
        areaInfo.listForSelect(id).then(res => {
          const results = res ? res.results : []
          if (res && results && results.length) {
            for (let i = 0; i < results.length; i++) {
              const ele = {
                value: results[i].id,
                label: results[i].areaName
              }
              arr.push(ele)
            }
          }
        })
        return arr
      },
      // 市改变时，是要同时获取商圈、区域列表
      cityDataChange(id) {
        this.changeAreaId(id)
        const all = {
          value: -2,
          label: '全部'
        }
        areaInfo.getZoneAndAreaForSelect(id).then(res => {
          if (res && res.areaList && res.areaList.results && res.areaList.results.length) {
            for (let i = 0; i < res.areaList.results.length; i++) {
              const ele = {
                value: res.areaList.results[i].id,
                label: res.areaList.results[i].areaName
              }
              this.areas.push(ele)
            }
            this.areas.unshift(all)
          }
          if (res && res.zoneList && res.zoneList.results && res.zoneList.results.length) {
            for (let i = 0; i < res.zoneList.results.length; i++) {
              const ele = {
                value: res.zoneList.results[i].id,
                label: res.zoneList.results[i].areaName
              }
              this.zones.push(ele)
            }
            this.zones.unshift(all)
          }
        })
      },
      initAreaData(type) {
        if (type === 'country') {
          this.areaData.country = ''
          this.areaData.province = ''
          this.areaData.city = ''
          this.areaData.area = ''
          this.countries = []
          this.provinces = []
          this.cities = []
          this.areas = []
          this.zones = []
        } else if (type === 'province') {
          this.areaData.province = ''
          this.areaData.city = ''
          this.areaData.area = ''
          this.provinces = []
          this.cities = []
          this.areas = []
          this.zones = []
        } else if (type === 'city') {
          this.areaData.city = ''
          this.areaData.area = ''
          this.cities = []
          this.areas = []
          this.zones = []
        } else if (type === 'area') {
          this.areaData.area = ''
          this.areaData.zone = ''
          this.areas = []
          this.zones = []
        } else {
          this.areaData.area = ''
          this.areas = []
        }
      }
    }
  }
</script>
<style scoped>
  .el-form-item{
    margin-bottom: 0;
  }
</style>
