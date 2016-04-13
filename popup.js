var container = document.getElementById('trevx-search-result-list');

if (container) {
  console.log("Start popup.js");

  function createAudioLines(searchResultList){
    var links = '';
    for (var i = 0; i < searchResultList.length; i++) {
      links += "<li>"
                + "<a class='action play' id='"+searchResultList[i].audioId+"'  href="+ searchResultList[i].audioUrl +"></a>"
                + "<a class='title' id='"+searchResultList[i].audioId+"' href='"+searchResultList[i].audioUrl+"'>"+ searchResultList[i].audioTitle+"</a>"
                + "<a class='download' href='"+searchResultList[i].audioUrl+"'>"
                + "</li>";
    }
    return (links);
  };

  function playPause(target) {
    // alert(target.title + ' mm ' + target.href);
    chrome.runtime.sendMessage({
        user_action: "playPause",
        audio_id : target.id
      }, function(response) {
        // document.getElementById("play-pause").innerHTML = response.msg;
      });
  };

  function getWhatPlayingNow(){
    chrome.runtime.sendMessage({
        user_action: "getWhatPlayingNow"
    },
    function(response){
    document.getElementById("trevx-search-result-list").innerHTML = createAudioLines(response.searchResultList);
    });
  } // end getWhatPlayingNow

  // for (var j=0; j < audioLinks.length; j++) {
  //     audioLinks[j].setAttribute("class","action pause");
  //     console.log(audioLinks.length + '   '+ j);
  // };

  function download(target) {
    chrome.runtime.sendMessage({
        user_action: "download",
        audio_url: target.href
    });
  };

  function getSearchResultList() {
    chrome.runtime.sendMessage({
      user_action: "getSearchResultList"
      },

      function(response) {
        document.getElementById("trevx-search-result-list").innerHTML = createAudioLines(response.searchResultList);
        console.log(response.searchResultList);
        var audioLinks = document.querySelectorAll('.action');
        var downloadLinks = document.querySelectorAll('.download');

        for (var i = 0; i < audioLinks.length; i++) {
            audioLinks[i].addEventListener('click', function(event) {
                playPause(this);
                //change all icon to readyToPlay
                for (var k = 0; k < audioLinks.length; k++) {
                  audioLinks[k].setAttribute("class", "action play");
                  console.log(response.audioState);
                }
                if (response.audioState == 'paused') {
                    this.setAttribute("class", "action play");
                } else {
                    this.setAttribute("class", "action pause");
                }
            });
        }

        for (var i = 0; i < downloadLinks.length; i++) {
            downloadLinks[i].addEventListener('click', function(event) {
                download(this);
            });
        }
      }); // end of response
  }  // getSearchResultList function

  function getWhatPlayingNow(){
    chrome.runtime.sendMessage({
      user_action: "getWhatPlayingNow"
      },

      function(response) {
        var audioLinks = document.querySelectorAll('.action');
        var activeAudio = response.activeAudio;
        for (var i = 0; i < audioLinks.length; i++) {
          if (audioLinks[i].id == activeAudio) {
            audioLinks[i].setAttribute("class", "action pause");
          }
        }
      })
  } //end of getWhatPlayingNow

  window.onload = function() {
    console.log("win onload");
    getSearchResultList();
    getWhatPlayingNow();
  };
} // end of container
