//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    paused: true,
    animationData: {},
  },
  onShow: function(){
    var animation = wx.createAnimation({
      duration: 1000,
  	  timingFunction: 'ease',
    })

    this.animation = animation
  },  
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  rotateAndScale: function () {
    // 旋转同时放大
    this.animation.rotate(45).scale(2, 2).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  rotateAndScaleBack: function () {
    // 旋转同时放大
    this.animation.rotate(0).scale(1, 1).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  rotateThenScale: function () {
    // 先旋转后放大
    this.animation.rotate(45).step()
    this.animation.scale(2, 2).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  rotateAndScaleThenTranslate: function () {
    // 先旋转同时放大，然后平移
    this.animation.rotate(45).scale(2, 2).step()
    this.animation.translate(100, 100).step({ duration: 1000 })
    this.setData({
      animationData: this.animation.export()
    })
  },
  onLongPress() {
    this.rotate = !this.rotate;
    if(!this.rotate) {
      this.rotateAndScaleBack();
    } else {
      this.rotateThenScale();
    }
  },
  onCircleTap: function () {
    if(this.player ) {
      if(this.player.paused) {
        this.player.play();
      } else {
        this.player.pause();
      }
    }
  },
  onLoad: function () {
  }
})
