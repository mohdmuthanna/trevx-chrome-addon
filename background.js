console.log("back.js");

var isPlaying = false;
var isNewAudio = true;
var activeAudio ='';
var audioState = '';
var l = new Audio();

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

var xhr = new XMLHttpRequest();

// http://trevx.com/v1/(query)/[start from]/[numOfResult]/?format=json

xhr.open('GET', 'http://trevx.com/v1/ali/1/40/?format=json', false);
xhr.send(null);

//manipulate json object
var searchResultList = xhr.response;
var end = searchResultList.indexOf(",\"details");
searchResultList = searchResultList.substring(0, end);
searchResultList = searchResultList +"]";
var searchResultList = JSON.parse(searchResultList);

var searchResultList4444 = [
  {
    "title": "Zain AlAbedeen",
    "link": "http:\/\/trevx.com\/download.php?songTitle=Vybz Kartel - Hi&fileloc=aHR0cDovL21wM2h0dHAuY28veW1wM2RsLmh0bWw\/dmlkPXZxT2trVmwxaFVF&key=82bc4528f94588a63a080f876b55b61c&resultid=115179&queryid=8052",
    "id": "98989989887452165",
    'ism':"ccccccccccc"
  },
  {
    "title": "Abdulrazzak",
    "link": "http://www.abdulrazzak.com/sounds/oant_hna_kank_ma_3lyk.mp3",
    "id": "id-abd"
  },
  {
    "title": "Abdulrazzak 2",
    "link": "http://abdulrazzak.com/sounds/ya_sbr_ayob.mp3",
    "id": "id-abd2"
  },
  {
    "title": "Water drop",
    "link": "http://www.funonsite.com/funarea/ringtones/download-ringtone-1362-funonsite.com.mp3",
    "id": "id-water"
  },
  {
    "title": "Zain AlAbedeen",
    "link": "http://www.aldwaihi.com/ram/24frzdq37.mp3",
    "id": "id-zain1"
  },
  {
    "title": "Abdulrazzak",
    "link": "http://www.abdulrazzak.com/sounds/oant_hna_kank_ma_3lyk.mp3",
    "id": "id-abd1"
  },
  {
    "title": "Abdulrazzak 2",
    "link": "http://abdulrazzak.com/sounds/ya_sbr_ayob.mp3",
    "id": "id-abd21"
  },
  {
    "title": "Water drop1",
    "link": "http://www.funonsite.com/funarea/ringtones/download-ringtone-1362-funonsite.com.mp3",
    "id": "id-water1"
  }
];


// searchResultList =
// [{"id":"87932","title":"Crystallize - Lindsey Stirling","link":"http:\/\/mp3http.co\/ymp3dl.html?vid=aHjpOzsQ9YI",
// "image":"http:\/\/i.ytimg.com\/vi\/aHjpOzsQ9YI\/default.jpg","filename":"","queryId":"5881","downloadUrl":"http:\/\/trevx.com\/download.php?songTitle=Crystallize - Lindsey Stirling&fileloc=aHR0cDovL21wM2h0dHAuY28veW1wM2RsLmh0bWw\/dmlkPWFIanBPenNROVlJ&key=cd68dd617cb8f72a201afbe305a98776&resultid=87932&queryid=5881"},{"id":"87933","title":"Flashlight - Jessie J - Violin Cover - Daniel Jang","link":"http:\/\/mp3http.co\/ymp3dl.html?vid=jYG0GTNY8cc","image":"http:\/\/i.ytimg.com\/vi\/jYG0GTNY8cc\/default.jpg","filename":"","queryId":"5881","downloadUrl":"http:\/\/trevx.com\/download.php?songTitle=Flashlight - Jessie J - Violin Cover - Daniel Jang&fileloc=aHR0cDovL21wM2h0dHAuY28veW1wM2RsLmh0bWw\/dmlkPWpZRzBHVE5ZOGNj&key=575bfcd4945bad8d1e79f0015bc35e23&resultid=87933&queryid=5881"},{"id":"87934","title":"Elements - Lindsey Stirling","link":"http:\/\/mp3http.co\/ymp3dl.html?vid=sf6LD2B_kDQ","image":"http:\/\/i.ytimg.com\/vi\/sf6LD2B_kDQ\/default.jpg","filename":"","queryId":"5881","downloadUrl":"http:\/\/trevx.com\/download.php?songTitle=Elements - Lindsey Stirling&fileloc=aHR0cDovL21wM2h0dHAuY28veW1wM2RsLmh0bWw\/dmlkPXNmNkxEMkJfa0RR&key=e76e4a3b0e6a70b92e11a24d63fed689&resultid=87934&queryid=5881"},{"id":"87931","title":"Ellie Goulding - Love Me Like You Do","link":"http:\/\/mp3http.co\/ymp3dl.html?vid=g3SSEd2MO7g","image":"http:\/\/i.ytimg.com\/vi\/g3SSEd2MO7g\/default.jpg","filename":"","queryId":"5881","downloadUrl":"http:\/\/trevx.com\/download.php?songTitle=Ellie Goulding - Love Me Like You Do&fileloc=aHR0cDovL21wM2h0dHAuY28veW1wM2RsLmh0bWw\/dmlkPWczU1NFZDJNTzdn&key=1f2d5853947c3ba907979d7efcd14db1&resultid=87931&queryid=5881"}];



// chrome.storage.sync.get("searchResultList", function(data) {
//     searchResultList = data["searchResultList"];
//   });

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
    // alert('getSearchResultList');
    sendResponse({
        searchResultList: searchResultList
    });
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
// chrome.storage.sync.set({'searchResultList': searchResultList}, function() {
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
