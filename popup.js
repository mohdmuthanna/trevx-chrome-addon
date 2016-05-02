var searchForm = document.getElementById('trevx-chrome-popup');
var container = document.getElementById('trevx-lists');
// var favoritesList =[];

if (container) {
  var favoritesList =[];
  function getAudioTitle(title){
    if (title.length > 40){
      title = title.substr(0,39) + "..";
    }
    return title;
  }
  function getAudioImage(imgUrl){
    if (imgUrl.length == 0){
      imgUrl = "images/cover-img.jpg";
    }
    return imgUrl;
  }
  //timer
  function stateChange(newState) {
    setTimeout(function () {
        if (newState == -1) {
        }
    }, 5000);
  }
  function createAudioLines(searchResultList){
    var links = '';
    //Need to be rewrited in better way
    if (!(searchResultList === undefined)) {
      if (searchResultList.length > 0) {
        for (var i = 0; i < searchResultList.length; i++) {
          links +="<li>"
                    // + "<a class='action play' id='"+searchResultList[i].id+"'  href="+ searchResultList[i].link +"></a>"
                    + "<a class='action' id='"+searchResultList[i].id+"'href='#'>"
                    +   "<img src='"+ getAudioImage(searchResultList[i].image) +"' width='40' height='40'>"
                    +   "<span res-list-icon-id='"+searchResultList[i].id+"' class='icon play'></span>"
                    +"</a>"
                    // + "<a class='title' id='"+searchResultList[i].id+"' href='"+searchResultList[i].link+"'>"+ searchResultList[i].title+"</a>"
                    + "<a class='title' title-id='"+searchResultList[i].id+"' title='"+searchResultList[i].title+"'>"+ getAudioTitle(searchResultList[i].title)+"</a>"
                    // + "<p>"+ searchResultList[i].title +"</p>"
                    + "<a class='download' href='"+searchResultList[i].downloadUrl+"'>"
                    + "<a class='favorite' fav-id='"+searchResultList[i].id+"'href='#'></a>"
                    + "</li>";
        }
      } else {
        links = "<li class=\"no-result\">No result found, Start new search or try another word(s)</li>";
        // stateChange(-1);
        // document.getElementById("results-cover").setAttribute("class", "")
        // links = "<div class=\"msg msg2\">No result found, please try another word(s).</div>";
      }
      // links = "<ul>" + links + "</ul>"
    } else if (!navigator.onLine) {
      links = "<p align='center'>Check your internet connection and try again later</p>";
    } else {
      // links = "<li class=\"no-result\">No result found, Start new search or try another word(s)</li>";
      //the cover will be displayed after first run
      document.getElementById("results-cover").setAttribute("class", "")
    }
    return (links);
  }; // createAudioLines end

  function createFavoriteLines(favoritesList){
    var links = '';
    if (!(favoritesList === undefined)) {
      // to view or hidden favorite coler
      var toChange = document.getElementById("cover-favorite-cover");
      if (favoritesList.length > 0) {
            toChange.setAttribute("style", "visibility: hidden");
        for (var i = 0; i < favoritesList.length; i++) {
          links +="<li>"
                  +"<a class='action' id='"+favoritesList[i].id+"'href='#'>"
                  +   "<img src='"+ getAudioImage(favoritesList[i].image) +"' width='40' height='40'>"
                  +   "<span fav-list-icon-id='"+favoritesList[i].id+"' class='icon play'></span>"
                  +"</a>"
                  + "<a class='title' title-id='"+favoritesList[i].id+"' title='"+favoritesList[i].title+"'>"+ getAudioTitle(favoritesList[i].title)+"</a>"
                  // + "<p>"+ favoritesList[i].title +"</p>"
                  +"<a href='#' del-id='"+favoritesList[i].id+"' class='remove'>X</a>"
                  + "<a class='download' href='"+favoritesList[i].downloadUrl+"'>"
                  +"</li>";
        }
         return links;
      } else {
        toChange.setAttribute("style", "");
      }
    }
  }

  function getFavoritesList(){
    // console.log(favoritesList);
    chrome.runtime.sendMessage({
      user_action: "getFavoritesList"
      }, function(response) {
        document.getElementById("list-favorites-list").innerHTML = createFavoriteLines(response.favoritesList);
        var removeFavoriteLinks = document.querySelectorAll('.favorites-list .remove');
        var audioLinks = document.querySelectorAll('.favorites-list .action');
        var downloadLinks = document.querySelectorAll('.favorites-list .download');
        var whichSectionClicked = "favorites-list";
        // console.log(removeFavoriteLinks);

        for (var i = 0; i < removeFavoriteLinks.length; i++) {
            removeFavoriteLinks[i].addEventListener('click', function(event) {
              console.log( this);
                favoritesListAddRemove(this.getAttribute("del-id"));
            });
        }

        for (var i = 0; i < audioLinks.length; i++) {
            audioLinks[i].addEventListener('click', function(event) {
              // console.log('i click play  = ' + this);
                playPause(this , whichSectionClicked);
            });
        }


        for (var i = 0; i < downloadLinks.length; i++) {
            downloadLinks[i].addEventListener('click', function(event) {
                download(this);
            });
        }

      })
  }

  function changeFavoriteIconsState(){

    chrome.runtime.sendMessage({
      user_action: "getFavoritesList"
      }, function(response) {
        favoritesList = response.favoritesList;
        // console.log(favoritesList);
        var favoriteIcons = document.querySelectorAll('.favorite');
        for (var i = 0; i < favoriteIcons.length; i++) {
          for (var j = 0; j < favoritesList.length; j++) {
            if (favoritesList[j].id == favoriteIcons[i].getAttribute("fav-id")) {
              favoriteIcons[i].setAttribute("class", "favorite active");
              // favoritesList.splice( j, 1 );
            }
          }
        }
      })
      console.log(favoritesList);

  } // changeFavoriteIconsState

  function playPause(target, whichSectionClicked) {

    chrome.runtime.sendMessage({
        user_action: "playPause",
        audio_id: target.id,
        whichSectionClicked: whichSectionClicked
      }, function(response) {
        // should add somthing here to apply this change only to the specifid element
        //even there are anothor element with the same id value
        // get clicked button and change its state[play, pause
        if (whichSectionClicked == "results-list") {
          var toChange = document.querySelector("span[res-list-icon-id='"+ response.activeAudio +"']");
          // console.log( "results-list");
          // var toChange = document.getElementById(response.activeAudio).childNodes[1];
        } else if (whichSectionClicked == "favorites-list") {
          var toChange = document.querySelector("span[fav-list-icon-id='"+ response.activeAudio +"']");
          // console.log( "fav-list");
        }
        // var toChange = document.getElementById(response.activeAudio).childNodes[1];
        // var aa = "#"+response.activeAudio
        // var toChange2 = document.querySelectorAll(' + aa +');
        var icons = document.querySelectorAll("div#trevx-lists .icon");
        console.log(toChange);
        if (response.isPlaying){
          for (var i = 0; i < icons.length; i++) {
            icons[i].setAttribute("class", "icon play");
          }
          toChange.setAttribute("class", "icon pause");
        } else {
          toChange.setAttribute("class", "icon play");
        }
      })
  }; // end of playPause function

  function favoritesListAddRemove(target){
    chrome.runtime.sendMessage({
        user_action: "favoritesListAddRemove",
        audio_fav_id : target
      }, function(response) {
        // var toChangeFavIcon = document.querySelecto
        var toChangeFavIcon = document.querySelector("a[fav-id='"+ target +"']");
        // console.log("toChangeFavIcon= " + toChangeFavIcon);
        console.log("isFavored= " + response.isFavored);

        // not used
        // if (response.isFavored == -1) {
        //   // toChangeFavIcon.setAttribute('class', 'favorite active');
        // } else {
        //   // toChangeFavIcon.setAttribute('class', 'favorite');
        // }
        getFavoritesList();
        getSearchResultList();
        changeFavoriteIconsState();
        getWhatPlayingNow();
      });
  }

  //not used
  function sendUserQuery(user_action, searchQueryValueEncoded) {
    chrome.runtime.sendMessage({
      user_action: "searchButtonClicked",
      searchQueryValueEncoded: searchQueryValueEncoded
    }, function(response) {
      // getSearchResultList();
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

  // function getWhatPlayingNow(){
  //   chrome.runtime.sendMessage({
  //       user_action: "getWhatPlayingNow"
  //   },
  //   function(response){
  //   document.getElementById("list-results-list").innerHTML = createAudioLines(response.searchResultList);
  //   });
  // } // end getWhatPlayingNow


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
        document.getElementById("list-results-list").innerHTML = createAudioLines(response.searchResultList);
        var audioLinks = document.querySelectorAll('.results-list .action');
        var downloadLinks = document.querySelectorAll('.results-list .download');
        var favoritesLinks = document.querySelectorAll('.results-list .favorite');
        var whichSectionClicked = "results-list";
        for (var i = 0; i < audioLinks.length; i++) {
            audioLinks[i].addEventListener('click', function(event) {
              // console.log('i click  = ' + this);
                playPause(this, whichSectionClicked);
            });
        }

        for (var i = 0; i < favoritesLinks.length; i++) {
            favoritesLinks[i].addEventListener('click', function(event) {
              // console.log("test  " + this.getAttribute("fav-id"))
              favoritesListAddRemove(this.getAttribute("fav-id"));
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
      var loading = document.getElementById('loading-msg');
      loading.setAttribute("class", "loading");
      chrome.runtime.sendMessage({
        user_action: "searchButtonClicked",
        searchQueryValueEncoded: searchQueryValueEncoded
      }, function(response) {
        // loading.setAttribute("class", "loading hidden");
        // getSearchResultList();
      })
    }
  }

  function getWhatPlayingNow(){
    chrome.runtime.sendMessage({
      user_action: "getWhatPlayingNow"
      },

      function(response) {
        if (!(response.activeAudio === undefined)) {
          var whatIsActiveList = response.whatIsActiveList;
          // alert(whatIsActiveList);
          if (whatIsActiveList == 'favorites-list') {
            var audioLinks = document.querySelectorAll('#list-favorites-list .action');
          } else if (whatIsActiveList == 'results-list') {
            var audioLinks = document.querySelectorAll('#list-results-list .action');
          }
          // var audioLinks = document.querySelectorAll('.action');
          var activeAudio = response.activeAudio;
          for (var i = 0; i < audioLinks.length; i++) {
            if (audioLinks[i].id == activeAudio) {
              audioLinks[i].childNodes[1].setAttribute("class", "icon pause");
            }
          }
        }
        })
  } //end of getWhatPlayingNow

  window.onload = function() {
    getSearchResultList();
    changeFavoriteIconsState();
    getFavoritesList();
    getWhatPlayingNow();
    // checkInteractiveSearch();
    chrome.tabs.getSelected(null,function(tab) {
      // console.log(tab.title + ' t       u ' + tab.url);
    });

  };

} // end of container
