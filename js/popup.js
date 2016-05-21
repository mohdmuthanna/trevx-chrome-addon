var searchForm = document.getElementById('trevx-chrome-popup');
var container = document.getElementById('trevx-lists');
// var favoritesList =[];

if (container) {
  document.querySelector(".search .field").focus();
  document.querySelector(".logo").onclick = function() {
    window.open("http://trevx.com/");
  }


/*
  function getGoogleChecks(urls, callback) {
    var stringUrls = urls.join('\n');

    var googleUrl = 'https://hello.com/' + stringUrls;
    $.get(googleUrl, function (data) {
      callback(data);
    });
  };

  getGoogleChecks('omardo.com', function (data) {
    console.log(data);
  });
*/

  //Call suggestion API and view the the suggestion list
  // jQuery onload
  $(function () {
    $("#trevx-search-box").autocomplete({
      source: function (request, response) {
        var suggestionUrl = "http://trevx.com/v1/suggestion/" + encodeURIComponent(request.term) + "/?format=json";
        $.getJSON(suggestionUrl, function (data) {
          var searchTerms = data.slice(0, data.length- 4);
          response(searchTerms);
        });
      },
      // on select suggestion item do
      select: function( event, ui ) {
        searchForAQuery(ui.item.value);
      },
      minLength: 2,
      //remove results status message
      messages: {
        noResults: '',
        results: function() {}
      },
    })
  });


  //not used
  function trevxSuggetionAPI(){
      var xhrS = new XMLHttpRequest();
      var query = document.getElementById("trevx-search-box").value;

      var url = "http://trevx.com/v1/suggestion/" + encodeURIComponent(query) + "/?format=json";
      xhrS.open("GET", url , false);
      xhrS.send(null);
      var suggestionList = xhrS.responseText;
      var isFoundResult = suggestionList.indexOf("details:Data Returned Successfully");

      if (isFoundResult != -1) {
        var end = suggestionList.indexOf(",\"details");
        suggestionList = suggestionList.substring(0, end);
        suggestionList = suggestionList +"]";
        suggestionList = JSON.parse(suggestionList);
      } else {
        suggestionList = [];
      }
      return suggestionList;
  }

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
                    +   "<span res-list-icon-id='"+searchResultList[i].id+"' class='icon play'></span>"
                    +"</a>"
                    // + "<a class='title' id='"+searchResultList[i].id+"' href='"+searchResultList[i].link+"'>"+ searchResultList[i].title+"</a>"
                    + "<a class='title' id='"+searchResultList[i].id+"' title='"+searchResultList[i].title+"'>"+ getAudioTitle(searchResultList[i].title)+"</a>"
                    // + "<p>"+ searchResultList[i].title +"</p>"
                    // + "<a class='download' href='"+searchResultList[i].downloadUrl+"'>"
                    + "<a class='favorite' title='Add to favorites' fav-id='"+searchResultList[i].id+"'href='#'></a>"
                    + "</li>";
        }
      } else {
        links = "<li class=\"no-result\">No result found, Start new search or try another word(s)</li>";
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
    if (favoritesList[0] != null) {
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
                  + "<a class='title' id='"+favoritesList[i].id+"' title='"+favoritesList[i].title+"'>"+ getAudioTitle(favoritesList[i].title)+"</a>"
                  // + "<p>"+ favoritesList[i].title +"</p>"
                  +"<a href='#' del-id='"+favoritesList[i].id+"' class='remove'>X</a>"
                  // + "<a class='download' href='"+favoritesList[i].downloadUrl+"'>"
                  +"</li>";
        }
         return links;
      } else {
        toChange.setAttribute("style", "");
        // links = [];
        // return links;
      }
    }
  }

  function getFavoritesList(){
    chrome.runtime.sendMessage({
      user_action: "getFavoritesList"
      }, function(response) {

        if (response.favoritesList.length != 0) {
          document.getElementById("list-favorites-list").innerHTML = createFavoriteLines(response.favoritesList);
          var removeFavoriteLinks = document.querySelectorAll('.favorites-list .remove');
          var audioLinks = document.querySelectorAll('.favorites-list .action');
          var downloadLinks = document.querySelectorAll('.favorites-list .download');
          var titlesLinks = document.querySelectorAll('.favorites-list .title');
          var whichSectionClicked = "favorites-list";
          for (var i = 0; i < removeFavoriteLinks.length; i++) {
              removeFavoriteLinks[i].addEventListener('click', function(event) {
                  favoritesListAddRemove(this.getAttribute("del-id"));
              });
          }

          for (var i = 0; i < audioLinks.length; i++) {
              audioLinks[i].addEventListener('click', function(event) {
                  playPause(this , whichSectionClicked);
              });
          }


          for (var i = 0; i < downloadLinks.length; i++) {
              downloadLinks[i].addEventListener('click', function(event) {
                  download(this);
              });
          }
          $(titlesLinks).click(function() {
            playPause(this, whichSectionClicked);
          });
        } else {
          //view favorite cover
          document.getElementById("cover-favorite-cover").setAttribute("style", "");
        }
      })
  }

  function changeFavoriteIconsState(){
    chrome.runtime.sendMessage({
      user_action: "getFavoritesList"
      }, function(response) {
        console.log(response.favoritesList[0] != null);
        if (response.favoritesList[0] != null) {
          favoritesList = response.favoritesList;
          var favoriteIcons = document.querySelectorAll('.favorite');
          for (var i = 0; i < favoriteIcons.length; i++) {
            for (var j = 0; j < favoritesList.length; j++) {
              if (favoritesList[j].id == favoriteIcons[i].getAttribute("fav-id")) {
                favoriteIcons[i].setAttribute("class", "favorite active");
                // favoritesList.splice( j, 1 );
              }
            }
          }
        }

      })

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
        } else if (whichSectionClicked == "favorites-list") {
          var toChange = document.querySelector("span[fav-list-icon-id='"+ response.activeAudio +"']");
        }

        var icons = document.querySelectorAll("div#trevx-lists .icon");
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

  // not used in this version
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
    // try {
    //   var url = 'http://trevx.com/v1/'+ searchQueryValueEncoded +'/0/40/?format=json'
    //   var xhr = new XMLHttpRequest();
    //   xhr.open('GET', url , false);
    //   xhr.send(null);
    //   //manipulate json object (it's work, but not the right way, API return unproperate value)
    //   searchResultList = xhr.response;
    // } catch (err) {
    //
    // } // try end
  }

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
        var titlesLinks = document.querySelectorAll('.results-list .title');
        var whichSectionClicked = "results-list";

        for (var i = 0; i < audioLinks.length; i++) {
            audioLinks[i].addEventListener('click', function(event) {
                playPause(this, whichSectionClicked);
            });
        }

        for (var i = 0; i < favoritesLinks.length; i++) {
            favoritesLinks[i].addEventListener('click', function(event) {
              favoritesListAddRemove(this.getAttribute("fav-id"));
            });
        }

        for (var i = 0; i < downloadLinks.length; i++) {
            downloadLinks[i].addEventListener('click', function(event) {
                download(this);
            });
        }
        $(titlesLinks).click(function() {
          playPause(this, whichSectionClicked);
        });
      }); // end of response
  }  // getSearchResultList function

  function searchForAQuery(searchQueryValue){
    // var searchQueryValue = document.getElementById('trevx-search-box').value;
    var searchQueryValueEncoded = encodeURIComponent(searchQueryValue);
    if (searchQueryValueEncoded.length != 0) {
      var loading = document.getElementById('loading-msg');
      loading.setAttribute("class", "loading");
      chrome.runtime.sendMessage({
        user_action: "searchButtonClicked",
        searchQueryValueEncoded: searchQueryValueEncoded
      }, function(response) {
        var loading = document.getElementById('loading-msg');
        loading.setAttribute("class", "loading hidden");
        getSearchResultList();
        changeFavoriteIconsState();
        // getFavoritesList();
        getWhatPlayingNow();
      })
    }
  }
  document.getElementById('trevx-search-button').onclick = function() {
    var searchQueryValue = document.getElementById('trevx-search-box').value;
    searchForAQuery(searchQueryValue);
  }

  function getWhatPlayingNow(){
    chrome.runtime.sendMessage({
      user_action: "getWhatPlayingNow"
      },

      function(response) {
        if (!(response.activeAudio === undefined)) {
          var whatIsActiveList = response.whatIsActiveList;
          if (whatIsActiveList == 'favorites-list') {
            var audioLinks = document.querySelectorAll('#list-favorites-list .action');
          } else if (whatIsActiveList == 'results-list') {
            var audioLinks = document.querySelectorAll('#list-results-list .action');
          }
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
    chrome.tabs.getSelected(null,function(tab) {
      // console.log(tab.title + ' t       u ' + tab.url);
    });

  };

} // end of container
