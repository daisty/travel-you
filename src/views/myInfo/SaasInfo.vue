<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="250px" size="small" >
      <div class="title">
        系统基本信息
      </div>
      <el-row>
          <el-col :span=12>
            <el-form-item :label="$t('saasInfo.id')" >
              {{form.saasInfo.id}}
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <el-form-item :label="$t('saasInfo.webSite')" >
              {{form.saasInfo.webSite}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter=0>
          <el-col :span=12>
            <el-form-item :label="$t('saasInfo.saasName')" prop="saasInfo.saasName" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]" >
              <el-input v-model="form.saasInfo.saasName" :readonly="!form.isManager"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.logo')" >
              <img class="user-avatar" :src="form.saasInfo.saasLogo + '?imageView2/1/w/150/h/100'">
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.openDate')" >
              {{ form.saasInfo.openDate | formatTimeFilter}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.expirationDate')" >
              {{ form.saasInfo.expirationDate | formatTimeFilter}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.feePayService')" >
              {{ form.saasInfo.feePayService}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.feeCreditService')" >
              {{ form.saasInfo.feeCreditService}}
            </el-form-item>
          </el-col>
        </el-row>
        <div class="title">企业信息</div>
        <el-row :gutter=0>
          <el-col :span=12>
            <el-form-item :label="$t('saasInfo.companyName')" >
              {{form.saasInfo.companyName}}
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <el-form-item :label="$t('saasInfo.companyId')" >
              {{form.saasInfo.companyId}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span=12>
            <el-form-item :label="$t('saasInfo.contactName')" prop="saasInfo.contactName" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]" >
              <el-input v-model="form.saasInfo.contactName" :readonly="!form.isManager"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <el-form-item :label="$t('saasInfo.contactPhone')" prop="saasInfo.contactPhone" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]" >
              <el-input v-model="form.saasInfo.contactPhone" :readonly="!form.isManager"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.contactFax')" prop="saasInfo.contactFax" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]" >
              <el-input v-model="form.saasInfo.contactFax" :readonly="!form.isManager"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.contactMobile')" prop="saasInfo.contactMobile" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]" >
              <el-input v-model="form.saasInfo.contactMobile" :readonly="!form.isManager"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.contactQq')" prop="saasInfo.contactQq" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]" >
              <el-input v-model="form.saasInfo.contactQq" :readonly="!form.isManager"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.contactEmail')" prop="saasInfo.contactEmail" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]" >
              <el-input v-model="form.saasInfo.contactEmail" :readonly="!form.isManager"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.contactAddress')" prop="saasInfo.contactAddress" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]" >
              <el-input v-model="form.saasInfo.contactAddress" :readonly="!form.isManager"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="title">
          支付宝账户信息
        </div>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.alipayAccountName')" prop="saasInfo.alipayAccountName" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]">
              <el-input v-model="form.saasInfo.alipayAccountName" :readonly="!form.isManager"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.alipayAccount')" >
              {{form.saasInfo.alipayAccount}}
            </el-form-item>
          </el-col>
        </el-row>
        <div class="title">
          银行账户信息
        </div>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.bankAccount')" >
              {{form.saasInfo.bankAccount}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.bankAccountName')" >
              {{form.saasInfo.bankAccountName}}
            </el-form-item>
          </el-col>
        </el-row>
        <div class="title">
          商户注册设定
        </div>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.mchDefaultGrade')" prop="saasInfo.mchDefaultGrade" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]">
              <el-select v-model="form.saasInfo.mchDefaultGrade" placeholder="请选择" :disabled="!form.isManager" size="small">
                <el-option
                  v-for="item in form.mchDefaultGrades"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.mchWithdrawMinMoney')" >
              {{form.saasInfo.mchWithdrawMinMoney}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.mchMaxCredit')" >
              {{form.saasInfo.mchMaxCredit}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.mchWithdrawFee')" prop="saasInfo.mchWithdrawFee" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]">
              <el-select v-model="form.saasInfo.mchWithdrawFee" placeholder="请选择" :disabled="!form.isManager" size="small">
                <el-option
                  v-for="item in $t('saasInfo.mchWithdrawFees')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!--{{computeMchWithdrawFee(form.saasInfo.mchWithdrawFee)}}-->
            </el-form-item>
          </el-col>
        </el-row>
        <div class="title">
          其他信息
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.saasType')" prop="saasInfo.saasType" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]">
              <el-select v-model="form.saasInfo.saasType" placeholder="请选择" :disabled="!form.isManager" size="small">
                <el-option
                  v-for="item in $t('saasInfo.saasTypes')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!--{{computeType(form.saasInfo.saasType)}}-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.saasCurrency')" >
              {{form.saasInfo.saasCurrency}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.saasLang')" >
              {{form.saasInfo.saasLang}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.saasDomain')" >
              {{form.saasInfo.saasDomain}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.supportBdInfo')" >
              {{form.saasInfo.supportBdInfo}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.supportOpInfo')" >
              {{form.saasInfo.supportOpInfo}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.supportOaInfo')" >
              {{form.saasInfo.supportOaInfo}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.paymentMode')" prop="saasInfo.paymentMode" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]">
              <el-select v-model="form.saasInfo.paymentMode" placeholder="请选择" :disabled="!form.isManager" size="small">
                <el-option
                  v-for="item in $t('saasInfo.paymentModes')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!--{{computePayMode(form.saasInfo.paymentMode)}}-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.settleTypes')" >
              {{form.saasInfo.settleTypes}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.createDate')" >
              {{ form.saasInfo.createDate | formatTimeFilter}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('saasInfo.state')" prop="saasInfo.state" :rules="[
                        { required: true, message: $t('common.isNull'), trigger: 'blur' }]">
              <el-select v-model="form.saasInfo.state" placeholder="请选择" :disabled="!form.isManager" size="small">
                <el-option
                  v-for="item in $t('saasInfo.states')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!--{{computeState(form.saasInfo.state)}}-->
            </el-form-item>
          </el-col>
        </el-row>
      <el-form-item v-if="form.isManager">
        <el-button type="primary" @click.native.prevent="update('form')">
          {{$t('saasInfo.confirmUpdate')}}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import saasInfoApi from '@/api/myInfo/saasInfo'
  import saasDistributorGradeAPI from '@/api/pricePolicy/saasDistributorGrade'
  export default {
    name: 'SaasInfo',
    data() {
      return {
        form: {
          mchDefaultGrades: [],
          isManager: true,
          saasInfo: {}
        },
        loading: false,
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif' // 模拟logo
      }
    },
    // 生命周期函数
    created() {
      // 是否管理员
      this.form.isManager = this.$store.getters.userInfo.isManager
      this.loadSaasInfo()
      this.loadGradeList()
    },
    computed: {
    },
    methods: {
      update(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            saasInfoApi.update(this.form.saasInfo).then(res => {
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
      },
      // 获取运营商信息
      loadSaasInfo() {
        saasInfoApi.load().then(res => {
          this.form.saasInfo = res || {}
        }).catch(e => {
          this.$message({
            type: 'error',
            message: '加载运营商信息出错'
          })
        })
      },
      // 获取分销等级
      loadGradeList() {
        saasDistributorGradeAPI.listForSelect().then(res => {
          if (res && res.length > 0) {
            const arr = []
            res.forEach(row => {
              const d = {
                value: row.id,
                label: row.name
              }
              arr.push(d)
            })
            this.form.mchDefaultGrades = arr
          }
        }).catch(e => {
          this.$message({
            type: 'error',
            message: '加载分销等级出错'
          })
        })
      }
    }
  }
</script>

<style scope>
  .saasInfo-container {
    margin-top: 50px;
    margin-right: 180px;
    margin-left: 120px;
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
</style>
