/**
 * Created with JetBrains WebStorm.
 * User: snail
 * Date: 13-10-20
 * Time: 下午10:33
 * To change this template use File | Settings | File Templates.
 */
;

$(function(){
	$('#nav_tabs').click(function(e){
		var tab = $(e.target).parent();
		if(tab.hasClass("active")){
				return;
		}
		tab.addClass("active");
		if(tab.data('val')=='time'){
			container.show();
			src_ctn.hide();
			$('#src_tab').removeClass("active");
		}else{
			container.hide();
			src_ctn.show();
			$('#time_tab').removeClass("active");
		}
	});

	var container = $('#load_ctn'),
	src_ctn = $('#src_ctn');
	src_ctn.hide()
	chrome.storage.local.get('result', function(data) {
		console.log(data);
	 	var loadTableHtml = _.template($('#load_time_tpl').html()),
	 	srcTableHtml = _.template($('#load_src_tpl').html());
	 	container.html(loadTableHtml(data));
	 	src_ctn.html(srcTableHtml(data));
	 });
});