// components/GuitarPlayer/GuitarPlayer.js
import {watch} from "../../utils/vuefy"
import {getRandomInt} from "../../utils/util"

const SONG_SERVER = "https://guitartools-1257167903.cos.ap-chengdu.myqcloud.com"
const SONG_LIST_FILE = `${SONG_SERVER}/songlist.json`

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songId: {
      type: Number,
      value: -1
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
    onTapMainMenu() {
      // wx.getBackgroundAudioManager的player只能在onpress之类的事件中设置才有效，否则报src为null错
      // 同样title,epname,singer等属性也只能在事件中设定才有效
      let player = this.getPlayer()

      switch(this.data.status) {
        case 'pause':
          this.player.play();
          break;
        case 'stop':
          player.title = this.lyric.playing.title
          player.epname = this.lyric.playing.epname
          player.singer = this.lyric.playing.singer
          player.coverImgUrl = ''
          player.webUrl = "https://blog.telesoho.com"
          player.src = this.lyric.playing.src
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
          this.lyric.loadLyric(this.data.songs[newValue])
        }
      }
    })
    this.playBtn = this.selectComponent("#playBtn")
    this.lyric = this.selectComponent("#lyric")
    this.loadSongList(SONG_LIST_FILE);
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
