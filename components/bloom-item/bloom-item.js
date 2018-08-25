Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setExpand(obj) {
      this.expand_ani = obj;
    },
    setFold(obj) {
      this.fold_ani = obj;
    },

    expand: function () {
      this.setData({
        animationData: this.expand_ani
      })
    },

    fold: function () {
      this.setData({
        animationData: this.fold_ani
      })
    }
  }
})
