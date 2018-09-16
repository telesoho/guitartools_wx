import {LyricParserV2} from "../../utils/LyricParserV2"
import {getRandomInt} from "../../utils/util"
import {computed} from "../../utils/vuefy"
import {ChordTranspoter, getCapo} from "../../utils/chord-transposer"
import {GUITAR_CHORD_CHARTS} from "guitar_chord_charts"
import {HELP_LYRIC} from "help_lyric"

const NAV_BACKGROUND_COLOR = ['#ffffff', '#add8e6', '#90ee90', '#A974A2', '#ff0000']
const NAV_FRONT_COLOR = ['#000000', '#000000', '#000000', '#ffffff', '#ffffff']

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
    auto_scroll: true,
    showChordPanel: false,
    screenHeight: 800,
    focusIndex: null,
    chords: ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],
    playing: {
      title: '',
      artist: '',
      capo: 0,
      lyricData: []
    },
    repeat: {
      startIndex: -1,
      endIndex: -1
    },
    guitar_chord_charts: []
  },
  attached() {
    console.log('attached', this.is);
    computed(this, {
      scrollToId() {
        if(this.data.auto_scroll) {
          return `lyric_id${this.data.focusIndex}`
        } else {
          return 'lyric_id'
        }
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
    OnChordPickerChange(e) {
      let selectKey = this.data.chords[e.detail.value]
      if(selectKey == this.data.playing.SelectKey) {
        return
      }
      let trans = new ChordTranspoter(this.data.playing.SelectKey, selectKey)
      let lyricData = this.data.playing.lyricData;
      for (var k in lyricData) {
        let element = lyricData[k]
        if (element.type === 'lyric') {
          for(var node_i in element.data.nodes) {
            let node = element.data.nodes[node_i]
            if(node.node == 'c') {
              this.setData({
                [`playing.lyricData[${k}].data.nodes[${node_i}].content`]: trans.getTransChord(node.content)
              })
            }
          }
        }
      }
      this.setData({
        'playing.SelectKey': selectKey,
        'playing.capo': getCapo(selectKey, this.data.playing.OriginalKey)
      })
    },
    enableAutoScroll(auto_scroll) {
      this.setData({
        auto_scroll: auto_scroll
      })
    },
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
    parseLyricDataV2(lyricContent) {
      console.log('parseLyricDataV2', this.is)
      let parser = new LyricParserV2();
      var ret = parser.parse(lyricContent)
      if(ret) {
        ret.capo = getCapo(ret.SelectKey, ret.OriginalKey);
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
      }
    },
    onChordTap(e) {
      this.setData({
        showChordPanel: true,
        chord_charts: GUITAR_CHORD_CHARTS[e.target.dataset.chord]
      })
    },
    onPageTap(e) {
      if(this.data.showChordPanel) {
        this.setData({
          showChordPanel: false
        })
      }
    },
    loadHelp() {
      this.playing = {}
      this.parseLyricDataV2(HELP_LYRIC)
    },
    loadLyric(lyricSrc) {
      console.log(lyricSrc)
      this.playing = {}
      wx.showNavigationBarLoading()
      var lyricContent = '[00:00.00]\n[00:10.00]'

      wx.request({
        url: encodeURI(lyricSrc),
        method: "GET",
        success: (response) => {
          if (response.statusCode != 200) {
            console.log('ERROR: load lyric failed', response)
            return
          }
          lyricContent = response.data
          this.focusIndex = null
        },
        fail: (error) => {
          console.log('ERROR: load lyric failed', error)
        },
        complete: () => {
          this.parseLyricDataV2(lyricContent)
          wx.hideNavigationBarLoading()
        }
      });
    },
    onLyricLongPress(e) {
      var myEventDetail = this.data.playing.lyricData[e.currentTarget.dataset.lyricidx]; // detail对象，提供给事件监听函数
      var myEventOption = { bubbles: true, composed: true } // 触发事件的选项
      this.triggerEvent('LyricLongPressEvent', myEventDetail, myEventOption)
    },
    onLongPressImage(e) {
      console.log(e.target.dataset.imgurl)
      if(e.target.dataset.imgurl){
        wx.previewImage({
          urls:[e.target.dataset.imgurl]
        })
      }
    }
  }
})