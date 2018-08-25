// components/BloomMenu/BloomMenu.js
function toRadians(angle) {
  return angle * (Math.PI / 180)
}

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    startAngle: {
      type: Number,
      value: 180
    },
    endAngle: {
      type: Number,
      value: 270
    },
    radius: {
      type: Number,
      value: 50
    },
    itemAnimationDelay: {
      type: Number,
      value: 40
    },
    animationDuration: {
      type: Number,
      value: 100
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
    setMenuItems(bloom_items) {
      if (!bloom_items) {
        console.log('ERROR: you must define some item.')
        return
      }
      this.bloom_items = bloom_items;
      this.isOpen = false
      this._setupAnime();
    },

    onOpenMenu() {
      console.log('onOpenMenu', this.is, this.isOpen)
      if (!this.bloom_items) {
        return
      }

      this.isOpen = !this.isOpen

      if(this.isOpen) {
        this.bloom_items.forEach(function(item) {
          item.expand()
        });
      } else {
        this.bloom_items.forEach(function(item) {
          item.fold()
        });
      }
    },
    _setupAnime: function() {
      var ani = wx.createAnimation()

      let bloom_items = this.bloom_items;

      var angleStep =
        (this.data.endAngle - this.data.startAngle) / (bloom_items.length - 1)
      var angleCur = this.data.startAngle

      for (var i = 0; i < bloom_items.length; i++) {
        var x = this.data.radius * Math.cos(toRadians(angleCur))
        var y = this.data.radius * Math.sin(toRadians(angleCur))
        var x3 = Number((x).toFixed(2))
        var y3 = Number((y).toFixed(2))
        var x2 = x3 * 1.2
        var y2 = y3 * 1.2
        var x0 = 0
        var y0 = 0
  
        // 生成expend动画
        ani.translate(x2, y2).step({
          delay: i * this.data.itemAnimationDelay,
          duration: 0.7 * this.data.animationDuration
        });
        ani.translate(x3, y3).step({
          duration: 0.3 * this.data.animationDuration,
          timingFunction: 'ease-in'
        });
  
        let expand_ani = ani.export();
  
        // 生成Fold动画
        ani.translate(x2, y2).step({
          delay: i * this.data.itemAnimationDelay,
          duration: 0.7 * this.data.animationDuration
        });
        ani.translate(0, 0).step({
          duration: 0.3 * this.data.animationDuration,
          timingFunction: 'ease-in'
        });
  
        let fold_ani = ani.export();
  
        bloom_items[i].setExpand(expand_ani);
        bloom_items[i].setFold(fold_ani)
  
        angleCur += angleStep
      }
    }
  },

  /**
   * 组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
   */
  created: function () {},

  /**
   * 	组件生命周期函数，在组件实例进入页面节点树时执行
   */
  attached: function () {
    console.log('attached', this.is);
  },

  ready() {
    console.log('ready', this.is);
  }
})