/**
 * Created by shbzhang on 13-10-16.
 */
$(function(){
//  console.log('ddd');
//  $('#start').click(function(){
    chrome.tabs.create({
      url:'html/config.html',
      active: true
    }, function (){

    });
//  });
});