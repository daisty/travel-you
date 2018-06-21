<template>
  <div id="editor" style="z-index: 0">
    <div :id="id" :style="{height: h+'px'}"></div>
  </div>
</template>

<script type="text/javascript">
  import WangEditor from 'wangeditor'
  const editor = {}
  export default {
    props: ['h', 'id', 'con'],
    data() {
      return {}
    },
    mounted() {
      editor[this.id] = new WangEditor('#' + this.id)
      editor[this.id].customConfig.zIndex = 0
      editor[this.id].customConfig.onchange = (html) => {
        this.$emit('getContent', { html })
        this.editorContent = html
      }
      editor[this.id].create()
      editor[this.id].txt.html(this.con)
    },
    watch: {
      con() {
        editor[this.id].txt.html(this.con)
      }
    }
  }
</script>

<style scoped>

</style>
