# vue-notification-best

vue 全局通知插件，第一版本用于测试，文档和案例会逐步完善！

1.0.0 - 初次开发完毕，还有很多需求未实现

1.0.1 - 更新README案例

1.1.0 
  - 添加关闭所有功能
  - 添加延迟功能
  - 修复不能自动关闭的问题（原因是测试代码的时候，自动关闭被注释了）

基本使用方式：

```
import Vue from 'vue'
import notification from 'vue-notification-best'

Vue.use(notification)

<template>
  <div>
    <button @click="handleNotify">按钮</button>
    <button @click="handleCloseAll">关闭所有</button>
  </div>
</template>

<script>
export default {
  methods: {
    async handleNotify () {
      // 如果想手动关闭某个按钮，必须加上 await
      const ret = await this.$notify({
        title: '测试',
        message: '这是一条信息！',
        position: 'tr',  // tl tr bl br
        delay: 300,  // 延迟多久出现
        duration: 0,  // 0 代表不自动关闭
      })

      setTimeout(() => {
        console.log(ret)
        ret.close()
      }, 1000)
    },
    handleCloseAll () {
      // 关闭所有通知，包括延迟未出现的
      this.$notify.closeAll()
    }
  }
}
</script>
```