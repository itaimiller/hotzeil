(function() {
  var RESOURCE = "https://dl.dropboxusercontent.com/u/16319836/" +
    "hotze-israel/hotze-israel-nopres24.swf";

  var LOADING_MESSAGES = [
    'טוען אתר',
    'מעבד נתונים',
    'מפזר אוכלוסין',
    'מרחיב פערים',
    'מגדיל אי-שיוויון',
    'מנציח סטיגמות',
    'מרחיק מעמדות',
    'פוגע בהזדמנויות',
  ];

  var dom = {
    content: document.getElementById("flashContent"),
    progressBar: document.getElementById("progressBar"),
    progressText: document.getElementById("progressText"),
    progressFill: document.getElementById("progressFill"),
    loadingMessage: document.getElementById("loadingMessage")
  };

  var messageCount = LOADING_MESSAGES.length;

  var Loader = (function() {
    var progress = 0,
      loadingStarted = false;

    function mock() {
      if (loadingStarted) return;

      progress += 10;
      if (progress < 100) {
        setTimeout(mock, 1000);
      }
      dom.progressFill.style.width = progress + '%';
      dom.progressText.textContent = progress + '%';
      updateLoadingMessage();
    }

    function start() {
      var xhr = new XMLHttpRequest();
      xhr.onprogress = onprogress;
      xhr.onreadystatechange = onreadystatechange;

      xhr.open('GET', RESOURCE, true);
      xhr.send();
    }

    function onprogress(e) {
      loadingStarted = true;
      if (e.lengthComputable) {
        // never decrease progress
        progress = Math.max(Math.round((e.loaded / e.total) * 100), progress);
        dom.progressFill.style.width = progress + '%';
        dom.progressText.textContent = progress + '%';
        updateLoadingMessage();
      }
    }

    function onreadystatechange(e) {
      if (e.target.readyState === 4) {
        dom.content.style.display = "block";
        dom.progressBar.style.display = "none";
      }
    }

    return {
      start: start,
      mock: mock,
      getProgress: function() {
        return progress;
      }
    };

  })();


  function updateLoadingMessage(index) {
    if (typeof index === 'undefined') {
      index = Math.round(Loader.getProgress() / (100 / messageCount));
    }
    index = Math.min(index, messageCount - 1);
    console.log('message index',  index);
    dom.loadingMessage.textContent = LOADING_MESSAGES[index] + '…';
  }

  // Loader.start();
  updateLoadingMessage(0);
  Loader.mock();
})();