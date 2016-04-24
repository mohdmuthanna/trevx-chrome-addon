var searchForm = document.getElementById('trevx-chrome-popup');
var container = document.getElementById('trevx-search-result-list');

if (container) {

  function createAudioLines(searchResultList){
    var links = '';
    //Need to be rewrited in better way
    if (!(searchResultList === undefined)) {
      if (searchResultList.length > 0) {
        for (var i = 0; i < searchResultList.length; i++) {
          links +="<li>"
                    // + "<a class='action play' id='"+searchResultList[i].id+"'  href="+ searchResultList[i].link +"></a>"
                    + "<a class='action play' id='"+searchResultList[i].id+"'href='#'></a>"
                    // + "<a class='title' id='"+searchResultList[i].id+"' href='"+searchResultList[i].link+"'>"+ searchResultList[i].title+"</a>"
                    + "<a class='title' id='"+searchResultList[i].id+"' href='#'>"+ searchResultList[i].title+"</a>"
                    // + "<p>"+ searchResultList[i].title +"</p>"
                    + "<a class='download' href='"+searchResultList[i].downloadUrl+"'>"
                    + "</li>";
        }
      } else {
        links = "<p align='center'>No result found, Start new search or try another word(s)</p>";
      }
      links = "<ul>" + links + "</ul>"
    } else if (!navigator.onLine) {
      links = "<p align='center'>Check your internet connection and try again later</p>";
    } else {
      links = "<p align='center'>No result found, Start new search or try another word(s)</p>";
    }
    return (links);
  }; // createAudioLines end

  function playPause(target) {

    chrome.runtime.sendMessage({
        user_action: "playPause",
        audio_id : target.id
      }, function(response) {
        // should add somthing here to apply this change only to the specifid element
        //even there are anothor element with the same id value
        // get clicked button and change its state[play, pause]
        var toChange = document.getElementById(response.activeAudio);
        if (response.isPlaying){
          toChange.setAttribute("class", "action pause");
        }
      })
  }; // end of playPause function

  //not used
  function sendUserQuery(user_action, searchQueryValueEncoded) {
    chrome.runtime.sendMessage({
      user_action: "searchButtonClicked",
      searchQueryValueEncoded: searchQueryValueEncoded
    }, function(response) {
      getSearchResultList();
    })
  }

  function checkInteractiveSearch(){
    // interactiveSearch youtube need to check the API
    // chrome.tabs.getSelected(null,function(tab) {
    //   if (tab.url.indexOf("youtube.com/watch?v=") != -1) {
    //     var searchQueryValueEncoded = encodeURIComponent('https://www.youtube.com/watch?v=YQHsXMglC9A');
    //     console.log(searchQueryValueEncoded);
    //     chrome.runtime.sendMessage({
    //       user_action: "interactiveSearch",
    //       searchQueryValueEncoded: searchQueryValueEncoded
    //     }, function(response) {
    //       getSearchResultList();
    //     })
    //   } else {
    //     // getSearchResultList();
    //   }
    // });
    try {
      var url = 'http://trevx.com/v1/'+ searchQueryValueEncoded +'/0/40/?format=json'
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url , false);
      xhr.send(null);
      //manipulate json object (it's work, but not the right way, API return unproperate value)
      searchResultList = xhr.response;
    } catch (err) {

    } // try end
  }

  function getWhatPlayingNow(){
    chrome.runtime.sendMessage({
        user_action: "getWhatPlayingNow"
    },
    function(response){
    document.getElementById("trevx-search-result-list").innerHTML = createAudioLines(response.searchResultList);
    });
  } // end getWhatPlayingNow


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
                //change all icon to readyToPlay
                for (var k = 0; k < audioLinks.length; k++) {
                  audioLinks[k].setAttribute("class", "action play");
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

  document.getElementById('trevx-search-button').onclick = function() {
    var searchQueryValue = document.getElementById('trevx-search-box').value;
    var searchQueryValueEncoded = encodeURIComponent(searchQueryValue);
    if (searchQueryValueEncoded.length != 0) {
      chrome.runtime.sendMessage({
        user_action: "searchButtonClicked",
        searchQueryValueEncoded: searchQueryValueEncoded
      }, function(response) {
        getSearchResultList();
      })
    }
  }

  function getWhatPlayingNow(){
    chrome.runtime.sendMessage({
      user_action: "getWhatPlayingNow"
      },

      function(response) {
        if (!(response.activeAudio === undefined)) {
          var audioLinks = document.querySelectorAll('.action');
          var activeAudio = response.activeAudio;
          for (var i = 0; i < audioLinks.length; i++) {
            if (audioLinks[i].id == activeAudio) {
              audioLinks[i].setAttribute("class", "action pause");
            }
          }
        }
        })
  } //end of getWhatPlayingNow

  window.onload = function() {
    getSearchResultList();
    getWhatPlayingNow();
    // checkInteractiveSearch();
    chrome.tabs.getSelected(null,function(tab) {
      // console.log(tab.title + ' t       u ' + tab.url);
    });

  };

} // end of container
