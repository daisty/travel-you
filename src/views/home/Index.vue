<template>
  <div style="background:#f0f2f5;margin-top: -20px;">
    <div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      loginUser: {
        realName: '演示账号'
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  computed() {
  },
  methods: {
    getUserInfo() {
      this.loginUser = this.$store.getters.userInfo
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
