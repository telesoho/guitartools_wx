import {
  LyricParserV2
} from "../../utils/LyricParserV2"
import {
  getRandomInt
} from "../../utils/util"

import {watch} from "../../utils/vuefy"

const NAV_BACKGROUND_COLOR = ['#ffffff', '#add8e6', '#90ee90', '#A974A2', '#ff0000']
const NAV_FRONT_COLOR = ['#000000', '#000000', '#000000', '#ffffff', '#ffffff']

const TEST_LYRIC = `
[ti:我要你]
[ar:毛南子]
[al:六叠空间]
[au:毛南子]
[ly:樊冲]
[mu:樊冲]
[变调夹:0]
[原调:A]
[选调:C]
[歌词制作:毛南子]
[img]https://guitartools-1257167903.cos.ap-chengdu.myqcloud.com/images/9a6f295829342e15cb6fe0e56d5d43ff.gif
[#]这首歌是电影《驴得水》的主题曲，一首充满复古色彩的歌曲，不论是从节奏选择还是和声处理，均还原了民国时期旧上海的音乐文化特征。
[#]在编曲上整首歌曲都用吉他分解，不炫技不打板不扫弦。
[00:00.00]我{C}要你在我身{G}旁
[00:08.16]我{F}要看着你梳{C}妆
[00:14.66]{C7}这夜的风儿{F}吹
[00:18.16]{G}吹得心痒{C}痒我{Em}的姑{Am}娘
[00:22.16]我在他{F}乡{G}望着月{C}亮
[00:29.41]{C7}都怪这{F}月色{G}撩人的疯{C}狂
[00:36.66]{C7}都怪这{F}吉他{G}弹得太凄{C}凉
[00:43.91]{C7}哦 我要唱着{F}歌
[00:47.91]{G}默默把你{C}想我{Em}的姑{Am}娘
[00:51.41]你在何{F}方{G}眼看天{C}亮
[00:58.40]{F}{G} {C}{Em}{Am} {F}{G} {C}
[#]过门
[img]https://guitartools-1257167903.cos.ap-chengdu.myqcloud.com/images/tumblr_nipq1jbZBw1s695zdo1_500.gif
[01:12.65]{C7}都怪这{F}夜色{G}撩人的疯{C}狂
[01:20.15]{C7}都怪这{F}吉他{G}弹得太凄{C}凉
[01:27.40]{C7}哦 我要唱着{F}歌
[01:31.15]{G}默默把你{C}想我{Em}的姑{Am}娘
[01:34.90]你在何{F}方{G}眼看天{C}亮
[01:42.65]送{C}你美丽的衣{G}裳
[01:50.40]看{F}你对镜贴花{C}黄
[01:56.90]{C7}这夜色太紧{F}张
[01:59.90]{G}时间太漫{C}长我{Em}的姑{Am}娘
[02:05.15]我在他{F}乡{G}望着月{C}亮
[02:11.90]{F}{G}{C}哒{Em}{Am}哒{F}哒嘀{G}哒嘀{C}哒
`

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
    screenHeight: 800,
    focusIndex: null,
    playing: {
      title: '',
      artist: '',
      capo: 0,
      lyricData: []
    },
    repeat: {
      startIndex: -1,
      endIndex: -1
    }
  },
  attached() {
    console.log('attached', this.is);
    watch(this, {
      focusIndex(oldVal, newVal) {
        
      }
    })
    var systemInfo = wx.getSystemInfoSync();
    this.setData({
      screenHeight: systemInfo.windowHeight
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    scrollTo(currentTime) {
      let k = this.getLyricIndex(currentTime);
      if (k !== null && this.data.focusIndex != k) {
        if(this.data.focusIndex != null) {
          this.setData({
            [`playing.lyricData[${this.data.focusIndex}].data.focus`]:false
          })
        }
        this.setData({
          [`playing.lyricData[${k}].data.focus`]:true
        })
        this.setData({
          focusIndex: k
        })
      }
    },
    getLyricIndex(currentTime) {
      let lyricData = this.data.playing.lyricData;
      for (var k in lyricData) {
        let element = lyricData[k]
        if (element.type === 'lyric') {
          if (currentTime >= element.data.time && currentTime < element.data.endTime) {
            return k
          }
        }
      }
      return null
    },
    getRandomColor() {
      this.NavColorIndex = getRandomInt(NAV_BACKGROUND_COLOR.length, 0, [this.NavColorIndex])
      return {
        frontColor: NAV_FRONT_COLOR[this.NavColorIndex],
        backgroundColor: NAV_BACKGROUND_COLOR[this.NavColorIndex]
      }
    },
    parseLyricDataV2(song, lyricContent) {
      console.log('parseLyricDataV2', this.is)
      let parser = new LyricParserV2();
      var ret = parser.parse(lyricContent)
      this.setData({
        playing: ret
      })
      wx.setNavigationBarTitle({
        title: `${ret.title} - ${ret.artist}`
      })
      let color = this.getRandomColor();
      wx.setNavigationBarColor({
        frontColor: color.frontColor,
        backgroundColor: color.backgroundColor,
        animation: {
          duration: 200,
          timingFunc: 'easeIn'
        }
      })
    },
    loadLyric(song) {
      this.playing = {}
      wx.showNavigationBarLoading()
      this.playing = {}
      var lyricContent = '[00:00.00]\n[00:10.00]'

      wx.request({
        url: encodeURI(song.lyricSrc),
        method: "GET",
        success: (response) => {
          console.log(response);
          if (response.statusCode != 200) {
            console.log('ERROR: load lyric failed', response.statusCode)
            return
          }
          lyricContent = response.data
          this.focusIndex = null
        },
        fail: (error) => {
          console.log('ERROR: load lyric failed', error)
        },
        complete: () => {
          this.parseLyricDataV2(song, lyricContent)
          // this.parseLyricDataV2(song, TEST_LYRIC)
          wx.hideNavigationBarLoading()
        }
      });
    },
    onLyricLongPress(e) {
      var myEventDetail = this.data.playing.lyricData[e.currentTarget.dataset.lyricidx]; // detail对象，提供给事件监听函数
      var myEventOption = { bubbles: true, composed: true } // 触发事件的选项
      this.triggerEvent('LyricLongPressEvent', myEventDetail, myEventOption)
    }
  }
})