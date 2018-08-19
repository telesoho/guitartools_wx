
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
  let functionNames = Object.keys(computedFunctions)
  functionNames.forEach(functionName => {
    defineComputed(ctx, functionName, computedFunctions[functionName]);
  })
  
  // 将computed中的函数对象，追加到data数据中
  let firstComputedObj = functionNames.reduce((dataObj, functionName) => {
    // cacl and set  data first time.
    dataObj[functionName] = computedFunctions[functionName].call(ctx)
    return dataObj;
  }, {});
  ctx.setData(firstComputedObj);
}

/**
 * define computed functions
 */
function defineComputed(ctx, key, getFn) {
  ctx['_$get_' + key] = getFn;
  Object.defineProperty(ctx.data, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      return ctx['_$get_' + key].call(ctx);
    },
    set: function (newVal) {
      // console.trace(key, newVal);
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