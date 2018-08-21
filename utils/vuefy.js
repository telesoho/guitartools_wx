/**
 * vuefy.js
 * 
 * Author: telesoho
 * 
 * 使用方法：
 * 
Component({
  properties: {
    percent: {
      type: Number,
      value: 0
    },
  },
  data: {
    v1 : 1
  },
  attached() {
    watch(this, {
      percent() {
        this.data.v1 = this.data.percent;
      }
    }),
    computed(this, {
      cal () {
        return this.data.v1 * 2;
      },
      str_percent() {
        return `${this.data.percent}%`;
      }
    })
  }
})
 */

/**
 * 让原生微信小程序支持类似VUE的Watch监控data变化
 * @param {*} ctx 
 * @param {*} watchFunctions 
 */
function watch(ctx, watchFunctions) {
  Object.keys(watchFunctions).forEach(functionName => {
    // 监控obj对象中指定的data数据，如有更新调用回调函数。
    defineDataReactive(ctx, functionName, ctx.data[functionName], function (oldValue, newValue) {
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
 * @param {*} ctx 
 * @param {*} key 
 * @param {*} fun 
 */
function defineComputedReactive(ctx, key, fun) {
  var val;
  let registerWatchFnList = [];
  Object.defineProperty(ctx.data, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      if (ctx.$_regist_function) {
        // if has regist watch function, than regist it.
        registerWatchFnList[ctx.$_regist_function.funName] = ctx.$_regist_function.funObj
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
      let watchKeys = Object.keys(registerWatchFnList);
      if (watchKeys.length) {
        // 用 setTimeout 因为此时 this.data 还没更新
        setTimeout(() => {
          watchKeys.forEach(sub => {
            registerWatchFnList[sub]();
          })
        }, 0)
      }
      val = newVal
    },
  })
}

/**
 * define data watch functions
 * @param {*} ctx 
 * @param {*} dataKey 
 * @param {*} val 
 */
function defineDataReactive(ctx, dataKey, val, watchFn) {
  if(watchFn) {
    if(typeof ctx.$registerWatchFnList === 'undefined') {
      ctx.$registerWatchFnList = []
    }
    ctx.$registerWatchFnList[dataKey] = watchFn;
  }
  let registerComputedNotifyFnList = [];
  Object.defineProperty(ctx.data, dataKey, {
    configurable: true,
    enumerable: true,
    get: function () {
      if (ctx.$_regist_function) {
        // regist watch function
        registerComputedNotifyFnList[ctx.$_regist_function.funName] = ctx.$_regist_function.funObj
      }
      return val;
    },
    set: function (newVal) {
      if (newVal === val) {
        return
      }
      console.log(newVal);
      // call watch funtion
      if(ctx.$registerWatchFnList && ctx.$registerWatchFnList[dataKey]) {
        ctx.$registerWatchFnList[dataKey](val, newVal);
      }

      let computedFunctionNames = Object.keys(registerComputedNotifyFnList);
      if (computedFunctionNames.length) {
        // use setTimeout to call watch function
        setTimeout(() => {
          computedFunctionNames.forEach(sub => {
            registerComputedNotifyFnList[sub]();
          })
       }, 0)
      }
      val = newVal;
    },
  })
}

module.exports = { watch, computed }