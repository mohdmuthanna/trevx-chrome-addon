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
                    +   "<span icon-id='"+searchResultList[i].id+"' class='icon play'></span>"
                    +"</a>"
                    // + "<a class='title' id='"+searchResultList[i].id+"' href='"+searchResultList[i].link+"'>"+ searchResultList[i].title+"</a>"
                    + "<a class='title' title-id='"+searchResultList[i].id+"' title='"+searchResultList[i].title+"'>"+ getAudioTitle(searchResultList[i].title)+"</a>"
                    // + "<p>"+ searchResultList[i].title +"</p>"
                    + "<a class='download' href='"+searchResultList[i].downloadUrl+"'>"
                    + "<a class='favorite' fav-id='"+searchResultList[i].id+"'href='#'></a>"
                    + "</li>";
        }
      } else {
        links = "<p align='center'>No result found, Start new search or try another word(s)</p>";
      }
      // links = "<ul>" + links + "</ul>"
    } else if (!navigator.onLine) {
      links = "<p align='center'>Check your internet connection and try again later</p>";
    } else {
      links = "<p align='center'>No result found, Start new search or try another word(s)</p>";
    }
    return (links);
  }; // createAudioLines end

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

  function playPause(target) {

    chrome.runtime.sendMessage({
        user_action: "playPause",
        audio_id : target.id
      }, function(response) {
        // should add somthing here to apply this change only to the specifid element
        //even there are anothor element with the same id value
        // get clicked button and change its state[play, pause]
        var toChange = document.getElementById(response.activeAudio).childNodes[1];
        var icons = document.querySelectorAll(".icon");
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
        var toChangeFavIcon = document.querySelector("a[fav-id='"+ target +"']");
        // console.log("toChangeFavIcon= " + toChangeFavIcon);
        console.log("isFavored= " + response.isFavored);
        if (response.isFavored == -1) {
          toChangeFavIcon.setAttribute('class', 'favorite active');
        } else {
          toChangeFavIcon.setAttribute('class', 'favorite');
        }
        // var toChange = document.getElementById("1");
        // var favoriteIcons = document.querySelectorAll('.favorite');
        // var favoritesList = response.favoritesList;
        // console.log(favoritesList);
        // console.log( favoriteIcons[0].getAttribute('fav-id'));
        // changeFavoriteIconsState();
        // document.getElementByAtrr('name-of-id').onclick = function() {
        // }

      });
  }

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
    document.getElementById("list-results-list").innerHTML = createAudioLines(response.searchResultList);
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
        document.getElementById("list-results-list").innerHTML = createAudioLines(response.searchResultList);
        var audioLinks = document.querySelectorAll('.action');
        var downloadLinks = document.querySelectorAll('.download');
        var favoritesLinks = document.querySelectorAll('.favorite');

        for (var i = 0; i < audioLinks.length; i++) {
            audioLinks[i].addEventListener('click', function(event) {
              // console.log('i click play  = ' + this);
                playPause(this);
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
              audioLinks[i].childNodes[1].setAttribute("class", "icon pause");
            }
          }
        }
        })
  } //end of getWhatPlayingNow

  window.onload = function() {
    getSearchResultList();
    getWhatPlayingNow();
    changeFavoriteIconsState();
    // getFavoriteList();
    // checkInteractiveSearch();
    chrome.tabs.getSelected(null,function(tab) {
      // console.log(tab.title + ' t       u ' + tab.url);
    });

  };

} // end of container
