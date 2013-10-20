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
            var pData = {};
			if(data.performance){
                this.acc = 0;
                pData.performance = this.analyzePageLoad(data.performance)
			}

            result.push(pData);
		}

	},

	//分析页面加载耗时
	analyzePageLoad:function(performance){
		var t = performance.timing,
        start = t.redirectStart == 0 ?t.fetchStart : t.redirectStart,
        total = t.loadEventEnd - start;
		return {
            redirect : getPageData(0, t.redirectEnd - t.redirectStart),
            dns : getPageData(t.domainLookupStart - start, t.domainLookupEnd - t.domainLookupStart),
            connect : getPageData(t.connectStart - start, t.connectEnd - t.connectStart),
            request: getPageData( t.requestStart - start, t.responseStart - t.requestStart),
            response: getPageData(t.responseStart - start, t.responseEnd - t.responseStart),
            dom: getPageData(t.domLoading - start, t.domComplete - t.domLoading),
            domInteractive: getPageData(t.domInteractive - start, 0, true),
            contentLoaded: getPageData(t.domContentLoadedEventStart - start,
                t.domContentLoadedEventEnd - t.domContentLoadedEventStart, true),
            load:getPageData( t.loadEventStart - start, t.loadEventEnd - t.loadEventStart)
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
	getPageDataData:function(data){
		this.data = data;
	}
}