/**
 * Created by shbzhang on 13-10-17.
 */

var h5 = window.h5 || {};
h5.bg = {
  statistic: h5.statistic,
  analyze: h5.analyze,
  scheduler: h5.scheduler,
  roe: chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension',

  openTab: null,

  //初始化监听
  initListenter: function () {
    var self = this;
    //监听全局事件
    chrome[this.roe].onMessage.addListener(function (request, sender, sendResponse) {

      var type = request.type;
      if (type == "autoStart") {
        self.start(request.config);
      } else if (type == 'manualStart') {
        self.manaulStart();
      } else if (type == 'manualStop') {
        self.stop();
      } else if (type == "loadComplete") {
        if (self.scheduler.isRuning) {
          if (!self.scheduler.isAutoMode) {
            self.statistic.setTaskContext({
              'url': sender.url
            });
          }
          self.statistic.savePagePerformance(request);
          if (self.scheduler.isAutoMode) {
            self.next(request);
          }
        }
      }
    });

    //监听请求发起响应
    chrome.webRequest.onSendHeaders.addListener(function (detail) {
      if (self.scheduler.isRuning) {
        self.statistic.saveSrcRequestTime(detail);
      }
    }, {urls: ["http://*/*", "https://*/*"]}, []);

    //监听响应，此次主要是获取Response头部的数据Size
    chrome.webRequest.onResponseStarted.addListener(function (detail) {
      if (self.scheduler.isRuning) {
        self.statistic.saveSrcResponseStartTime(detail);
      }
    }, {urls: ["http://*/*", "https://*/*"]}, ["responseHeaders"]);

    //监听完成时间
    chrome.webRequest.onCompleted.addListener(function (detail) {
      if (self.scheduler.isRuning) {
        self.statistic.saveSrcCompleteTime(detail, 'onCompleted');
      }
    }, {urls: ["http://*/*", "https://*/*"]}, []);
  },


  start: function (taskSet) {
    var self = this;
    if (taskSet) {
      this.scheduler.setTaskSet(taskSet);
    }
    chrome.storage.local.clear();
    this.scheduler.setAutoMode(true);
    if (!this.scheduler.start()) {
      return;
    }
    ;

    var task = this.scheduler.getCurTask();
    this.statistic.setTaskContext(task);
    chrome.tabs.create({
        url: task.url
      },
      function (tab) {
        self.openTab = tab;
      });

  },

  //手动采集开始
  manaulStart: function () {
    this.scheduler.setAutoMode(false);
    this.scheduler.start();
    var self = this;
    chrome.storage.local.clear();
    //注册update监听
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      self.openTab = tab;
      if (changeInfo && changeInfo.url && changeInfo.url.indexOf('chrome-devtools://') < 0) {
        self.statistic.setTaskContext(changeInfo);
      }
    });
    chrome.tabs.reload();
  },


  next: function (data) {
    var task = this.scheduler.nextTask();
    if (task) {
      this.statistic.setTaskContext(task);
      chrome.tabs.update({
        openerTabId: this.openTab.openerTabId,
        url: task.url
      });
    } else {
      this.stop();
    }
  },


  stop: function () {
    this.scheduler.stop();
    this.analyze.setData(this.statistic.getData());
    this.analyze.start();
    chrome.tabs.update({
      openerTabId: self.openTab,
      url: 'html/result.html'
    });
  },

  init: function () {
    this.initListenter();
  },

  changeManaulUI: function () {
    //创建提醒
    chrome.notifications.create('', {
        type: "basic",
        iconUrl: "../res/img/logo_16.png",
        title: "",
        message: "性能参数手动采集中........",
        eventTime: Date.now() + 900000000,
        buttons: [
          {title: '停止'}
        ]
      }, function () {
      }
    );

    //按钮停止
    chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
      chrome.notifications.clear(notificationId, function () {

      });
    });
  },
  isEmptyObject: function (obj) {
    for (var name in obj) {
      return false;
    }
    return true;
  }
};

h5.bg.init();