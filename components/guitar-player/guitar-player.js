// components/GuitarPlayer/GuitarPlayer.js
import {LyricParser} from "../../utils/LyricParser"
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
    status: 'stop',
    loop: false,
    songs: [{
      songSrc: 'https://haibaobei.oss-cn-hangzhou.aliyuncs.com/upload/島唄.mp3',
      lyricSrc: 'https://haibaobei.oss-cn-hangzhou.aliyuncs.com/upload/島唄.xtrc',
      chordSrc: {
          src: 'https://haibaobei.oss-cn-hangzhou.aliyuncs.com/upload/島唄.chord.json',
          capo: 1
      }
    }],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapMainMenu() {
      if(!this.playing) {
        return
      }
      let player = this.getPlayer()

      switch(this.data.status) {
        case 'pause':
          this.player.play();
          break;
        case 'stop':
          player.title = this.playing.title
          player.epname = this.playing.epname
          player.singer = this.playing.singer
          player.coverImgUrl = ''
          player.webUrl = "https://blog.telesoho.com"
          player.src = this.playing.src
          break;
        case 'play':
          this.player.pause();
          break;
      }
    },

    getPlayer() {
      if(!this.player) {
        const player = wx.getBackgroundAudioManager()
        player.onCanplay(() => {
        });
        player.onPause(() => {
          this.setData({status: 'pause'});
        })
        player.onStop(() => {
          this.setData({status: 'stop'});
          this.playBtn.setData({percent:0})
        })
        player.onPlay(() => {
          this.setData({status: 'play'});
        })
        player.onEnded(() => {
          if(this.data.loop) {
            this.player.src = this.playing.songSrc;
          } else {
            this.setData({
              status: 'stop'
            })
            this.playBtn.setData({percent:0})
          }
        })
  
        player.onError((res) => {
          console.log(res);
        });
    
        player.onTimeUpdate(() => {
          this.playBtn.setData({percent: (player.currentTime / player.duration) * 100})
        });
        this.player = player;
      }
      return this.player;
    },

    loadLyric (song) {
      let parser = new LyricParser();
      let self = this;
      wx.showToast({
        title: "正在加载音乐",
        icon: "loading",
      });
      self.playing = {}
      wx.request({
        url: song.lyricSrc,
        method: "GET",
        success: function (response) {
          console.log(response);
          var lyricContent = response.data
          self.focusIndex = null
          wx.request({
            url: song.chordSrc.src,
            method: "GET",
            success: function (response) {
              console.log(response);
              var ret = parser.parse(lyricContent, response.data, song.chordSrc.capo)
              self.playing.title = ret.title
              self.playing.singer = ret.artist
              self.playing.epname = "六叠空间"
              self.playing.capo = ret.capo
              self.playing.lyricData = ret.lyricData
            },
            fail: function (error) {
              console.log('ERROR: load chord failed', error)
              var ret = parser.parse(lyricContent, '[{"start": 0, "end": 10, "chord": "N"}]')
              self.playing.title = ret.title
              self.playing.singer = ret.artist
              self.playing.epname = "六叠空间"
              self.playing.capo = ret.capo
              self.playing.lyricData = ret.lyricData
            }
          })
          self.playing.src = song.songSrc;
          wx.hideToast();
        },
        fail: function (error) {
          console.log('ERROR: load lyric failed', error)
          var lyricContent = '[00:00.00]\n[00:10.00]'
          var ret = parser.parse(lyricContent, '[{"start": 0, "end": 10, "chord": "N"}]')
          self.playing.lyricData = ret.lyricData
        }
      });
    }
  },
  attached() {
    this.playBtn = this.selectComponent("#playBtn")
    console.log('attached', this.is);
    this.loadLyric(this.data.songs[0])
  },
  /**
   * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
   */
  ready: function() {
    console.log('ready', this.is);
    let bloom_items = this.selectAllComponents('.bloom-item')
    let menu = this.selectComponent('#memu')
    menu.setMenuItems(bloom_items);
  }
})
