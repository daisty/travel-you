<template>
  <div style="display:inline-block;">
    <el-select :disabled="this.disabled" v-model="supplier" clearable :style="{width:width+'px'}" @change="changeSupplier" size="small" filterable
               :placeholder="$t('addProduct.pleaseSelect',{name:''})"><!--remote :remote-method="queryMerchantInfo"-->
      <el-option
        v-for="item in suppliers"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <!--<el-input v-model="keywords" size="small" style="width:165px;"
              :placeholder="$t('addProduct.pleaseEnter',{name:$t('addProduct.keywords')})"></el-input>
    <el-button class="queryButton" type="primary" size="small" @click="queryMerchantInfo">{{$t('addProduct.retrieveSupplier')}}
    </el-button>-->
  </div>
</template>
<script>
  import SupplierAreaInfo from '@/api/merchant/merchantInfo'
  export default {
    name: 'SelectSupplier',
    props: {
      width: [String],
      initSupplier: [Number, String],
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        suppliers: [{ value: -1, label: '请选择供应商' }],
        supplier: -1,
        keywords: ''
      }
    },
    watch: {
      initSupplier: function(val) {
        this.supplier = val
      }
    },
    created() {
      this.initData()
    },
    methods: {
      // 改变供应商
      changeSupplier(id) {
        this.$emit('getSupplier', { id })
      },
      // 初始化供应商列表数据
      initData() {
        SupplierAreaInfo.queryMerchantInfo().then(res => {
          const results = res.results || []
          if (results && results.length) {
            for (let i = 0; i < results.length; i++) {
              const ele = {
                value: results[i].id,
                label: results[i].mchName
              }
              this.suppliers.push(ele)
            }
          }
        })
      },
      // 定位供应商
      queryMerchantInfo(keywords) {
        this.suppliers = []
        this.supplier = ''
        SupplierAreaInfo.queryMerchantInfo(keywords).then(results => {
          const arr = []
          // const results = res.results
          if (results && results.length) {
            for (let i = 0; i < results.length; i++) {
              const ele = {
                value: results[i].id,
                label: results[i].mchName
              }
              arr.push(ele)
            }
            this.suppliers = arr
          }
        })
      }
    }
  }
</script>
