<template>
  <div class="currentPosition">
    <!-- <span>"测试地址"</span> -->
    <span v-for="(item,index) in positions"  :key="index">
      <span v-if="index==positions.length-1">{{item}}</span>
      <span v-else><span style="color:#20A0FF;cursor: pointer;" @click="to(index-positions.length+1)">{{item}}</span> > </span>
    </span>
  </div>
</template>

<script>
export default {
  props: ['positions'],
  methods: {
    to(num) {
      this.$router.go(num)
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
