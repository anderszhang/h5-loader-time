/**
 * Created by shbzhang on 13-10-17.
 */
var h5 = window.h5||{};
h5.analyze = {

	data : null,
    acc : 0,
	start : function(){
		if(!this.data){
			return;
		}
		var result = [],data = this.data;
		for(var i in  data){
            var t = data[i];
            this.acc = 0;
            var pData = {title: t.title, url :t.url};
            console.log(t);
			if(t.performance){
                pData.performance = this.analyzePageLoad(t.performance)
			}else{
                //否则为单页应用
                pData.performance = this.analyzeSPAPageLoad(t.srcs);
            }
            result.push(pData);
		}
        //console.log('save Data'  + {result:result});
        chrome.storage.local.set({'result':result});
	},

	//分析页面加载耗时
	analyzePageLoad:function(performance){
		var t = performance.timing,
        start = t.redirectStart == 0 ?t.fetchStart : t.redirectStart,
        total = t.loadEventEnd - start;
		return [
            this.getPageData('redirect',0, t.redirectEnd - t.redirectStart),
            this.getPageData('dns',t.domainLookupStart - start, t.domainLookupEnd - t.domainLookupStart),
            this.getPageData('connect',t.connectStart - start, t.connectEnd - t.connectStart),
            this.getPageData('request', t.requestStart - start, t.responseStart - t.requestStart),
            this.getPageData('response',t.responseStart - start, t.responseEnd - t.responseStart),
            this.getPageData('dom',t.domLoading - start, t.domComplete - t.domLoading),
            this.getPageData('domInteractive',t.domInteractive - start, 0, true),
            this.getPageData('contentLoaded',t.domContentLoadedEventStart - start,
               t.domContentLoadedEventEnd - t.domContentLoadedEventStart, true),
            this.getPageData('load',t.loadEventStart - start, t.loadEventEnd - t.loadEventStart)
        ]
	},
	
    //分析单页应用性能
    analyzeSPAPageLoad:function(data){
        var ln =  data['xmlhttprequest'].length;
        if(ln >0){
             var ts = data['xmlhttprequest'][ln-1];
             start = ts.timeStamp;
             responseStart = ts.responseStartTime || start;
             responseEnd = ts.completeEndTime || start;
        }
        return [
            this.getPageData('redirect',0, 0),
            this.getPageData('dns',0, 0),
            this.getPageData('connect',0, 0),
            this.getPageData('request', 0, responseStart - start>0),
            this.getPageData('response',responseEnd - start, responseEnd - responseStart),
            this.getPageData('dom',0, 0),
            this.getPageData('domInteractive',0, 0),
            this.getPageData('contentLoaded',0, 0),
            this.getPageData('load',0, 0)
        ]
    },

	analyzeSrcs :function(){

	},

    getPageData: function(type,start, length, noacc){
         start = Math.round(start);
         length = Math.round(length);
        if (!noacc) {
            this.acc += length;
        }
        return {
            "type": type,
            "start":start,
            "length":length,
            "total": noacc ? '-' : this.acc
        }
    },
	setData:function(data){
		this.data = data;
	}
}