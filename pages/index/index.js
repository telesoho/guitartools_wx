//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    paused: true,
  },
  onShow: function () {
  },
  onLoad: function (option) {
    console.log('onLoad', this.is, option)
    this.player = this.selectComponent("#guitar_player")
    if(typeof option.ids !== 'undefined') {
      this.player.setData({sid:parseInt(option.sid)})
    }
  },
  onShareAppMessage(res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    console.log(this.player)
    return {
      title: this.player.playing.title,
      path: `/index/index?sid=${this.player.data.sid}`,
      imageUrl: 'http://capi.haibaobei-ec.com/hqrcode?caption=%E5%B0%8F%E7%A8%8B%E5%BA%8F&txt=%E4%BD%A0%E5%A5%BD%E5%B0%8F%E7%A8%8B%E5%BA%8F/qrcode.png'
    }
  }  
})