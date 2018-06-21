<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="170px">
        <div class="title">
          {{$t('inventoryTransshipment.basicInformation')}}
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('ID')" >
              {{form.saasMerchantInfo.id}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.currencyType')" >
              {{form.saasMerchantInfo.currencyType}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.mchType')" >
              {{form.saasMerchantInfo.mchType === 1 ? '供应商' : '分销商'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item v-if="form.isManager" :label="$t('saasMerchantInfo.mchName')" prop="saasMerchantInfo.mchName" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]" >
              <el-input v-model="form.saasMerchantInfo.mchName" class="info-input"></el-input><!--:readonly="!form.isManager" -->
            </el-form-item>
            <el-form-item v-else :label="$t('saasMerchantInfo.mchName')" prop="saasMerchantInfo.mchDesc" >
              {{form.saasMerchantInfo.mchName}}
            </el-form-item>
          </el-col>
        </el-row>
      <el-main class="paperArea">
        <el-row class="title">
          {{$t('common.otherInformation')}}
        </el-row>
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item v-if="form.isManager" :label="$t('saasMerchantInfo.contactName')" prop="saasMerchantInfo.contactName" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]" >
              <el-input v-model="form.saasMerchantInfo.contactName" class="info-input"></el-input><!--:readonly="!form.isManager" -->
            </el-form-item>
            <el-form-item v-else :label="$t('saasMerchantInfo.contactName')" prop="saasMerchantInfo.mchDesc" >
              {{form.saasMerchantInfo.contactName}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="form.isManager" :label="$t('saasMerchantInfo.contactMobile')" prop="saasMerchantInfo.contactMobile" :rules="rules.contactMobile" >
              <el-input v-model="form.saasMerchantInfo.contactMobile" class="info-input"></el-input><!-- :readonly="!form.isManager"-->
            </el-form-item>
            <el-form-item v-else :label="$t('saasMerchantInfo.contactMobile')" prop="saasMerchantInfo.mchDesc" >
              {{form.saasMerchantInfo.contactMobile}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="form.isManager" :label="$t('saasMerchantInfo.contactPhone')" prop="saasMerchantInfo.contactPhone" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]" >
              <el-input v-model="form.saasMerchantInfo.contactPhone"  class="info-input"></el-input><!--:readonly="!form.isManager"-->
            </el-form-item>
            <el-form-item v-else :label="$t('saasMerchantInfo.contactPhone')" prop="saasMerchantInfo.mchDesc" >
              {{form.saasMerchantInfo.contactPhone}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item v-if="form.isManager" :label="$t('saasMerchantInfo.contactEmail')" prop="saasMerchantInfo.contactEmail" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]" >
              <el-input v-model="form.saasMerchantInfo.contactEmail" class="info-input"></el-input><!--:readonly="!form.isManager" -->
            </el-form-item>
            <el-form-item v-else :label="$t('saasMerchantInfo.contactEmail')" prop="saasMerchantInfo.mchDesc" >
              {{form.saasMerchantInfo.contactEmail}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="form.isManager" :label="$t('saasMerchantInfo.mchDesc')" prop="saasMerchantInfo.mchDesc" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]" >
              <el-input v-model="form.saasMerchantInfo.mchDesc"  class="info-input"></el-input><!--:readonly="!form.isManager"-->
            </el-form-item>
            <el-form-item v-else :label="$t('saasMerchantInfo.mchDesc')" prop="saasMerchantInfo.mchDesc" >
              {{form.saasMerchantInfo.mchDesc}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.saasId')" >
              {{form.saasMerchantInfo.saasId}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.state')" >
              {{form.saasMerchantInfo.state === 1 ? '正常' : '删除'}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.isWhitelist')" >
              {{form.saasMerchantInfo.isWhitelist === 1 ? '是' : '否'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.createDate')" >
              {{form.saasMerchantInfo.createDate | formatTimeFilter}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.modifyDate')" >
              {{form.saasMerchantInfo.modifyDate | formatTimeFilter}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.totalOrder')">
              {{form.saasMerchantInfo.mchType === 1 ? form.saasMerchantInfo.supplierTotalOrder : form.saasMerchantInfo.distributorTotalOrder}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.totalMoney')">
              {{form.saasMerchantInfo.mchType === 1 ? form.saasMerchantInfo.supplierTotalMoney : form.saasMerchantInfo.distributorTotalMoney}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.totalProduct')">
              {{form.saasMerchantInfo.mchType === 1 ? form.saasMerchantInfo.supplierTotalProduct : form.saasMerchantInfo.distributorTotalProduct}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.mchWithdrawFee')">
              {{form.saasMerchantInfo.mchWithdrawFee}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.isWithdraw')" v-if="form.saasMerchantInfo.mchType === 1">
              {{form.saasMerchantInfo.isWithdraw === 1 ? '允许提现' : '不允许提现'}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.isConfirmOrder')" v-if="form.saasMerchantInfo.mchType === 2">
              {{form.saasMerchantInfo.isConfirmOrder === 0 ? '禁止管理' : '允许管理'}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.isDisplayStock')" v-if="form.saasMerchantInfo.mchType === 2">
              {{form.saasMerchantInfo.isDisplayStock === 0 ? '禁止查看' : '允许查看'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.priceCodex')" >
              {{form.saasMerchantInfo.priceCodex}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('saasMerchantInfo.salePriceCodex')">
              {{form.saasMerchantInfo.salePriceCodex}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-main>
      <el-form-item v-if="form.isManager">
        <el-button type="primary" @click.native.prevent="update('form')">
          {{$t('saasInfo.confirmUpdate')}}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import merchantInfo from '@/api/merchant/merchantInfo'
  import { strIsPhone } from '@/utils/tools'
  export default {
    name: 'SaasMerchantInfo',
    data() {
      // 校验手机号
      const validatorStrIsPhone = (rule, value, callback) => {
        if (strIsPhone(value)) {
          callback()
        } else {
          callback(new Error(this.$t('请填写正确的手机号')))
        }
      }
      return {
        form: {
          isManager: 1,
          saasMerchantInfo: {}
        },
        loading: false,
        rules: {
          contactMobile: [
            { required: true, message: this.$t('common.isNull'), trigger: 'blur' },
            { validator: validatorStrIsPhone, message: this.$t('请填写正确的手机号'), trigger: 'blur' }
          ]
        }
      }
    },
    // 生命周期函数
    created() {
      // 是否管理员
      this.form.isManager = 0 // this.$store.getters.userInfo.isManager
      this.loadSaasMerchantInfo(this.$route.query.mchId)
    },
    computed: {
    },
    methods: {
      strIsPhoneFun(num) {
        return strIsPhone(num)
      },
      computePayServiceFees: function(fees) {
        const payServiceFees = this.$t('saasInfo.payServiceFees')
        let feesLabel = 'unknown'
        payServiceFees.forEach(ele => {
          if (ele.value === fees) {
            feesLabel = ele.label
          }
        })
        return feesLabel
      },
      loadSaasMerchantInfo(mchId) {
        merchantInfo.load(mchId).then(res => {
          if (res.state === 'success') {
            this.form.saasMerchantInfo = res.data
          }
        }).catch(e => {
          this.$message({
            type: 'error',
            message: '加载商户信息出错'
          })
        })
      },
      toOrderList() {
        this.$router.push('/order/hotelOrders/list')
      },
      update(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            merchantInfo.update(this.form.saasMerchantInfo).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                // 刷新当前界面
                location.reload()
              }
            }).catch(e => {
              this.$message({
                type: 'error',
                message: '保存失败'
              })
            })
          }
        })
      }
    }
  }
</script>

<style scope>
  .title {
    /*background: bisque;*/
    color: #555555;
    font-weight: bold;
    font-size: small;
    background-color: #D2E0F0;
    padding: 10px;
    border: 0px solid #D9B04C;
    margin-bottom: 15px;
    padding-left: 28px;
    background-position: 5px 5px;
  }
  .info-input{
    width: 400px;
  }
  .consistent-color {
    color:#606266;
  }
</style>
