var container = document.getElementById('trevx-search-result-list');

if (container) {
  console.log("Start popup.js");

  function createAudioLines(searchResultList){
    var links = '';
    if (true) {
      // console.loge(searchResultList.resultCounter);
    }
    for (var i = 0; i < searchResultList.length; i++) {
      links += "<li>"
                // + "<a class='action play' id='"+searchResultList[i].id+"'  href="+ searchResultList[i].link +"></a>"
                + "<a class='action play' id='"+searchResultList[i].id+"'href='#'></a>"
                + "<a class='title' id='"+searchResultList[i].id+"' href='"+searchResultList[i].link+"'>"+ searchResultList[i].title+"</a>"
                + "<a class='download' href='"+searchResultList[i].downloadUrl+"'>"
                + "</li>";
    }
    links = "<ul>" + links + "</ul>"
    return (links);
  };

  function playPause(target) {

    chrome.runtime.sendMessage({
        user_action: "playPause",
        audio_id : target.id
      }, function(response) {
        // var audioLinks = document.querySelectorAll('.action');

        // should add somthing here to apply this change only to the specifid element
        //even there are anothor element with the same id value
        // get clicked button and change its state[play, pause]
        var toChange = document.getElementById(response.activeAudio);
        if (response.isPlaying){
          toChange.setAttribute("class", "action pause");
        }
      })
  }; // end of playPause function

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
                  // console.log(response.audioState);
                }
                if (response.audioState == 'paused') {
                    // this.setAttribute("class", "action play");
                } else {
                    // this.setAttribute("class", "action pause");
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
