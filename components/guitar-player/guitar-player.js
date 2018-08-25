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
    songs: [{
      songSrc: 'https://haibaobei.oss-cn-hangzhou.aliyuncs.com/upload/島唄.mp3',
      lyricSrc: 'https://haibaobei.oss-cn-hangzhou.aliyuncs.com/upload/島唄.xtrc',
      chordSrc: {
          src: 'https://haibaobei.oss-cn-hangzhou.aliyuncs.com/upload/島唄.chord.json',
          capo: 1
      }
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setupPlayer() {
      let theSong = this.data.songs[0];
      const player = wx.getBackgroundAudioManager()
      player.title = "吉他兔"
      player.epname = "六叠空间"
      player.singer = "毛南子"
      player.coverImgUrl = ''
      player.webUrl = "https://blog.telesoho.com"
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
      player.onEnded(() => {
        this.player.src = theSong.songSrc;
      })

      player.onError((res) => {
        console.log(res);
      });
  
      player.onTimeUpdate(() => {
        this.playBtn.setData({percent: (player.currentTime / player.duration) * 100})
      });
  
      this.player = player;
  
      this.loadLyric(theSong)

    },

    loadLyric (song) {
      let parser = new LyricParser();
      let self = this;
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
              self.title = ret.title
              self.artist = ret.artist
              self.capo = ret.capo
              self.player.title = ret.title
              self.player.singer = ret.artist
              self.lyricData = ret.lyricData
              self.player.src = song.songSrc;
            },
            fail: function (error) {
              console.log('ERROR: load chord failed', error)
              var ret = parser.parse(lyricContent, '[{"start": 0, "end": 10, "chord": "N"}]')
              self.title = ret.title
              self.artist = ret.artist
              self.capo = ret.capo
              self.lyricData = ret.lyricData
            }
          })
        },
        fail: function (error) {
          console.log('ERROR: load lyric failed', error)
          var lyricContent = '[00:00.00]\n[00:10.00]'
          var ret = parser.parse(lyricContent, '[{"start": 0, "end": 10, "chord": "N"}]')
          self.data.lyricData = ret.lyricData
        }
      });
    }
  },
  attached() {
    this.playBtn = this.selectComponent("#playBtn")

    console.log('playBtn', this.playBtn);

    this.setupPlayer();
  }
})
