# vue-notification-best

vue 全局通知插件，第一版本用于测试，文档和案例会逐步完善！

基本使用方式：

```
import Vue from 'vue'
import notification from 'vue-notification-best'

Vue.use(notification)

<template>
  <div>
    <button @click="handleNotify">按钮</button>
  </div>
</template>

<script>
export default {
  methods: {
    handleNotify () {
      // this.$notify.success({})
      // this.$notify.info({})
      // this.$notify.warning({})
      // this.$notify.error({})

      this.$notify({
        title: '测试',
        message: '这是一条信息！',
        // top right
        position: 'tr'  // tl tr bl br
      })
    }
  }
}
</script>

```