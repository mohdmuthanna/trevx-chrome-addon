var container = document.getElementById('trevx-get-list-result');

if (container) {
  console.log("Start popup.js");

  function createAudioLine(audioList){
    var links = '';
    for (var i = 0; i < audioList.length; i++) {
      links += "<br><a class='line' id='"+audioList[i].audioId+"' href='"+audioList[i].audioUrl+"'>"+ audioList[i].audioTitle+"</a><br>";
    }

    return (links);
  };

  function playPause(target) {
    chrome.runtime.sendMessage({
        user_action: "playPause",
        audio_url: target.href
      }, function(response) {
        // document.getElementById("play-pause").innerHTML = response.msg;
      });
  }

  window.onload = function() {
    console.log("win onload");
    getList();
  };

  function getList() {
    console.log("getList");
    chrome.runtime.sendMessage({
      user_action: "getList"
      },

      function(response) {
        console.log("response");
        // document.body.innerHTML = createAudioLine(response.audioList) + document.body.innerHTML;

        container.innerHTML = createAudioLine(response.audioList);

        // $('a').click(function(){
        //     alert($(this).id());
        // });
        var audioLinks = document.querySelectorAll('.line');

        for (var i = 0; i < audioLinks.length; i++) {
            audioLinks[i].addEventListener('click', function(event) {
                // if (!confirm("sure u want to delete " + this.title)) {
                // }
                playPause(this);
            });
        }
        // var links = document.querySelectorAll('a');
        // document.querySelector("#id-abd").onclick = function(e) {
        //   // alert(links[0].click());
        //   // alert(this.dataset.index);
        //   playPause();
        // };

        // playPause();
        // document.body.innerHTML = createAudioLine(response.audioList) + document.body.innerHTML;
        // document.getElementById("get-list").textContent = ;
        // var e = document.createElement('div');
        // e.innerHTML = "555555555555555555";
      });
  }
  //
  // chrome.browserAction.onClicked
  // document.getElementById('a').onclick = function(e){
  //   playPause();
  // }


  // chrome.tabs.onUpdated.addListener
  // chrome.browserAction.onClicked.addListener

  // document.addEventListener('DOMContentLoaded', function () {
  //      document.querySelector('a').addEventListener('click', showalert, false);
  // }, false);

  // function showalert() {
  //     alert("you just pressed the button");
  // }
}
