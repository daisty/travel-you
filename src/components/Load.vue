<template>
  <div class="loading" :style="{lineHeight: h+'px'}">
    <i class="el-icon-loading" style="color:#58B7FF" :style="{fontSize: s+'px'}"></i>
    <span style="margin-left: 10px;">{{c}}</span>
  </div>
</template>

<script>
  export default {
    props: ['s', 'h', 'c'],
    data() {
      return {}
    }
  }
</script>

<style scoped>
  div{
    text-align: center;
  }
</style>
