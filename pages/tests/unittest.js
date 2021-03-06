// pages/tests/unittest.js
import {
  LyricParserV2
} from "../../utils/LyricParserV2"

const TEST_LYRIC = `
[ti:島唄]
[ar:夏川りみ]
[al:おきなわうた]
[ly:宮沢和史]
[mu:宮沢和史]
[变调夹:0]
[原调:A]
[选调:C]
[歌词制作:毛南子]
[#]过门
[00:00.000]{Bm}{Cm}{Asub9}
[#]主歌
[img]http://www.google.com
[00:19.726]<250>で<700>い<900>ご{Am}<450>の<650>花{Bm}<501>が<450>咲<1150>き
[x-trans]刺桐花开
[00:24.777]<550>風<801>を<299>呼<500>び<351>嵐<749>が<1051>来<5800>た
[x-trans]呼风唤雨
[00:44.478]<300>{A}で<300>い<801>ご<549>が<450>咲<400>き<750>乱<1000>れ{C7}
[x-trans]刺桐花乱
[00:49.028]<650>風<550>を<301>呼<600>び<799>嵐<750>が<550>来<2401>た
[x-trans]呼风唤雨
[00:55.629]<350>く<350>り<1201>返<449>す<500>悲<700>し<400>み<750>は
[x-trans]往复的悲伤
[01:00.329]<550>島<701>渡<999>る<550>波<350>の<500>よ<3300>う
[x-trans]如同过岛的波浪
[01:07.279]<300>ウ<350>ー<400>ジ<301>の<849>森<801>で<349>あ<450>な<401>た<499>と<351>出<400>会<799>い
[x-trans]在甘蔗林中与你相遇
[01:14.113]<249>ウ<300>ー<250>ジ<350>の<750>下<910>で<290>千<450>代<459>に<251>さ<500>よ<391>な<2902>ら
[x-trans]又在甘蔗下和你永别
[01:22.165]<359>島<290>唄<860>よ <291>風<609>に<400>乗<1050>り
[x-trans]故乡的歌谣啊乘着风
[01:27.862]<349>鳥<449>と<251>と<300>も<1501>に <698>海<401>を<1000>渡<2251>れ
[x-trans]和鸟儿一同渡过大海
[01:35.630]<651>島<601>唄<696>よ <353>風<1076>に<400>乗<600>り
[x-trans]故乡的歌谣啊乘着风
[01:40.007]<701>届<449>け<350>て<401>お<471>く<1794>れ <550>私<700>の<3200>涙
[x-trans]把我的泪也带走
[01:48.623]<350>で<350>い<1000>ご<300>の<801>花<702>も<400>散<750>り
[x-trans]刺桐花散
[01:53.276]<400>さ<350>ざ<1250>波<569>が<256>ゆ<350>れ<450>る<600>だ<2150>け
[x-trans]微波荡漾
[01:59.651]<300>さ<450>さ<452>や<750>か<500>な<1050>幸<451>せ<1049>は
[x-trans]小小的幸福
[02:04.653]<350>う<300>た<650>か<800>た<450>の<600>波<650>の<2905>花
[x-trans]如同虚无的浪花
[02:11.358]<550>ウ<401>ー<299>ジ<550>の<550>森<700>で<475>歌<300>っ<550>た<1400>友<550>よ
[x-trans]在甘蔗林中唱歌的朋友啊
[02:17.683]<450>ウ<300>ー<400>ジ<400>の<900>下<900>で<350>八<350>千<300>代<700>の<750>別<3110>れ
[x-trans]就在甘蔗下和你永别
[02:26.593]<450>島<690>唄<710>よ <352>風<790>に<500>乗<1451>り
[#]副歌
[x-trans]故乡的歌谣啊乘着风
[02:31.536]<408>鳥<616>と<350>と<450>も<1700>に <550>海<450>を<450>渡<2700>れ
[x-trans]和鸟儿一同渡过大海
[02:39.210]<900>島<1251>唄<499>よ <600>風<701>に<449>乗<450>り
[x-trans]故乡的歌谣啊乘着风
[02:44.060]<450>届<450>け<350>て<450>お<501>く<1349>れ <1250>私<550>の<600>愛<3901>を
[x-trans]把我的爱也带走
[03:19.413]<251>海<450>よ <401>宇<349>宙<1300>よ <500>神<751>よ <399>い<601>の<400>ち<1500>よ
[x-trans]大海啊宇宙啊神灵啊生命啊
[03:26.315]<350>こ<251>の<249>ま<600>ま<750>永<400>遠<600>に<1155>夕<849>凪<5263>を
[x-trans]就这样永远风平浪静吧
[03:36.782]<698>島<1551>唄<450>よ <350>風<601>に<349>乗<1150>り
[x-trans]故乡的歌谣啊乘着风
[03:41.931]<450>鳥<451>と<399>と<501>も<1501>に <501>海<799>を<700>渡<2950>れ
[x-trans]和鸟儿一同渡过大海
[03:50.183]<1425>島<851>唄<699>よ <250>風<350>に<351>乗<799>り
[x-trans]故乡的歌谣啊乘着风
[03:54.908]<250>届<450>け<550>て<351>お<499>く<1514>れ <601>私<950>の<3357>涙
[x-trans]把我的泪也带走
[04:03.430]<1399>島<401>唄<449>よ <600>風<450>に<450>乗<1300>り
[x-trans]故乡的歌谣啊乘着风
[04:08.479]<850>鳥<350>と<350>と<300>も<1800>に <550>海<400>を<500>渡<3050>れ
[x-trans]和鸟儿一同渡过大海
[04:17.823]<350>島<350>唄<751>よ <200>風<400>に<350>乗<1401>り
[x-trans]故乡的歌谣啊乘着风
[04:21.820]<300>届<350>け<300>て<250>お<350>く<806>れ <2302>私<350>の<750>愛<1800>を
[x-trans]把我的爱也带走
[#]结尾
[04:29.378]<550>ラ<453>ラ<10750>ラ
[x-trans]啦啦啦
`

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ret:"",
    wxAppendData: [
      {
        node: 't',
        content: '父节点',
        child: [{
            node: 'c',
            content: 'F'
          },
          {
            node: 't',
            content: '哈哈'
          },
          {
            node: 'c',
            content: 'F'
          },
        ],
      },
      {
        node: 't',
        content: '父节点',
        child: [{
            node: 'c',
            content: 'F'
          },
          {
            node: 't',
            content: '哈哈'
          },
          {
            node: 'c',
            content: 'F'
          },
        ],
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let parse = new LyricParserV2()
    let ret = parse.parse(TEST_LYRIC);

    this.setData({
      ret: ret
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data.wxAppendData)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})