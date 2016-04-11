var container = document.getElementById('trevx-when-popup-opened');

if (container) {
  console.log("Start popup.js");
  function createAudioLine(searchResultList){
    var links = '';
    for (var i = 0; i < searchResultList.length; i++) {
      links += "<br><a class='line' id='"+searchResultList[i].audioId+"' href='"+searchResultList[i].audioUrl+"'>"+ searchResultList[i].audioTitle+"</a>"
                +"  " + "<a href='"+searchResultList[i].audioUrl+"' class='download'>Download<br>";
    }
    return (links);
  };

  function createPlayListView(playList){
    var output = '';
    output = playList.playListTitle + createAudioLine(playList.content);
    return (output);
  };

  function playPause(target) {
    chrome.runtime.sendMessage({
        user_action: "playPause",
        audio_url: target.href
      }, function(response) {
        // document.getElementById("play-pause").innerHTML = response.msg;
      });
  };

  function download(target) {
    chrome.runtime.sendMessage({
        user_action: "download",
        audio_url: target.href
    });
  };

  window.onload = function() {
    console.log("win onload");
    getList();
    getPlayList();
  };

  function getPlayList() {
    // console.log("getPlayList");
    chrome.runtime.sendMessage({
      user_action: "getPlayList",
      play_list_id: "id-road"
      },

      function(response) {
        document.getElementById('trevx-get-play-list').innerHTML = createPlayListView(response.playList);
        var audioLinks = document.querySelectorAll('.line');
        var downloadLinks = document.querySelectorAll('.download');

        // for (var i = 0; i < audioLinks.length; i++) {
        //     audioLinks[i].addEventListener('click', function(event) {
        //         playPause(this);
        //     });
        // }
        //
        // for (var i = 0; i < downloadLinks.length; i++) {
        //     downloadLinks[i].addEventListener('click', function(event) {
        //         download(this);
        //     });
        // }
      });
  }

  function getList() {
    console.log("getList");
    chrome.runtime.sendMessage({
      user_action: "getList"
      },

      function(response) {
        document.getElementById("trevx-get-list-result").innerHTML = createAudioLine(response.searchResultList);
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
