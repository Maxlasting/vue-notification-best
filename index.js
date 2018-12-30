import Vue from 'vue'
import Notification from './notification.vue'
import './notification.css'

function nextZIndex () {
  let max = 0

  ;[...(document.body.children)].forEach(node => {
    const curtNodeZIndex = getComputedStyle(node).zIndex

    if (curtNodeZIndex !== 'auto' && curtNodeZIndex > max) {
      max = parseInt(curtNodeZIndex)
    }
  })

  return ++max
}

function sleep (delay = 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

const NotificationConstructor = Vue.extend(Notification)

let instance = null
let instances = []
let idx = 0
let sleepSeed = 0

const $notify = async (options = {}) => {
  if (Vue.prototype.$isServer) return

  const userOnClose = options.onClose
  const id = `fq-notification-${idx++}`
  const position = options.position || 'tr'
  const delay = options.delay || 0

  if (!!delay) {
    sleepSeed++
    await sleep(delay)
  }

  if (delay && !sleepSeed) return

  options.onClose = function () {
    $notify.close(id, userOnClose)
  }

  instance = new NotificationConstructor({
    data: options
  })

  instance._notification_id = id
  instance.$mount()
  document.body.appendChild(instance.$el)

  instance.visible = true
  instance.$el.style.zIndex = nextZIndex()

  let verticalOffset = 0
  instances.filter(_ => _.position === position).forEach(item => (verticalOffset += item.$el.offsetHeight + 16))
  verticalOffset += 16

  instance.verticalOffset = verticalOffset
  instances.push(instance)

  return instance
}

$notify.close = (id, callback) => {
  let index = -1

  const len = instances.length
  const instance = instances.filter((item, i) => {
    if (item._notification_id === id) {
      index = i
      return true
    }
    return false
  })[0]

  if (!instance || instance.closeOnSleep) return

  if (typeof callback === 'function') callback(instance.$el)

  instances.splice(index, 1)

  if (index === len - 1) return

  const position = instance.position
  const removeHeight = instance.$el.offsetHeight

  for (let i=index; i<len-1; i++) {
    if (instances[i].position === position) {
      const type = instance.verticalProperty
      instances[i].$el.style[type] = parseInt(instances[i].$el.style[type]) - 16 - removeHeight + 'px'
    }
  }
}

;['success', 'warning', 'info', 'error'].forEach(type => {
  $notify[type] = options => {
    options.type = type
    return $notify(options)
  }
})

$notify.closeAll = function () {
  sleepSeed = 0
  for (let i=instances.length-1; i>=0; i--) {
    instances[i].close()
  }
}

export default function install (Vue) {
  Vue.component(Notification.name, Notification)
  Vue.prototype.$notify = $notify
}

export { $notify }
