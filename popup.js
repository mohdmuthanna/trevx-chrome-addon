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

  function toggleButtonPlayPause(){
    chrome.runtime.sendMessage({
        user_action: "toggleButtonPlayPause"
    },
    function(response){
    document.getElementById("trevx-search-result-list").innerHTML = createAudioLines(response.searchResultList);
    });
  } // end toggleButtonPlayPause

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

        var audioLinks = document.querySelectorAll('.action');
        var downloadLinks = document.querySelectorAll('.download');

        for (var i = 0; i < audioLinks.length; i++) {
            audioLinks[i].addEventListener('click', function(event) {
                playPause(this);
                for (var k = 0; k < audioLinks.length; k++) {
                  audioLinks[k].setAttribute("class", "action play");
                  console.log(k);
                }
                this.setAttribute("class", "action pause");
            });
        }

        for (var i = 0; i < downloadLinks.length; i++) {
            downloadLinks[i].addEventListener('click', function(event) {
                download(this);
            });
        }
      }); // end of response
  }  // getSearchResultList function

  window.onload = function() {
    console.log("win onload");
    getSearchResultList();
    // toggleButtonPlayPause();
  };
} // end of container
