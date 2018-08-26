//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    paused: true,
  },
  onShow () {
  },
  onLoad(opt) {
    console.log('onLoad', this.is, opt)
    this.player = this.selectComponent("#guitar_player")
    if(typeof opt.songId !== 'undefined') {
      this.player.setData({songId:parseInt(opt.songId)})
    } else if(typeof opt.scene !== 'undefined') {
      var scene = decodeURIComponent(opt.scene)
      this.player.setData({songId:parseInt(scene)})
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
      path: `/pages/index/index?scene=${this.player.data.songId}`,
    }
  }  
})