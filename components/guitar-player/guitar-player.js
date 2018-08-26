// components/GuitarPlayer/GuitarPlayer.js
import {LyricParser} from "../../utils/LyricParser"
import {watch} from "../../utils/vuefy"
import {getRandomInt} from "../../utils/util"


const NAV_BACKGROUND_COLOR = [ '#ffffff', '#add8e6', '#90ee90', '#A974A2', '#ff0000']
const NAV_FRONT_COLOR = ['#000000', '#000000','#000000', '#ffffff', '#ffffff']
const SONG_SERVER = "https://guitartools-1257167903.cos.ap-chengdu.myqcloud.com"
const SONG_LIST = `${SONG_SERVER}/songlist.json`

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songId: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    status: 'stop',
    loop: false,
    songs: [
      {
      songSrc: `${SONG_SERVER}/島唄.mp3`,
      lyricSrc: `${SONG_SERVER}/島唄.xtrc`,
      chordSrc: {
          src: `${SONG_SERVER}/島唄.chord.json`,
          capo: 1
        }
      },
      {
        songSrc: `${SONG_SERVER}/小幸运.mp3`,
        lyricSrc: `${SONG_SERVER}/小幸运.trc`,
        chordSrc: {
            src: `${SONG_SERVER}/小幸运.chord.json`,
            capo: 0
        }
      },
      {
        songSrc: `${SONG_SERVER}/借我.mp3`,
        lyricSrc: `${SONG_SERVER}/借我.trc`,
        chordSrc: {
            src: `${SONG_SERVER}/借我.chord.json`,
            capo: 0
        }
      },
      {
        songSrc: `${SONG_SERVER}/春风十里-毛南子.mp3`,
        lyricSrc: `${SONG_SERVER}/春风十里-毛南子.mp3.lrc`,
        chordSrc: {
            src: `${SONG_SERVER}/春风十里-毛南子.chord.json`,
            capo: 0
        }
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onRandomNext(e) {
      let newSongId =  getRandomInt(this.data.songs.length, 0, [this.data.songId])
      this.setData({songId: newSongId })
    },
    onNavTo(e) {
      wx.navigateTo({
        url:'/pages/index/index?sid=3'
      })
    },
    onTapMainMenu() {
      // wx.getBackgroundAudioManager的player只能在onpress之类的事件中设置才有效，否则报src为null错
      // 同样title,epname,singer等属性也只能在事件中设定才有效
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
          wx.hideNavigationBarLoading()
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
  
        player.onWaiting((res)=>{
          wx.showNavigationBarLoading()
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
    getRandomColorIndex() {
      this.NavColorIndex = getRandomInt(NAV_BACKGROUND_COLOR.length, 0, [this.NavColorIndex])
      console.log('this.NavColorIndex', this.NavColorIndex)
      return this.NavColorIndex
    },

    loadLyric (song) {
      let parser = new LyricParser();
      wx.showNavigationBarLoading()
      this.playing = {}
      wx.request({
        url: song.lyricSrc,
        method: "GET",
        success: (response) => {
          console.log(response);
          if(response.statusCode != 200) {
            console.log('ERROR: load lyric not found', response.statusCode)
            var lyricContent = '[00:00.00]\n[00:10.00]'
            var ret = parser.parse(lyricContent, '[{"start": 0, "end": 10, "chord": "N"}]')
            this.playing.lyricData = ret.lyricData
            return
          }
          var lyricContent = response.data
          this.focusIndex = null
          wx.showNavigationBarLoading()
          wx.request({
            url: song.chordSrc.src,
            method: "GET",
            success: (response) => {
              console.log(response);
              if(response.statusCode != 200) {
                console.log('ERROR: load chord failed', response.statusCode)
                var ret = parser.parse(lyricContent, '[{"start": 0, "end": 10, "chord": "N"}]')
                this.playing.title = ret.title
                this.playing.singer = ret.artist
                this.playing.epname = "六叠空间"
                this.playing.capo = ret.capo
                this.playing.lyricData = ret.lyricData
                return
              }
              var ret = parser.parse(lyricContent, response.data, song.chordSrc.capo)
              this.playing.title = ret.title
              this.playing.singer = ret.artist
              this.playing.epname = "六叠空间"
              this.playing.capo = ret.capo
              this.playing.lyricData = ret.lyricData
            },
            fail: (error) => {
              console.log('ERROR: load chord failed', error)
              var ret = parser.parse(lyricContent, '[{"start": 0, "end": 10, "chord": "N"}]')
              this.playing.title = ret.title
              this.playing.singer = ret.artist
              this.playing.epname = "六叠空间"
              this.playing.capo = ret.capo
              this.playing.lyricData = ret.lyricData
            },
            complete: () => {
              wx.setNavigationBarTitle({
                title: `${this.playing.title} - ${this.playing.singer}`
              })
              let colorIndex = this.getRandomColorIndex();
              wx.setNavigationBarColor({
                frontColor: NAV_FRONT_COLOR[colorIndex],
                backgroundColor: NAV_BACKGROUND_COLOR[colorIndex],
                animation: {
                    duration: 400,
                    timingFunc: 'easeIn'
                }
              })
              wx.hideNavigationBarLoading()
            }
          })

          this.playing.src = song.songSrc;
        },
        fail: (error) => {
          console.log('ERROR: load lyric failed', error)
          var lyricContent = '[00:00.00]\n[00:10.00]'
          var ret = parser.parse(lyricContent, '[{"start": 0, "end": 10, "chord": "N"}]')
          this.playing.lyricData = ret.lyricData
        },
        complete: () => {
          wx.hideNavigationBarLoading()
        }
      });
    },
    loadSongList($songlist_url) {
      wx.request({
        url: $songlist_url,
        method: "GET",
        success: (response) => {
          if(response.statusCode == 200) {
            console.log('response.data', response.data);
            this.setData({
              songs: response.data
            })
          }
        },
        complete: () => {
          this.loadLyric(this.data.songs[this.data.songId])
        }
      });
    }
  },
  attached() {
    console.log('attached', this.is);
    watch(this, {
      songId(oldValue, newValue) {
        if(newValue < this.data.songs.length && newValue >= 0) {
          let player = this.getPlayer();
          player.stop();
          this.loadLyric(this.data.songs[newValue])
        }
      }
    })
    this.playBtn = this.selectComponent("#playBtn")
    this.loadSongList(SONG_LIST);
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
