
/**
 * 让原生微信小程序支持类似VUE的Watch监控data变化
 * @param {*} ctx 
 * @param {*} watchFunctions 
 */
function watch(ctx, watchFunctions) {
  Object.keys(watchFunctions).forEach(functionName => {
    // 监控obj对象中指定的data数据，如有更新调用回调函数。
    defineWatch(ctx, functionName, ctx.data[functionName], function (oldValue, newValue) {
      watchFunctions[functionName].call(ctx, oldValue, newValue)
    })
  })
}

/**
 * 让原生微信小程序支持类似VUE的Computed功能
 * @param {*} ctx 
 * @param {*} computedFunctions 
 */
function computed(ctx, computedFunctions) {
  let dataNames = Object.keys(ctx.data);
  dataNames.forEach(dataName => {
    defineDataReactive(ctx, dataName, ctx.data[dataName]);
  })

  let functionNames = Object.keys(computedFunctions);
  functionNames.forEach(functionName => {
    defineComputedReactive(ctx, functionName, computedFunctions[functionName]);
  })

  // 将computed中的函数对象，追加到data数据中
  let firstComputedObj = functionNames.reduce((dataObj, functionName) => {
    // set $_regist_function for registion data watch function
    ctx.$_regist_function = {
      funName: functionName,
      funObj : function() {
        ctx.setData({ [functionName]: computedFunctions[functionName].call(ctx) });
      }
    } 

    // calc and set data first time.
    dataObj[functionName] = computedFunctions[functionName].call(ctx);

    // remove $_regist_function
    ctx.$_regist_function = null;
    return dataObj;
  }, {});
  ctx.setData(firstComputedObj);
}


/**
 * define computed functions
 */
function defineComputedReactive(ctx, key, fun) {
  var val;
  let watchList = [];
  Object.defineProperty(ctx.data, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      if (ctx.$_regist_function) {
        // if has regist watch function, than regist it.
        watchList[ctx.$_regist_function.funName] = ctx.$_regist_function.funObj
      }
      if(typeof val === 'undefined') {
        val = fun.call(ctx);
      }
      return val;
    },
    set: function (newVal) {
      if (newVal === val) {
        return
      }
      // if this computed has been changed than call watching functions.
      let watchKeys = Object.keys(watchList);
      if (watchKeys.length) {
        // 用 setTimeout 因为此时 this.data 还没更新
        setTimeout(() => {
          watchKeys.forEach(sub => {
            watchList[sub]();
          })
        }, 0)
      }
      val = newVal
    },
  })
}


/**
 * define data watch functions
 */
function defineDataReactive(ctx, key, val) {
  let watchList = [];
  Object.defineProperty(ctx.data, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      if (ctx.$_regist_function) {
        // regist watch function
        watchList[ctx.$_regist_function.funName] = ctx.$_regist_function.funObj
      }
      return val;
    },
    set: function (newVal) {
      if (newVal === val) return
      let watchKeys = Object.keys(watchList);
      console.log(key, watchKeys);
      if (watchKeys.length) {
        // 用 setTimeout 因为此时 this.data 还没更新
       setTimeout(() => {
          watchKeys.forEach(sub => {
            watchList[sub]();
          })
       }, 0)
      }
      val = newVal
    },
  })
}

/**
 * define watch functions
 */
function defineWatch(ctx, key, oldVal, setFn) {
  let watchFuns = ctx.data['$' + key] || []
  Object.defineProperty(ctx.data, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      return oldVal
    },
    set: function (newVal) {
      if (newVal === oldVal) {
        return
      }
      setFn && setFn(oldVal, newVal)
      if (watchFuns.length) {
        // 用 setTimeout，下一回执行, 因为此时 this.data 还没更新
        setTimeout(() => {
          watchFuns.forEach(watchFun => watchFun())
        }, 0)
      }
      oldVal = newVal;
    },
  })
}

module.exports = { watch, computed }