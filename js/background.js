/**
 * Created by shbzhang on 13-10-17.
 */

var h5 = window.h5||{};
h5.bg = {
  statistic : h5.statistic,
  scheduler : h5.scheduler,
  roe : chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension',

  openTab : null,

  //初始化监听
  initListenter: function(){
   var self = this;
   //监听全局事件
   chrome[this.roe].onMessage.addListener(function(request, sender, sendResponse) {

       var type = request.type;
      console.log(type);
       if(type == "start"){
         self.start();
       }else if(type =="next"){
         self.statistic.savePagePerformance(request);
         self.next(request);
       }
   });
   //监听响应，此次主要是获取Response头部的数据Size
   chrome.webRequest.onResponseStarted.addListener(function(detail) {
       self.statistic.saveSrcPerformance(detail);
   },{urls: ["http://*/*","https://*/*"]}, ["responseHeaders"]);
  },


  start : function(){
    if(!this.scheduler.isAvailable()){
      return;
    }
    var self = this,
        task = this.scheduler.getCurTask();
    console.log("start"+task.url);
    this.statistic.setTaskContext(task);
    chrome.tabs.create({
        url : task.url
      },
      function(tab){
        self.openTab = tab;
     });

  },

  next: function(data){
    var task = this.scheduler.nextTask();
    if(task){
      this.statistic.setTaskContext(task);
      chrome.tabs.update({
         openerTabId:this.openTab.openerTabId,
         url : task.url
        });
    }else{
      this.stop();
    }
  },


  stop: function(){
    this.scheduler.stop();
  },

  init:function(){
    this.initListenter();
  }
};

h5.bg.init();