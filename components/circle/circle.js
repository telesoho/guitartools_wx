const { computed } = require('../../utils/vuefy.js')

const prefixCls = 'ivu-chart-circle'

// components/circle/circle.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    percent: {
      type: Number,
      value: 0
    },
    size: {
      type: Number,
      value: 120
    },
    strokeWidth: {
      type: Number,
      value: 6
    },
    strokeColor: {
      type: String,
      value: '#2db7f5'
    },
    strokeLinecap: {
      type: String,
      value: 'round'
    },
    trailWidth: {
      type: Number,
      value: 5
    },
    trailColor: {
      type: String,
      value: '#eaeef2'
    }
  },
 
  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {},
  created() {
    console.log('created');
  },
  attached() {
    computed(this, {
      circle_svg () {
        return `data:image/svg+xml, \
        %3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E\
        %3Cpath d='${this.data.pathString}' stroke='${this.data.trailColor}' stroke-width='${this.data.trailWidth}' fill-opacity='0' /%3E\
        %3Cpath d='${this.data.pathString}' stroke-linecap='${this.data.strokeLinecap}' \
        stroke='${this.data.strokeColor}' stroke-width='${this.data.strokeWidth}' style='${this.data.pathStyle}' fill-opacity='0' /%3E\
        %3C/svg%3E`;
      },
      circleSize() {
        return `width: ${this.data.size}px;height: ${this.data.size}px`;
      },
      len() {
        return Math.PI * 2 * this.data.radius
      },
      pathStyle() {
        let ret = `stroke-dasharray: ${this.data.len}px ${this.data.len}px;\
          stroke-dashoffset: ${((100 - this.data.percent) / 100 * this.data.len)}px`;
        return ret;
      },
      pathString() {
        let ret = `M 50,50 m 0,-${this.data.radius}\
                    a ${this.data.radius},${this.data.radius} 0 1 1 0,${2 * this.data.radius}\
                    a ${this.data.radius},${this.data.radius} 0 1 1 0,-${2 * this.data.radius}`;
        return ret;
      },
      radius() {
        return 50 - this.data.strokeWidth / 2;
      }, 
      wrapClasses() {
        return `${prefixCls}`
      },
      innerClasses() {
        return `${prefixCls}-inner`
      }
    });
    console.log('attached');
  },
  ready() {
    console.log('ready');
   } 
})
