const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function toCss(obj) {
  return Object.keys(obj).reduce((cssStr, key) => {
    return `${cssStr} ${key}:${obj[key]};`;
  },"");
}

/**
 * This JavaScript function always returns a random number between min (included) and max (excluded):
 * @param {*} max 
 * @param {*} min 
 * @param {*} blacklist 
 */
const getRandomInt = function(max, min=0, blacklist=[]) {
  let rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  let retv = min;
  if(blacklist) {
    let tryCount = 100;
    while(tryCount > 0 && blacklist.indexOf(retv = rand(min,max)) > -1) {
      tryCount --;
    }
  } else {
    retv = rand(min,max)
  }
  return retv;
}

/**
 * 将rpx单位转为px单位
 * @param {*} rpx 
 */
const rpx2px = function(rpx) {
  var systemInfo = wx.getSystemInfoSync();
  return rpx / 750 * systemInfo.windowWidth;
}

const toRadians = function (angle) {
  return angle * (Math.PI / 180)
}

module.exports = {
  formatTime: formatTime,
  toCss,
  getRandomInt,
  rpx2px,
  toRadians
}
