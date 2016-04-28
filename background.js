var isPlaying = false;
var isNewAudio = true;
var activeAudio =''; // id of the audio
var audioState = '';
var favoritesList = [];
// alert(favoritesList.length);
var l = new Audio();


// first run, define searchResultList
if (typeof searchResultList === 'undefined') {
  // var searchResultList =[];
  // var favoritesLinks =
  // var favoritesList = [];
  var isFoundResult = -1;
  var searchResultAsPlaylist = [];
  chrome.storage.local.get("searchResultList", function(data) {
      searchResultList = data["searchResultList"];
    });
  chrome.storage.local.get("favoritesList", function(data2) {
      favoritesList = data2["favoritesList"];
    });

}

function checkIfFavored(target){
  for (var i = 0; i < favoritesList.length; i++) {
    if (favoritesList[i].id == target) {
      return [i];
    }
  }
  return -1;
}

function addToFavorites(target){
  for (var i = 0; i < searchResultList.length; i++) {
    if (searchResultList[i].id == target) {
      var active = i;
      var element = searchResultList[active];
      favoritesList.push(element);
      // alert(favoritesList);
    }
  }
  var element = searchResultList[active];
  favoritesList.push(element);
  chrome.storage.local.set({'favoritesList': favoritesList}, function() {
          });
          alert(favoritesList);
} // add to favorite

function removeFromFavorites(target){
  for (var i = 0; i < favoritesList.length; i++) {
    if (favoritesList[i].id == target) {
      favoritesList.splice( i, 1 );

    }
  }
}

function playNextAudio(){
  var activeAudioPosition = -1;
  //get position of currnet audio
  for (var i = 0; i < searchResultAsPlaylist.length; i++) {
    if (searchResultAsPlaylist[i] == activeAudio) {
      activeAudioPosition = i;
      break;
    }
  }
  if (activeAudioPosition+1 < searchResultAsPlaylist.length) {
    l.src = getSrcById(searchResultAsPlaylist[activeAudioPosition+1]);
    activeAudio = searchResultAsPlaylist[activeAudioPosition+1];
    l.play();
  }

} //playNextAudio

l.onended = function() {
  playNextAudio();
  var isErorrOnPlay = true;
  chrome.browserAction.setIcon({
    path : "images/not-playing.png"
  });
};

l.onerror = function(){
  playNextAudio();
};

l.onplaying = function(){
  chrome.browserAction.setIcon({
    path : "images/playing.png"
  });
}
l.onpause = function(){
  chrome.browserAction.setIcon({
    path : "images/not-playing.png"
  });
}

//remove redundent result
function removeRedundentResult(){
  searchResultList = searchResultList.reduceRight(function (r, a) {
      r.some(function (b) { return a.link === b.link; }) || r.push(a);
      return r;
  }, []);
  searchResultList = searchResultList.reverse();
};

function makeSearchResultAsPlaylist(){
  searchResultAsPlaylist = [];
  for (var i = 0; i < searchResultList.length; i++) {
    searchResultAsPlaylist[i] = searchResultList[i].id;
  }
};

function callTrevxAPI(searchQueryValueEncoded){
  // check internet connection
  // http://trevx.com/v1/(query)/[start from]/[numOfResult]/?format=json

  try {
    var url = 'http://trevx.com/v1/'+ searchQueryValueEncoded +'/0/40/?format=json'
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url , false);
    xhr.send(null);
    //manipulate json object (it's work, but not the right way, API return unproperate value)
    searchResultList = xhr.response;
    isFoundResult = searchResultList.indexOf("details:Data Returned Successfully");
  } catch (err) {
    searchResultList = [];
    searchResultAsPlaylist = [];
  } // try end

  if (isFoundResult != -1) {
    var end = searchResultList.indexOf(",\"details");
    searchResultList = searchResultList.substring(0, end);
    searchResultList = searchResultList +"]";
    searchResultList = JSON.parse(searchResultList);
    removeRedundentResult();
    // makeSearchResultAsPlaylist();
  } else{
    searchResultList = [];
    searchResultAsPlaylist = [];
  }

  chrome.storage.local.set({'searchResultList': searchResultList}, function() {
          });

}//end of callTrevxAPI

// ruturn audio url to certain id
function getSrcById(id){
  for (var i = 0; i < searchResultList.length; i++) {
    if (searchResultList[i].id == id) {
      return searchResultList[i].link;
    }
  }
}

function getWhatPlayingNow(){
  if (!(searchResultList === undefined)) {
    for (var i = 0; i < searchResultList.length; i++) {
        if (!l.paused && (searchResultList[i].id == activeAudio)) {
          return activeAudio;
        }
    }
  }
}// end getWhatPlayingNow

// Welcom page, opened after installing extension
// chrome.runtime.onInstalled.addListener(function (object) {
//     chrome.tabs.create({url: "http://trevx.com/about-us.php"}, function (tab) {
//     });
// });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.user_action == "getSearchResultList") {
    chrome.storage.local.get("searchResultList", function(data) {
        searchResultList = data["searchResultList"];
      });
        makeSearchResultAsPlaylist();
    sendResponse({
        searchResultList: searchResultList
    });
  } else if (request.user_action == "searchButtonClicked") {
    var searchQueryValueEncoded = request.searchQueryValueEncoded;
    callTrevxAPI(searchQueryValueEncoded);

  } else if (request.user_action == "interactiveSearch") {
    callTrevxAPI(request.searchQueryValueEncoded);

  } else if (request.user_action == 'favoritesListAddRemove') {
      var target = request.audio_fav_id;
      chrome.storage.local.get("favoritesList", function(data2) {
          favoritesList = data2["favoritesList"];
        });
        if (true) {
          var isFavored = checkIfFavored(target);
          alert(isFavored);

          if (isFavored == -1) {
            addToFavorites(target);
          } else {
            removeFromFavorites(target);
          }

          sendResponse({
              isFavored: isFavored
          });
        } else {
          sendResponse({
              isFavored: -1
          });
        }


  } else if (request.user_action == "getFavoritesList") {
    chrome.storage.local.get("favoritesList", function(data2) {
        favoritesList = data2["favoritesList"];
      });
      if (!favoritesList) {
        var favoritesList = [];
      }
    sendResponse({
        favoritesList : favoritesList
    });
    // alert(favoritesList);
    return true;
  }
  else if (request.user_action == 'getWhatPlayingNow') {
    sendResponse({
        activeAudio: getWhatPlayingNow()
    });
    return true;
  }
  else if (request.user_action == "download") {
    window.open(request.audio_url);
  }
  else if (request.user_action == "playPause") {

    // check if the recusted audio is new or not
    if (activeAudio == request.audio_id) {
      isNewAudio = false;
    } else {
      isNewAudio = true;
    }

    //check if audio is finished take it back to start
    if (l.currentTime == l.duration){
      l.currentTime = 0;
      isPlaying = !isPlaying;
    }

    //check if the requsetd audio is new(not paused track),//if you remove this the audio file start from 0 even it paused.
    if ((activeAudio != request.audio_id)  ){
      l.src = getSrcById(request.audio_id);
    }

        //pause
    if ((isPlaying && !isNewAudio)) {
          isPlaying = false;
          audioState = 'paused';
          sendResponse({
              audioState: audioState,
              isPlaying: isPlaying,
              activeAudio: activeAudio
          });
          l.pause();  // Stop playing // l.currentTime = 0;  // Go to to second no. Zero (start of the file)
          return true;


        } else {  // play
          activeAudio = request.audio_id;
          isPlaying = true;
          audioState = 'playing';
          sendResponse({
              audioState: audioState,
              isPlaying: isPlaying,
              activeAudio: activeAudio
          });
          l.play();
          return true;
    };
  };

}); // end of listener
