//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    paused: true,
    rowData: [
      {id:11, message:"hello1"},
      {id:12, message:"hello2"},
      {id:13, message:"hello3"},
      {id:14, message:"hello4"},
      {id:15, message:"hello5"},
      {id:16, message:"hello6"},
      {id:17, message:"hello7"}
    ],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animationData: {}
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
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    const player = wx.getBackgroundAudioManager()
    player.title = "吉他兔"
    player.epname = "六叠空间"
    player.singer = "毛南子"
    player.coverImgUrl = ''
    player.webUrl = "https://blog.telesoho.com"
    player.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
    player.onCanplay(() => {
    });
    player.onPause(() => {
      this.setData({paused: true});
    })
    player.onStop(() => {
      this.setData({paused: true});
    })
    player.onPlay(() => {
      this.setData({paused: false});
    })
    player.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    });

    // onTimeUpdate	callback	音频播放进度更新事件
    player.onTimeUpdate(() => {
      let myc  = this.selectComponent('#myc');
      myc.setData({'percent':  (player.currentTime / player.duration) * 100});
    });

    this.player = player;
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
