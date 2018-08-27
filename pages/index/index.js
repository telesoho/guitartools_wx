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
    } else {
      this.player.setData({songId: 0})
    }
  },
  onShareAppMessage(res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    console.log(this.player.data)
    return {
      title: this.player.lyric.playing.title,
      path: `/pages/index/index?songId=${this.player.data.songId}`,
    }
  }  
})