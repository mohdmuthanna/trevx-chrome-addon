var isPlaying = false;
var isNewAudio = true;
var activeAudio =''; // id of the audio
var activeList =[]; // active playlist
var whatIsActiveList = ''; // this var hold tow values as string "favorites-list" & "results-list"
var audioState = '';
var whichSectionClicked = ''; // 'results-list' & 'favorites-list' these value will be bind to this var when user click play or pause
var l = new Audio();
var favoritesList =[];
var isFoundResult = -1;
var listAsPlaylist = [];
var key = "AIzaSyAHxv7_HVoj8wYA7keFpgGxNfE2G1DxYtQ";
var appver = '0.3.1';
// var isFavored = -1;7

chrome.browserAction.setIcon({
  path : "images/welcome.png"
});

function getFavoritesListFromStorage(){
  chrome.storage.local.get("favoritesList", function(data) {
      favoritesList = data["favoritesList"];
      if (typeof favoritesList === 'undefined') {
        favoritesList =[];
      } else {
        try {
          var test = favoritesList[0].title;
        } catch (e) {
          favoritesList =[];
        }
        removeMaliciousLink(favoritesList);
      }
    });
    return favoritesList;
}

chrome.storage.local.get("searchResultList", function(data) {
    searchResultList = data["searchResultList"];
    if (typeof searchResultList === "undefined") {
      searchResultList = [];
    } else {
      removeMaliciousLink(searchResultList);
    }

  });

favoritesList = getFavoritesListFromStorage();

function checkIfFavored(target){
  if (typeof favoritesList === 'undefined') {
    favoritesList =[];
    return -1;
  } else {
    for (var i = 0; i < favoritesList.length; i++) {
      if (favoritesList[i].id == target) {
        return [i];
      }
    }
    return -1;
  }
}

function addToFavorites(target){
  // max length should not be more than 250, because google SafeSearch API cant handel more than 500links
  // and every audio has tow links, image & audio url
  if (favoritesList.length < 249) {
    for (var i = 0; i < searchResultList.length; i++) {
      if (searchResultList[i].id == target) {
        var active = i;
      }
    }
    var element = searchResultList[active];
    favoritesList.push(element);
  } else {
    alert("Sorry, your favorites list is full, remove some items and the try add new item");
  }

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
  for (var i = 0; i < listAsPlaylist.length; i++) {
    if (listAsPlaylist[i] == activeAudio) {
      activeAudioPosition = i;
      break;
    }
  }
  if (activeAudioPosition+1 < listAsPlaylist.length) {
    l.src = getSrcById(listAsPlaylist[activeAudioPosition+1], activeList);
    activeAudio = listAsPlaylist[activeAudioPosition+1];
    l.play();
  }
  chrome.runtime.sendMessage({reloadPopup: true});
} //playNextAudio

function playPreviousAudio(){
  var activeAudioPosition = -1;
  //get position of currnet audio
  for (var i = 0; i < listAsPlaylist.length; i++) {
    if (listAsPlaylist[i] == activeAudio) {
      activeAudioPosition = i;
      break;
    }
  }
  l.src = getSrcById(listAsPlaylist[activeAudioPosition-1], activeList);
  activeAudio = listAsPlaylist[activeAudioPosition-1];
  l.play();
} //playPreviousAudio

l.onended = function() {
  playNextAudio();
  var isErorrOnPlay = true;
  chrome.browserAction.setIcon({
    path : "images/not-playing.png"
  });
};

l.onerror = function(){
  playNextAudio();
  url = "http://goo.gl/bydJoj";
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url , true);
  xhr.send(null);
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

//call safe browsing API to check every urls in the results
function callGoogleLookupAPIuri(uri){
  var url = "https://sb-ssl.google.com/safebrowsing/api/lookup?client=ch-ex&key="+key+"&appver="+appver+"&pver=3.1&url="+ encodeURI(uri);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url , false);
  xhr.send(null);
  return(xhr.response);
}

//call safe browsing API to check all results' urls if milisuse or not if one of them milisuse call  callGoogleLookupAPIuri(uri)
function callGoogleLookupAPI2AllURIs(uris){
  var requestBody = '';
  for (var i = 0; i < uris.length; i++) {
    requestBody += uris[i] + '\n'
  }
  requestBody = uris.length + '\n' + requestBody;
  var url = "https://sb-ssl.google.com/safebrowsing/api/lookup?client=ch-ex&key="+key+"&appver="+appver+"&pver=3.1";
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url , false);
  xhr.send(requestBody);
  return(xhr.response);
}
function removeMaliciousLink(list){
  var uris = []; // carry all links in the resultts
  for (var i = 0; i < list.length; i++) {
    if (list[i].link.length > 0) {
      uris.push(list[i].link);
    }
    if (list[i].image.length > 0) {
      uris.push(list[i].image);
    }
  }
  //check if 1 of all links is milisuse check every lisks
  if (callGoogleLookupAPI2AllURIs(uris) != '') {
    try {
      for (var i = 0; i < list.length; i++) {
        var uri1 = list[i].link;
        var uri2 = list[i].image;
        if ((callGoogleLookupAPIuri(uri1) != '') || (callGoogleLookupAPIuri(uri2) != '')) {
          list.splice(i, 1); // remove this result
        }
      }
    } catch (e) {
    }
  }
}// removeMaliciousLink end

function makeListAsPlaylist(list){
  listAsPlaylist = [];
  for (var i = 0; i < list.length; i++) {
    listAsPlaylist[i] = list[i].id;
  }
};

function callTrevxAPI(searchQueryValueEncoded){
  // check internet connection
  // http://trevx.com/v1/(query)/[start from]/[numOfResult]/?format=json

  try {
    //this forloop to solve the diff bitween read and write server
    for (var i = 0; i < 3; i++) {
      var url = 'http://trevx.com/v1/'+ searchQueryValueEncoded +'/0/40/?format=json';
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url , false);
      xhr.send(null);
      //manipulate json object (it's work, but not the right way, API return unproperate value)
      searchResultList = xhr.response;
      isFoundResult = searchResultList.indexOf("details:Data Returned Successfully");
      if (isFoundResult != -1){ break;}
    }

  } catch (err) {
    searchResultList = [];
    listAsPlaylist = [];
  } // try end

  if (isFoundResult != -1) {
    searchResultList = JSON.parse(searchResultList);
    // Remove details from xhr response
    searchResultList = searchResultList.slice(0, searchResultList.length - 7);
    removeRedundentResult();
  } else {
    searchResultList = [];
    listAsPlaylist = [];
  }
  removeMaliciousLink(searchResultList);
  chrome.storage.local.set({'searchResultList': searchResultList}, function() {
          });

}//end of callTrevxAPI

// ruturn audio url to certain id
function getSrcById(id, activeList){
  for (var i = 0; i < activeList.length; i++) {
    if (activeList[i].id == id) {
      return activeList[i].link;
    }
  }
}

//not used, to be deleted
function getWhatPlayingNow(){
  if (!(typeof searchResultList === 'undefined')) {
    for (var i = 0; i < activeList.length; i++) {
        if (!l.paused && (activeList[i].id == activeAudio)) {
          return activeAudio;
        }
    }
  }
}// end getWhatPlayingNow

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.user_action == "getSearchResultList") {
    sendResponse({
        searchResultList: searchResultList
    });
  } else if (request.user_action == "searchButtonClicked") {
    var searchQueryValueEncoded = request.searchQueryValueEncoded;
    callTrevxAPI(searchQueryValueEncoded);
    sendResponse({
        searchResultList : searchResultList
    });

  } else if (request.user_action == "interactiveSearch") {
    callTrevxAPI(request.searchQueryValueEncoded);
    sendResponse({
        nothing : "nothing"
    });

  } else if (request.user_action == 'favoritesListAddRemove') {
      var target = request.audio_fav_id;
      isFavored = checkIfFavored(target);
      if (isFavored == -1) {
        addToFavorites(target);
      } else {
        removeFromFavorites(target);
      };
      sendResponse({
          nothing : "nothing"
      });

      chrome.storage.local.set({'favoritesList': favoritesList}, function() {
              });


  } else if (request.user_action == "getFavoritesList") {
    sendResponse({
        favoritesList : favoritesList
    });
  }
  else if (request.user_action == 'getWhatPlayingNow') {
    sendResponse({
      whatIsActiveList: whatIsActiveList,
      activeAudio: activeAudio,
      isPlaying: !l.paused

    });
    return true;
  }
  else if (request.user_action == "download") {
    window.open(request.audio_url);
  }
  else if (request.user_action == "playPause") {
    if (request.whichSectionClicked == "favorites-list") {
      makeListAsPlaylist(favoritesList);
      activeList = favoritesList;
      whatIsActiveList = "favorites-list";

    } else if (request.whichSectionClicked == "results-list") {
      makeListAsPlaylist(searchResultList);
      activeList = searchResultList;
      whatIsActiveList = "results-list";
    }
        // check if the recusted audio is new or not
    // makeListAsPlaylist(searchResultList);
    if (activeAudio == request.audio_id) {
      isNewAudio = false;
    } else {
      isNewAudio = true;
    }
    // whichSectionClicked = request.whichSectionClicked;
    //check if audio is finished take it back to start
    if (l.currentTime == l.duration){
      l.currentTime = 0;
      isPlaying = !isPlaying;
    }

    //check if the requsetd audio is new(not paused track),//if you remove this the audio file start from 0 even it paused.
    if ((activeAudio != request.audio_id)  ){
      l.src = getSrcById(request.audio_id, activeList);
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

// Action menue options
chrome.contextMenus.create({
      title: "Help",
      contexts: ["browser_action"],
      onclick: function() {
        window.open("help/index.html");
      }
});
chrome.contextMenus.create({
      title: "About us",
      contexts: ["browser_action"],
      onclick: function() {
        window.open("http://trevx.com/about-us.php");
      }
});
chrome.contextMenus.create({
      title: "Keyboard Shortcuts",
      contexts: ["browser_action"],
      onclick: function() {
        window.open("help/index.html#block6");
      }
});


// Welcom page, opened after installing extension
chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: "help/index.html"}, function (tab) {
    });
});


chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.update({}, function(tab) {
    if (command == 'playPause'){
      if (isPlaying) {
        l.pause();
        isPlaying = ! isPlaying;
      } else {
        l.play();
        isPlaying = ! isPlaying;
      }

    } else if (command == "playNext") {
      playNextAudio();
    } else if (command == 'palyPrevious') {
      playPreviousAudio();
    }
});
});

chrome.omnibox.onInputEntered.addListener(
    function(text)
    {
        chrome.tabs.getSelected(null, function(tab)
        {
            var url;
            if (text.substr(0, 7) == 'http://') {
                url = text;

            // If text does not look like a URL, user probably selected the default suggestion, eg reddit.com for your example
            } else {
                url = 'http://trevx.com/' + text + ".html";
            }
            chrome.tabs.update(tab.id, {url: url});
        });
    }
);
