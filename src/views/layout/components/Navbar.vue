<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
      <breadcrumb class="breadcrumb-container"></breadcrumb>

      <div class="right-menu" v-if="!isFromTop">
        <el-tooltip effect="dark" :content="$t('loginUser.screenfull')" placement="bottom">
          <screenfull class="screenfull right-menu-item"></screenfull>
        </el-tooltip>
        <lang-select class="international right-menu-item"></lang-select>
        <el-tooltip effect="dark" :content="$t('loginUser.theme')" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"></theme-picker>
        </el-tooltip>
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <el-dropdown-item>
              <span @click="showDialog=true" style="display:block">{{$t('loginUser.userData')}}</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="logout" style="display:block">{{$t('loginUser.logOut')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>

    <el-dialog
      @close="clearForm"
      :title="$t('loginUser.userData')"
      :visible.sync="showDialog">
      <el-tabs v-model="tab" tab-position="left">
        <el-tab-pane :label="$t('loginUser.personalData')" name="personal">
          <el-form label-width="150px" :model="userInfo" label-suffix="：" class="info-form">
            <el-row type="flex" class="row-bg" justify="start">
              <el-col :span="10">
                <el-form-item :label="$t('loginUser.id')">
                  {{userInfo.id}}
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item :label="$t('loginUser.username')">
                  {{userInfo.username}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" justify="start">
              <el-col :span="10">
                <el-form-item :label="$t('loginUser.realName')">
                  {{userInfo.realName}}
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item :label="$t('loginUser.nickName')">
                  {{userInfo.nickName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" justify="start">
              <el-col :span="10">
                <el-form-item :label="$t('loginUser.mobile')">
                  {{userInfo.mobile}}
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item :label="$t('loginUser.email')">
                  {{userInfo.email}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" justify="start">
              <el-col :span="10">
                <el-form-item :label="$t('loginUser.saasId')">
                  {{userInfo.saasId}}
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item :label="$t('loginUser.mchId')">
                  {{userInfo.mchId}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" justify="start">
              <el-col :span="10">
                <el-form-item :label="$t('loginUser.mscType')">
                  {{userInfo.mscType}}
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item :label="$t('loginUser.userGrade')">
                  {{userInfo.userGrade}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('loginUser.modifyPassword')" name="setPwd">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item :label="$t('loginUser.oldPassword')" prop="oldPassword">
              <el-input type="password" size="small" v-model="ruleForm.oldPassword" :placeholder="$t('common.pleaseEnter',{name: $t('loginUser.oldPassword')})"></el-input>
            </el-form-item>
            <el-form-item :label="$t('loginUser.newPassword')" prop="newPassword">
              <el-input size="small" type="password" v-model="ruleForm.newPassword" :placeholder="$t('common.pleaseEnter',{name: $t('loginUser.newPassword')})" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('loginUser.repeatPassword')" prop="repeatNewPassword" required>
              <el-input size="small" type="password" v-model="ruleForm.repeatNewPassword" :placeholder="$t('loginUser.newPasswordAgain')" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="resetPwd">{{$t('loginUser.modify')}}</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ThemePicker from '@/components/ThemePicker'
  import LangSelect from '@/components/LangSelect'
  import Screenfull from '@/components/Screenfull'
  import Login from '@/api/login'

  export default {
    data() {
      return {
        lang: 'zh-CN',
        showDialog: false,
        tab: 'personal',
        ruleForm: {
          oldPassword: '',
          newPassword: '',
          repeatNewPassword: ''
        },
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
      }
    },
    components: {
      Breadcrumb,
      Hamburger,
      LangSelect,
      ThemePicker,
      Screenfull
    },
    computed: {
      isFromTop() { // 是否是嵌套在iframe
        return !!window.sessionStorage.getItem('isFromTop')
      },
      ...mapGetters([
        'sidebar',
        /* 'avatar', */
        'userInfo'
      ]),
      rules() {
        const that = this
        const checkPassword = (rule, value, callback) => {
          if (value === '') {
            callback(new Error(that.$t('loginUser.newPasswordAgain')))
          } else if (value !== this.ruleForm.newPassword) {
            callback(new Error(that.$t('loginUser.notEqual')))
          } else {
            callback()
          }
        }
        return {
          oldPassword: [
            { required: true, message: that.$t('common.pleaseEnter', { name: that.$t('loginUser.oldPassword') }), trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: that.$t('common.pleaseEnter', { name: that.$t('loginUser.newPassword') }), trigger: 'blur' },
            { required: true, message: that.$t('common.pleaseEnter', { name: that.$t('loginUser.newPasswordAgain') }), trigger: 'blur' }
          ],
          repeatNewPassword: [
            { validator: checkPassword, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      },
      // 关弹窗时清空ruleForm
      clearForm() {
        this.$refs['ruleForm'].resetFields()
        this.ruleForm = {
          oldPassword: '',
          newPassword: '',
          repeatNewPassword: ''
        }
      },
      // 重置密码
      resetPwd() {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            this.$confirm(this.$t('loginUser.operationTip'), this.$t('loginUser.tip'), {
              confirmButtonText: this.$t('common.confirm'),
              cancelButtonText: this.$t('common.cancel'),
              type: 'warning'
            }).then(() => {
              const data = this.ruleForm
              Login.reset(data).then(res => {
                if (res.status === 1) {
                  this.$message({
                    message: this.$t('loginUser.operationSuccess') + '，' + this.$t('loginUser.loginAgain'),
                    type: 'success',
                    showClose: true,
                    onClose: () => {
                      // 退出，重新登录
                      this.logout()
                    }
                  })
                } else {
                  this.$message({
                    message: res.msg,
                    type: 'error',
                    showClose: true
                  })
                }
              })
            }).catch()
          } else {
            console.log('error submit!')
            return false
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container{
      float: left;
    }
    .right-menu {
      float: right;
      height: 100%;
      &:focus{
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international{
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        .avatar-wrapper {
          cursor: pointer;
          margin-top: 5px;
          position: relative;
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
<style>
.info-form .el-form-item {
  margin-bottom: 0;
}
</style>


