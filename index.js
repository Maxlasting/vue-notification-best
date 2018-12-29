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

export default function install (Vue) {
  Vue.component(Notification.name, Notification)

  const NotificationConstructor = Vue.extend(Notification)

  let instance = null
  let instances = []
  let idx = 0

  const $notify = (options = {}) => {
    if (Vue.prototype.$isServer) return

    const userOnClose = options.onClose
    const id = `fq-notification-${idx++}`
    const position = options.position || 'tr'

    options.onClose = function () {
      $notify.close(id, userOnClose)
    }

    instance = new NotificationConstructor({
      data: options
    })

    instance.id = id
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
      if (item.id === id) {
        index = i
        return true
      }
      return false
    })[0]

    if (!instance) return

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

  Vue.prototype.$notify = $notify
}
