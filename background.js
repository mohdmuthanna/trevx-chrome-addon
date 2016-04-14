console.log("back.js");

var isPlaying = false;
var isNewAudio = true;
var activeAudio ='';
var audioState = '';
var l = new Audio();
var searchResultList = [];


var test = {
"id":"1",
"title":"White Flag",
"link":"http:\/\/musicjustfor.me\/assets\/songs\/17000-17999\/17223-white-flag-dido--1411569520.mp3",
"image":"",
"filename":"",
"queryId":"1",
"downloadUrl":"http:\/\/trevx.com\/download.php?songTitle=White Flag&fileloc=aHR0cDovL211c2ljanVzdGZvci5tZS9hc3NldHMvc29uZ3MvMTcwMDAtMTc5OTkvMTcyMjMtd2hpdGUtZmxhZy1kaWRvLS0xNDExNTY5NTIwLm1wMw==&key=7e369966ceef073b1beeb49ca3f98f76&resultid=1&queryid=1"};



var searchResultList = [
  {
    "title": "Zain AlAbedeen",
    "link": "http:\/\/trevx.com\/download.php?songTitle=Vybz Kartel - Hi&fileloc=aHR0cDovL21wM2h0dHAuY28veW1wM2RsLmh0bWw\/dmlkPXZxT2trVmwxaFVF&key=82bc4528f94588a63a080f876b55b61c&resultid=115179&queryid=8052",
    "id": "98989989887452165"
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
