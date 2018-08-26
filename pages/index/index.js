//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    paused: true,
  },
  onShow: function () {
  },
  onLoad: function (res) {
    console.log(res)
  },
  onShareAppMessage(res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/index/index?sid=1',
      imageUrl: '自定义图片路径'
    }
  }  
})