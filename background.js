console.log("back.js");

var isPlaying = false;
var isNewAudio = true;
var activeAudio ='';
var audioState = '';
var l = new Audio();
var test = new Audio();
// test.src = 'http://ms1.sm3na.com/31/Sm3na_com_12995.mp3';
// test.src = 'http://ms1.sm3na.com/11/Sm3na_com_12182.mp3';
// l.currentTime = 5;
// first run, define searchResultList
if (typeof searchResultList === 'undefined') {
  var searchResultList =[];
  var isFoundResult = -1;
  chrome.storage.local.get("searchResultList", function(data) {
      searchResultList = data["searchResultList"];
    });
}

//not used
function readBody(xhr) {
    var data;
    if (!xhr.responseType || xhr.responseType === "text") {
        data = xhr.responseText;
    } else if (xhr.responseType === "document") {
        data = xhr.responseXML;
    } else {
        data = xhr.response;
    }
    return data;
}

function callTrevxAPI(searchQueryValueEncoded){
  // check internet connection
  if (navigator.onLine) {
    // http://trevx.com/v1/(query)/[start from]/[numOfResult]/?format=json
    var url = 'http://trevx.com/v1/'+ searchQueryValueEncoded +'/1/40/?format=json'
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url , false);
    xhr.send(null);

    //manipulate json object (it's work, but not the right way)
    searchResultList = xhr.response;
    isFoundResult = searchResultList.indexOf("Data Returned Successfully");
    if (isFoundResult != -1) {
      var end = searchResultList.indexOf(",\"details");
      searchResultList = searchResultList.substring(0, end);
      searchResultList = searchResultList +"]";
      searchResultList = JSON.parse(searchResultList);
      //remove redundent result
      searchResultList = searchResultList.reduceRight(function (r, a) {
          r.some(function (b) { return a.link === b.link; }) || r.push(a);
          return r;
      }, []);
    } else{
      searchResultList = [];
    }

    chrome.storage.local.set({'searchResultList': searchResultList}, function() {
            });
  }
}

// ruturn audio url to certain id
function getSrcById(id){
  for (var i = 0; i < searchResultList.length; i++) {
    if (searchResultList[i].id == id) {
      return searchResultList[i].link;
    }
  }
}

function getWhatPlayingNow(){
  // alert(l.paused);
  // alert('ddddddddddd');

  for (var i = 0; i < searchResultList.length; i++) {
      if (!l.paused && (searchResultList[i].id == activeAudio)) {
        return activeAudio;
      }

  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.user_action == "getSearchResultList") {
    chrome.storage.local.get("searchResultList", function(data) {
        searchResultList = data["searchResultList"];
      });
      // alert(searchResultList[0].id);
      // if ((searchResultList.length == 0) || (searchResultList[0].id==undefined)) {
      //   searchResultList = [];
      // }
    sendResponse({
        searchResultList: searchResultList
    });
  } else if (request.user_action == "searchButtonClicked") {
    var searchQueryValueEncoded = request.searchQueryValueEncoded;
    callTrevxAPI(searchQueryValueEncoded);
  }
  else if (request.user_action == 'getWhatPlayingNow') {
    // getWhatPlayingNow();
    sendResponse({
        activeAudio: getWhatPlayingNow()
    });
    return true;
  }
  else if (request.user_action == "download") {
    window.open(request.audio_url,"_blank");
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

// var searchResultList = [
//   {
//     "title": "Zain AlAbedeen",
//     link: "http://www.aldwaihi.com/ram/24frzdq37.mp3",
//     "id": "id-zain"
//   },
//   {
//     title: "Abdulrazzak",
//     link: "http://www.abdulrazzak.com/sounds/oant_hna_kank_ma_3lyk.mp3",
//     "id": "id-abd"
//   },
//   {
//     title: "Abdulrazzak 2",
//     link: "http://abdulrazzak.com/sounds/ya_sbr_ayob.mp3",
//     "id": "id-abd2"
//   },
//   {
//     title: "Water drop",
//     link: "http://www.funonsite.com/funarea/ringtones/download-ringtone-1362-funonsite.com.mp3",
//     "id": "id-water"
//   }
// ];
//
// chrome.storage.local.set({'searchResultList': searchResultList}, function() {
//         });

//
// locale: (function () {
//   var ajax = new XMLHttpRequest();
//
//   ajax.open("get", chrome.extension.getURL("locales/" + chrome.i18n.getMessage("locale") + "/ui.json"), false);
//   ajax.send();
//
//   return JSON.parse(ajax.responseText);
// }())
