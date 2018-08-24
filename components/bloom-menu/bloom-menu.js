// components/BloomMenu/BloomMenu.js
function toRadians (angle) {
  return angle * (Math.PI / 180)
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    startAngle: {
      type: Number,
      default: 180
    },
    endAngle: {
      type: Number,
      default: 270
    },
    radius: {
      type: Number,
      default: 50
    },
    itemAnimationDelay: {
      type: Number,
      default: 40
    },
    animationDuration: {
      type: Number,
      default: 100
    }
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
   * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
   */
  ready: function() {
    console.log('ready', this);
    let bloom_items = this.selectAllComponents('.bloom-item')

    if (!bloom_items) {
      console.log('ERROR: you must define some item.')
      return
    }

    this.isOpen = false

    var angleStep =
    (this.endAngle - this.startAngle) / (bloom_items.length - 1)
    var angleCur = this.startAngle

    for (var i = 0; i < bloom_items.length; i++) {
      var x = this.radius * Math.cos(toRadians(angleCur))
      var y = this.radius * Math.sin(toRadians(angleCur))
      var x3 = Number((x).toFixed(2))
      var y3 = Number((y).toFixed(2))
      var x2 = x3 * 1.2
      var y2 = y3 * 1.2
      var x0 = 0
      var y0 = 0
      var expandTranslateX = [
        {value: x0, duration: 0},
        {value: x2, duration: 0.7 * this.animationDuration},
        {value: x3, duration: 0.3 * this.animationDuration, easing: 'easeOutBack'}
      ]
      var expandTranslateY = [
        {value: y0, duration: 0},
        {value: y2, duration: 0.7 * this.animationDuration},
        {value: y3, duration: 0.3 * this.animationDuration, easing: 'easeOutBack'}
      ]

      var foldTranslateX = [
        {value: x3, duration: 0},
        {value: x2, duration: 0.7 * this.animationDuration},
        {value: x0, duration: 0.3 * this.animationDuration, easing: 'easeOutBack'}
      ]
      var foldTranslateY = [
        {value: y3, duration: 0},
        {value: y2, duration: 0.7 * this.animationDuration},
        {value: y0, duration: 0.3 * this.animationDuration, easing: 'easeOutBack'}
      ]

      // this.$emit.apply(this.$slots.BloomItems[i].componentInstance, ['setAnime'].concat({
      //   expand: {
      //     translateX: expandTranslateX,
      //     translateY: expandTranslateY,
      //     delay: i * this.itemAnimationDelay
      //   },
      //   fold: {
      //     translateX: foldTranslateX,
      //     translateY: foldTranslateY,
      //     delay: i * this.itemAnimationDelay
      //   }
      // }))
      angleCur += angleStep
    }
  }
})
