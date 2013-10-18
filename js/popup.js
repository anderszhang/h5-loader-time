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

  //自动收集开始
  $('#autoStartBtn').click(function(){
    chrome.runtime.sendMessage({type:"autoStart"});
  });

  //手动模式开始
  $('#manualStartBtn').click(function(){
    chrome.runtime.sendMessage({type:"manualStart"});
  });
  //手动模式停止
  $('#manualStopBtn').click(function(){
    chrome.runtime.sendMessage({type:"manualStop"});
  });
});