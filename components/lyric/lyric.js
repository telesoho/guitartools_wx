// components/lyric/lyric.js
import {LyricParser} from "../../utils/LyricParser"
import {getRandomInt} from "../../utils/util"

const NAV_BACKGROUND_COLOR = [ '#ffffff', '#add8e6', '#90ee90', '#A974A2', '#ff0000']
const NAV_FRONT_COLOR = ['#000000', '#000000','#000000', '#ffffff', '#ffffff']

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    seek: Number,
    duration: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    focusIndex: 0,
    playing:{
      title: '',
      artist: '',
      capo: 0,
      lyricData: [{
        time: 0,
        chords: [],
        lrcText: '',
        focus: false
      }]
    },
    repeat: {
      startIndex: -1,
      endIndex: -1
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getRandomColor() {
      this.NavColorIndex = getRandomInt(NAV_BACKGROUND_COLOR.length, 0, [this.NavColorIndex])
      return { frontColor: NAV_FRONT_COLOR[this.NavColorIndex],
        backgroundColor: NAV_BACKGROUND_COLOR[this.NavColorIndex]
      }
    },
    parseLyricData(song, lyricContent, chordContent) {
      console.log('parseLyricData', this.is)
      let parser = new LyricParser();
      var ret = parser.parse(lyricContent, chordContent, song.chordSrc.capo)
      this.playing.title = ret.title
      this.playing.singer = ret.artist
      this.playing.epname = "六叠空间"
      this.playing.capo = ret.capo
      this.playing.lyricData = ret.lyricData
      this.playing.src = song.songSrc;
      this.setData({
        playing: ret
      })
      wx.setNavigationBarTitle({
        title: `${this.playing.title} - ${this.playing.singer}`
      })
      let color = this.getRandomColor();
      wx.setNavigationBarColor({
        frontColor: color.frontColor,
        backgroundColor:color.backgroundColor,
        animation: {
            duration: 200,
            timingFunc: 'easeIn'
        }
      })
    },
    loadLyric (song) {
      wx.showNavigationBarLoading()
      this.playing = {}
      var lyricContent = '[00:00.00]\n[00:10.00]'
      var chordContent = '[{"start": 0, "end": 10, "chord": "N"}]'

      wx.request({
        url: song.lyricSrc,
        method: "GET",
        success: (response) => {
          console.log(response);
          if(response.statusCode != 200) {
            console.log('ERROR: load lyric failed', response.statusCode)
            return
          }
          lyricContent = response.data
          this.focusIndex = null
          wx.showNavigationBarLoading()
          wx.request({
            url: song.chordSrc.src,
            method: "GET",
            success: (response) => {
              console.log(response);
              if(response.statusCode != 200) {
                console.log('ERROR: load chord failed', response.statusCode)
                return
              }
              chordContent = response.data
            },
            fail: (error) => {
              console.log('ERROR: load chord failed', error)
            }
          })
        },
        fail: (error) => {
          console.log('ERROR: load lyric failed', error)
        },
        complete: () => {
          this.parseLyricData(song, lyricContent, chordContent)
          wx.hideNavigationBarLoading()
        }
      });
    }
  }
})
