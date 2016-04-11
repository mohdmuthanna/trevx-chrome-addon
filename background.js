console.log("back.js");

var isPlaying = false;
var isNewAudio = true;
var activeAudio ='';
var l = new Audio();
var searchResultList = [];


var playLists = [
  {
    playListTitle: "Road Music",
    playListId: "id-road",
    content: [
        {
          audioTitle: "Zain AlAbedeen LP",
          audioUrl: "http://www.aldwaihi.com/ram/24frzdq37.mp3",
          audioId: "id-zain"
        },
        {
          audioTitle: "Abdulrazzak PL",
          audioUrl: "http://www.abdulrazzak.com/sounds/oant_hna_kank_ma_3lyk.mp3",
          audioId: "id-abd"
        },
        {
          audioTitle: "Abdulrazzak 2 PL",
          audioUrl: "http://abdulrazzak.com/sounds/ya_sbr_ayob.mp3",
          audioId: "id-abd2"
        }
    ],


  },
  {
    playListTitle: "Study Music",
    playListId: "id-study",
    content: [
        {
          audioTitle: "Zain AlAbedeen LP2",
          audioUrl: "http://www.aldwaihi.com/ram/24frzdq37.mp3",
          audioId: "id-zain"
        },
        {
          audioTitle: "Abdulrazzak PL2",
          audioUrl: "http://www.abdulrazzak.com/sounds/oant_hna_kank_ma_3lyk.mp3",
          audioId: "id-abd"
        },
        {
          audioTitle: "Abdulrazzak 2 PL2",
          audioUrl: "http://abdulrazzak.com/sounds/ya_sbr_ayob.mp3",
          audioId: "id-abd2"
        }
    ]
  }
];


function getPlayListById(id){
  for (var i = 0; i < playLists.length; i++) {
    // alert(playLists[i]);
    if (playLists[i].playListId == id){
      return playLists[i];
    }
  }
} // end of getPlayListById


// alert(playList[0].content[1].audioTitle);

// var playList = [
//   "list0":{""}
//
//   [1,2,3],
//   [3,4,5]
// ];



chrome.storage.sync.get("searchResultList", function(data) {
    searchResultList = data["searchResultList"];
  });


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.user_action == "getList") {
    // alert('getList');
    sendResponse({
        searchResultList: searchResultList
    });
  }
  else if (request.user_action == "getPlayList") {
    playListTitle = request.play_list_id;
    playList = getPlayListById(playListTitle);
    sendResponse({
        playList: playList
    });
  }
  else if (request.user_action == "download") {
    window.open(request.audio_url,"_blank");
  }
  else if (request.user_action == "playPause") {

    // alert(activeAudio == request.audio_url
    // check if the recusted audio is new or not
    if (activeAudio == request.audio_url) {
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
    //if you remove this the audio file start from 0 even it pased.
    if ((activeAudio != l.src) || (l.src != request.audio_url) ){
      l.src = request.audio_url;
    }

    if ((isPlaying && !isNewAudio)) {
          // alert("pause");
          isPlaying = !isPlaying;
          l.pause();  // Stop playing
        // l.currentTime = 0;  // Go to to second no. Zero (start of the file)
        } else {
          activeAudio = request.audio_url;
          isPlaying = !isPlaying;
          // l.src = request.audio_url;
          l.play();
        };
  }
});








// chrome.runtime.onMessage.addListener(
// function(request, sender, sendResponse) {
// switch (user_action)
//             {
//                case 'getList': sendResponse({
//                    searchResultList: searchResultList
//                  });
//                break;
//
//                case 'playPause':  alert('play case');
//                  var l = new Audio();
//                  // l.src = audio_url;
//                  l.src = 'http://www.aldwaihi.com/ram/7nadm2.mp3';
//                  l.play();
//                break;
//
//                default:  alert("default")
//             };
//



//http://82.212.80.31/wezi_mp3/mp3/j1yLOUnkoW0.mp3    //la tusali7
//http://www.aldwaihi.com/ram/7nadm2.mp3
//http://www.aldwaihi.com/ram/24frzdq37.mp3   //Zain Alabdeen
//http://www.abdulrazzak.com/sounds/oant_hna_kank_ma_3lyk.mp3
//        sendResponse({msg: "Play"});
//        sendResponse({msg: "Pause"});


// var a = new Audio();
// a.src = 'http://www.aldwaihi.com/ram/7nadm2.mp3';
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if (request.user_action == "playPause")
//       if (isPlaying) {
//         isPlaying = !isPlaying;
//         a.pause();  // Stop playing
//         // a.currentTime = 0;  // Go to to second no. Zero (start of the file)
//       } else {
//         isPlaying = !isPlaying;
//         a.play();
//       };
//     };
//       sendResponse({
//         msg: "goodbye!"
//       });
//   });

// l.src = 'http://www.aldwaihi.com/ram/7nadm2.mp3';

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse)
//     if (request.user_action == "getList")
//       console.log("getList");
//       sendResponse({searchResultList: searchResultList});
//     );



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
