# vue-notification-best

> 常用插件：vue 通知插件，感谢您的使用。

## 安装

```
npm i -S vue-notification-best
```

## 使用方式

1 全局引入

```
import Vue from 'vue'
import notification from 'vue-notification-best'

Vue.use(notification)

// 之后可以在任意 vm 实例中的方法内，调用 this.$notify({...opts})
```

2 单文件引入，可以是 .vue 或 .js

```
import { $notify } from 'vue-notification-best'

// 之后通过 $notify({...opts}) 调用
```

## 通用配置项 config

1. title: 通知标题
2. message: 通知内容
3. showClose: 是否显示关闭按钮 默认为 true
4. duration: 设置多久后自动关闭，如果设置为 0 则不关闭，默认 3000ms
5. delay: 延迟多久显示，默认不延迟
6. position: 设置显示的为止，默认为 tr -> top right，可以设置为 tl tr bl br 4种位置


## 常用展示方法

有的时候可能会需要展示对应的某种状态，比如：成功、失败等，组件内提供了对应的方法：

```
$notify.success({...opts})

$notify.warning({...opts})

$notify.errors({...opts})

$notify.info({...opts})
```

使用的时候也可能需要在某个动作中关闭所有展示的通知：

```
$notify.closeAll()
```

或者是手动关闭某个特定的通知消息，不过这么做的意义并不大，完全可以设置 duration 来自动控制，
注意，由于加入的延时功能是使用的 Promise 来实现的，所有想得到实例的返回值需要加上 await：

```
{
  methods: {
    async handleClick () {
      const retNotify = await $notify.success({...opts})

      setTimeout(retNotify.close, 2000)
    }
  }
}
```

## 示例代码

```
<template>
  <div>
    <button @click="handleNotify">按钮</button>
    <button @click="handleCloseAll">关闭所有</button>
  </div>
</template>

<script>
import { $notify } from './test'
export default {
  methods: {
    handleNotify () {
      $notify.success({
        title: '标题',
        message: '这是一条成功的通知信息！',
        position: 'tr',
        delay: 600,
        duration: 0
      })
    },
    handleCloseAll () {
      $notify.closeAll()
    }
  }
}
</script>
```

## 在线 DEMO

等插件完善之后，会逐步上线


## 更新日志

2018年12月29日更新

1.0.0 - 初次开发完毕，还有很多需求未实现

1.0.1 - 更新README案例

1.1.0 
  - 添加关闭所有功能
  - 添加延迟功能
  - 修复不能自动关闭的问题（原因是测试代码的时候，自动关闭被注释了）


2018年12月30日更新

1.2.0
  - 修复延时功能的 bug
  - 修复 esc 不能关闭通知的 bug
  - 增加 直接 import 的使用方式

1.2.1 - 修改README一些错别字
