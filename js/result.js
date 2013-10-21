/**
 * Created with JetBrains WebStorm.
 * User: snail
 * Date: 13-10-20
 * Time: 下午10:33
 * To change this template use File | Settings | File Templates.
 */

console.log('result page');
var container = $('#load_ctn');

chrome.storage.local.get('result', function(data) {
	console.log(data);
 	loadTableHtml = _.template($('#load_time_tpl').html());
 	container.html(loadTableHtml(data));
 });
