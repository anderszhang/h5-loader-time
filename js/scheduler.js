/**
 * Created by shbzhang on 13-10-17.
 */
var h5 = window.h5||{};
h5.scheduler = {

  curTaskIdx : 0,

  taskSet : [
    {
      'title': '去哪儿',
      'url': 'http://touch.qunar.com',
      'beforeAction':'',
      'filter':'bf.gif'
    },
    {
      'title': '携程首页',
      'url': 'http://m.ctrip.com',
      'beforeAction':''
    }
  ],

  getCurTask: function(){
    if(this.isAvailable()){
      return this.taskSet[this.curTaskIdx];
    }
    return null;
  },

  nextTask: function(){
    this.curTaskIdx++;
    return this.getCurTask();
  },

  setTaskSet:function(taskSet){
    this.taskSet = taskSet;
  },

  stop:function(){
    this.curTaskIdx = 0;
  },

  isAvailable:function(){
    var ln = this.taskSet.length;
    return ln > 0 && this.curTaskIdx<ln;
  }
};