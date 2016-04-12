console.log("back.js");

var isPlaying = false;
var isNewAudio = true;
var activeAudio ='';
var l = new Audio();
var searchResultList = [];

var searchResultList = [
  {
    audioTitle: "Zain AlAbedeen",
    audioUrl: "http://www.aldwaihi.com/ram/24frzdq37.mp3",
    audioId: "98989989887452165"
  },
  {
    audioTitle: "Abdulrazzak",
    audioUrl: "http://www.abdulrazzak.com/sounds/oant_hna_kank_ma_3lyk.mp3",
    audioId: "id-abd"
  },
  {
    audioTitle: "Abdulrazzak 2",
    audioUrl: "http://abdulrazzak.com/sounds/ya_sbr_ayob.mp3",
    audioId: "id-abd2"
  },
  {
    audioTitle: "Water drop",
    audioUrl: "http://www.funonsite.com/funarea/ringtones/download-ringtone-1362-funonsite.com.mp3",
    audioId: "id-water"
  },
  {
    audioTitle: "Zain AlAbedeen",
    audioUrl: "http://www.aldwaihi.com/ram/24frzdq37.mp3",
    audioId: "id-zain1"
  },
  {
    audioTitle: "Abdulrazzak",
    audioUrl: "http://www.abdulrazzak.com/sounds/oant_hna_kank_ma_3lyk.mp3",
    audioId: "id-abd1"
  },
  {
    audioTitle: "Abdulrazzak 2",
    audioUrl: "http://abdulrazzak.com/sounds/ya_sbr_ayob.mp3",
    audioId: "id-abd21"
  },
  {
    audioTitle: "Water drop1",
    audioUrl: "http://www.funonsite.com/funarea/ringtones/download-ringtone-1362-funonsite.com.mp3",
    audioId: "id-water1"
  }
];

// chrome.storage.sync.get("searchResultList", function(data) {
//     searchResultList = data["searchResultList"];
//   });

function getSrcById(id){
  for (var i = 0; i < searchResultList.length; i++) {
    if (searchResultList[i].audioId == id) {
      return searchResultList[i].audioUrl;
    }
  }
}


function getWhatPlayingNow(){
  // alert(l.paused);
  // alert('ddddddddddd');

  for (var i = 0; i < searchResultList.length; i++) {
    array[i]
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.user_action == "getSearchResultList") {
    // alert('getSearchResultList');
    sendResponse({
        searchResultList: searchResultList
    });
  }
  else if (request.user_action == 'toggleButtonPlayPause') {
    getWhatPlayingNow();
    sendResponse({
        searchResultList: searchResultList
    });
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

    //check if the requsetd audio is new(not paused track),
    //if you remove this the audio file start from 0 even it paused.
    if ((activeAudio != request.audio_id)  ){
      l.src = getSrcById(request.audio_id);
    }

        //pause
    if ((isPlaying && !isNewAudio)) {
          isPlaying = false;
          l.pause();  // Stop playing // l.currentTime = 0;  // Go to to second no. Zero (start of the file)
        } else {  // play
          activeAudio = request.audio_id;
          isPlaying = true;
          l.play();
        };
  }
});

// var searchResultList = [
//   {
//     audioTitle: "Zain AlAbedeen",
//     audioUrl: "http://www.aldwaihi.com/ram/24frzdq37.mp3",
//     audioId: "id-zain"
//   },
//   {
//     audioTitle: "Abdulrazzak",
//     audioUrl: "http://www.abdulrazzak.com/sounds/oant_hna_kank_ma_3lyk.mp3",
//     audioId: "id-abd"
//   },
//   {
//     audioTitle: "Abdulrazzak 2",
//     audioUrl: "http://abdulrazzak.com/sounds/ya_sbr_ayob.mp3",
//     audioId: "id-abd2"
//   },
//   {
//     audioTitle: "Water drop",
//     audioUrl: "http://www.funonsite.com/funarea/ringtones/download-ringtone-1362-funonsite.com.mp3",
//     audioId: "id-water"
//   }
// ];
//
// chrome.storage.sync.set({'searchResultList': searchResultList}, function() {
//         });
