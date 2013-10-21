$(function () {
  $('#cleanBtn').click(function (e) {
    $('#taskCfg').val('');
  });

  $('#saveBtn').click(function (e) {

    var cfgData = getConfig()
    if (cfgData) {
      chrome.storage.local.set({'config': cfgData});
    }
  });

  $('#startBtn').click(function (e) {
    var cfgData = getConfig();
    if (cfgData) {
      chrome.runtime.sendMessage({type: "autoStart", config: cfgData});
    }
  });

  function getConfig() {
    var cfgStr = $('#taskCfg').val();
    try {
      return JSON.parse(cfgStr);
    } catch (e) {
      alert('格式不正确！');
      return;
    }
  }
});