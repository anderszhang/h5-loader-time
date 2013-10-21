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
		return {
            redirect : this.getPageData(0, t.redirectEnd - t.redirectStart),
            dns : this.getPageData(t.domainLookupStart - start, t.domainLookupEnd - t.domainLookupStart),
            connect : this.getPageData(t.connectStart - start, t.connectEnd - t.connectStart),
            request: this.getPageData( t.requestStart - start, t.responseStart - t.requestStart),
            response: this.getPageData(t.responseStart - start, t.responseEnd - t.responseStart),
            dom: this.getPageData(t.domLoading - start, t.domComplete - t.domLoading),
            domInteractive: this.getPageData(t.domInteractive - start, 0, true),
            contentLoaded: this.getPageData(t.domContentLoadedEventStart - start,
                t.domContentLoadedEventEnd - t.domContentLoadedEventStart, true),
            load:this.getPageData( t.loadEventStart - start, t.loadEventEnd - t.loadEventStart)
        }
	},
	
	analyzeSrcs :function(){

	},

    getPageData: function(start, length, noacc){
        if (!noacc) {
            this.acc += length;
        }
        return {
            "start":start,
            "length":length,
            "total": noacc ? '-' : this.acc
        }
    },
	setData:function(data){
		this.data = data;
	}
}