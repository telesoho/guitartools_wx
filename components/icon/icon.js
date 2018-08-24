const { computed } = require('../../utils/vuefy.js')
const { toCss } = require('../../utils/util.js')

const prefixCls = 'icon'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: String,
    size: String,
    color: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

  /**
   * 
   */
  attached() {
    computed(this, {
      classes () {
        return `${prefixCls} ${prefixCls}-${this.data.type}`
      },
      styles () {
        let style = {}
        if (this.data.size) {
          style['font-size'] = `${this.data.size}rpx`
        }
        if (this.data.color) {
          style.color = this.data.color
        }
        return toCss(style);
      }
    });
  },  
})
