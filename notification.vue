<template>
  <transition name="best-notification-fade" @after-leave="destroyElement">
    <div
      :class="['best-notification', horizontalClass]"
      :style="positionStyle"
      v-show="visible"
      @click="click"
    >
      <i :class="['icon', typeClass]" v-if="type"></i>
      <div class="group">
        <h2 class="title">{{ title }}</h2>
        <div class="content" v-show="message">
          <p class="message">{{ message }}</p>
        </div>
      </div>
      <div class="close best-icon-close" v-if="showClose" @click.stop="close" />
    </div>
  </transition>
</template>

<script>
const typesData = {
  success: 'success', info: 'info', warning: 'warning', error: 'error'
}

export default {
  name: 'BestNotification',

  data () {
    return {
      visible: false,
      timer: null,
      verticalOffset: 0,
      title: '',
      message: '',
      duration: 3000,
      type: '',
      showClose: true,
      onClose: null,
      onClick: null,
      position: 'topRight'
    }
  },

  computed: {
    typeClass () {
      return this.type ? 'fq-icon-' + typesData[this.type] : ''
    },

    horizontalClass () {
      return this.position.toLowerCase().indexOf('right') > -1 ? 'right' : 'left'
    },

    verticalProperty () {
      return this.position.toLowerCase().indexOf('top') > -1 ? 'top' : 'bottom'
    },

    positionStyle () {
      return {
        [this.verticalProperty]: `${this.verticalOffset}px`
      }
    }
  },

  mounted () {
    this.startTimer()
    document.addEventListener('keydown', this.keydown)
  },

  beforeDestroy () {
    document.removeEventListener('keydown', this.keydown)
  },

  methods: {
    destroyElement () {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },

    click () {
      if (typeof this.onClick === 'function') {
        return this.onClose(this.$el)
      }
    },

    close () {
      this.visible = false
      if (typeof this.onClose === 'function') return this.onClose()
    },

    clearTimer () {
      clearTimeout(this.timer)
    },

    startTimer () {
      if (this.duration > 0) {
        this.timer = setTimeout(this.close.bind(this), this.duration)
      }
    },

    keydown (e) {
      if (e.keyCode === 27) {
        this.close()
      }
    }
  }
}
</script>
