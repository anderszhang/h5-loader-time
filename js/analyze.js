/**
 * Created by shbzhang on 13-10-17.
 */
var h5 = window.h5||{};
h5.analyze = {

	data : null,
	start : function(){
		if(!this.data){
			return;
		}
		var result = {},data = this.data;
		for(var i in  data){
			console.log(data[i]);
			if(data.performance){
				this.analyzePageLoad(data.performance)
			}
		}
	},

	//分析页面加载耗时
	analyzePageLoad:function(performance){
		var t = performance.timing;
		return [
			{ 
				"type": 'redirect',
				"length": 0
			},
			{ 
				"type": 'dns',
				"length": 0
			},
			{ 
				"type": 'redirect',
				"length": 0
			},
			{ 
				"type": 'dns',
				"length": 0
			}
		];
	},
	
	analyzeSrcs :function(){

	},
	setData:function(data){
		this.data = data;
	}
}