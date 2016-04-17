var searchForm = document.getElementById('trevx-chrome-popup');
var container = document.getElementById('trevx-search-result-list');

// var aa = [
// {"id":"29"},
// {"id":"33"},
// "no:141","start:0","limit:20"];
//
// console.log("29  " + aa[0].id);
// console.log("cont  " + aa[2].no);
// console.log("limit  " + aa[4][limit]);
// aaaa = "asa asas dfdf dfdfd dfdfdf";
// alert(aaaa.indexOf(",\"details"));
if (container) {
  function createAudioLines(searchResultList){
    var links = '';
    console.log("searchResultList.length =  " + searchResultList.length);
    if ((searchResultList.length > 0) && navigator.onLine) {
      for (var i = 0; i < searchResultList.length; i++) {
        links += "<li>"
                  // + "<a class='action play' id='"+searchResultList[i].id+"'  href="+ searchResultList[i].link +"></a>"
                  + "<a class='action play' id='"+searchResultList[i].id+"'href='#'></a>"
                  + "<a class='title' id='"+searchResultList[i].id+"' href='"+searchResultList[i].link+"'>"+ searchResultList[i].title+"</a>"
                  + "<a class='download' href='"+searchResultList[i].downloadUrl+"'>"
                  + "</li>";
      }
      links = "<ul>" + links + "</ul>"
    } else if (!navigator.onLine) {
      links = "<p align='center'>Check your internet connection and try again later</p>";
    } else {
      links = "<p align='center'>No result found, Try another word(s)</p>";
    }

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

  document.getElementById('trevx-search-button').onclick = function() {
    var searchQueryValue = document.getElementById('trevx-search-box').value;
    var searchQueryValueEncoded = encodeURIComponent(searchQueryValue);
    // alert('hoooooooooooooo');
    chrome.runtime.sendMessage({
      user_action: "searchButtonClicked",
      searchQueryValueEncoded: searchQueryValueEncoded
    }, function(response) {
      // alert('befor get serch result')
      getSearchResultList();
    })

  }

    // submit.addEventListener('click', function(e) {
    //   var searchValue = encodeURIComponent(search.value);  // encode the search query
    //   window.location.href = 'http://www.website.com/search/' + searchValue ;
    // });



  // }
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
