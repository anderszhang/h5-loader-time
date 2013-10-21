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
            var pData = {title: t.title, url :t.url};
			if(t.performance){
                this.acc = 0;
                pData.performance = this.analyzePageLoad(t.performance)
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
	
	analyzeSrcs :function(){

	},

    getPageData: function(type,start, length, noacc){
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