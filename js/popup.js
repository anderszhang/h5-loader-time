/**
 * Created by shbzhang on 13-10-16.
 */
$(function(){
  //打开配置界面
  $('#cfgBtn').click(function(){
    chrome.tabs.create({
      url:'html/config.html',
      active: true
    }, function (){

    })
  });

  //测量
  $('#startBtn').click(function(){
    var roe = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';
    chrome[roe].sendMessage({type:"start"});
  });
});