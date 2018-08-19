const { watch, computed } = require('../../utils/vuefy.js')

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
    },
    test2: {
      type:Number,
      value: 1
    }
  },
 
  /**
   * 组件的初始数据
   */
  data: {
    test:"abc"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function () {
      this.setData({test:"new", test2: this.data.test2+1});
    }
  },
  created() {
    console.log('created');
  },
  attached() {
    watch(this , {
      test(oldValue, newValue) {
      },
      test2(oldValue, newValue) {
        this.setData({test:oldValue});
      },
    }),
    computed(this, {
      pic() {
        return "background-image: url(\"data:image/svg+xml, %3Csvg viewBox='0 0 100 100' height='24' width='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'/%3E%3C/svg%3E\");background-size: cover;";
      },
      circleSize() {
        console.log(this);
        return {
          width: `${this.data.size}px`,
          height: `${this.data.size}px`
        }
      },
      len() {
        return Math.PI * 2 * this.data.radius
      },
      pathStyle() {
        return {
          'stroke-dasharray': `${this.data.len}px ${this.data.len}px`,
          'stroke-dashoffset': `${((100 - this.data.percent) / 100 * this.data.len)}px`
        }
      },
      pathString() {
        let ret = `M 50,50 m 0,-${this.data.radius}
                    a ${this.data.radius},${this.data.radius} 0 1 1 0,${2 * this.data.radius}
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
