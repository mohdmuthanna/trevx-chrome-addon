var container = document.getElementById('trevx-get-list-result');

if (container) {
  console.log("Start popup.js");

  function createAudioLine(audioList){
    var links = '';
    for (var i = 0; i < audioList.length; i++) {
      links += "<br><a class='line' id='"+audioList[i].audioId+"' href='"+audioList[i].audioUrl+"'>"+ audioList[i].audioTitle+"</a>"
                +"  " + "<a href='"+audioList[i].audioUrl+"' class='download'>Download<br>";
    }

    return (links);
  };

  function playPause(target) {
    chrome.runtime.sendMessage({
        user_action: "playPause",
        audio_url: target.href
      }, function(response) {
        // document.getElementById("play-pause").innerHTML = response.msg;
      });
  }

  function download(target) {
    chrome.runtime.sendMessage({
        user_action: "download",
        audio_url: target.href
    });
  }

  window.onload = function() {
    console.log("win onload");
    getList();
  };

  function getList() {
    console.log("getList");
    chrome.runtime.sendMessage({
      user_action: "getList"
      },

      function(response) {
        console.log("response");
        // document.body.innerHTML = createAudioLine(response.audioList) + document.body.innerHTML;

        container.innerHTML = createAudioLine(response.audioList);
        var audioLinks = document.querySelectorAll('.line');
        var downloadLinks = document.querySelectorAll('.download');

        for (var i = 0; i < audioLinks.length; i++) {
            audioLinks[i].addEventListener('click', function(event) {
                playPause(this);
            });
        }

        for (var i = 0; i < downloadLinks.length; i++) {
            downloadLinks[i].addEventListener('click', function(event) {
                download(this);
            });
        }



      });
  }
} // end of container
