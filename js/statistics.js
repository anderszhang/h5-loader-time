/**
 * Created by shbzhang on 13-10-17.
 */
var h5 = window.h5 || {};
h5.statistic = {
  task: null,
  dataContainer: {},

  //保存页面载入性能数据
  savePagePerformance: function (data) {
    var TData = this.getCurTaskData();
    if (TData) {
      TData.performance = data;
      this.dataContainer[TData.url] = TData;
    }
  },

  //保存请求发起时间
  saveSrcRequestTime: function (data) {
    var TData = this.getCurTaskData();
    if (TData) {
      var srcs = TData.srcs;
      srcs[data.type].push(data);
      this.dataContainer[TData.url ] = TData;
    }
  },

  //保存资源响应开始时间
  saveSrcResponseStartTime: function (data) {
    var TData = this.getCurTaskData();
    if (TData) {
      var srcs = TData.srcs;
      var srcPfs = srcs[data.type];
      //此处有优化空间
      for (var i = 0; i < srcPfs.length; i++) {
        if (srcPfs[i].requestId = data.requestId) {
          srcPfs[i].responseStartTime = data.timeStamp;
          srcPfs[i].responseHeaders = data.responseHeaders;
          srcPfs[i].fromCache = data.fromCache;
        }
      }
      //srcs[data.type].push(data);
      this.dataContainer[TData.url ] = TData;
    }
  },
 //保存资源请求结束时间
  saveSrcCompleteTime: function (data) {
    var TData = this.getCurTaskData();
    if (TData) {
      var srcs = TData.srcs;
      var srcPfs = srcs[data.type];
      //此处有优化空间
      for (var i = 0; i < srcPfs.length; i++) {
        if (srcPfs[i].requestId = data.requestId) {
          srcPfs[i].completeEndTime = data.timeStamp;
        }
      }
      this.dataContainer[TData.url ] = TData;
    }
  },
  setTaskContext: function (task) {
    return this.task = task;
  },

  getCurTaskData: function () {
    if (!this.task) {
      return;
    }
    var key = this.task.url, TData = null;
    if (key) {
      TData = this.dataContainer[key];
      if (!TData) {
        TData = {
          title: this.task.title,
          url: key,
          srcs: {
            main_frame: [],
            sub_frame: [],
            stylesheet: [],
            script: [],
            image: [],
            object: [],
            xmlhttprequest: [],
            other: []
          }
        }
        this.dataContainer[key] = TData;
      }
    }
    return TData;
  },

  saveData: function () {
    chrome.storage.local.set(this.dataContainer);
  },

  getData: function () {
    return this.dataContainer;
  },

  clearData:function(){
    this.dataContainer = {};
    this.task = null;
    chrome.storage.local.clear();
  }
};