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

const getRandomInt = function(max, min=0, blacklist=[]) {
  if(!blacklist)
      blacklist = []
  let rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  let retv = min;
  let tryCount = 100;
  while(tryCount > 0 && blacklist.indexOf(retv = rand(min,max)) > -1) {
    tryCount --;
  }
  if(tryCount <= 0 ) {
    console.log('ERROR', tryCount);
  }
  return retv;
}

module.exports = {
  formatTime: formatTime,
  toCss,
  getRandomInt
}
