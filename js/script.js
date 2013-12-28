(function() {
  'use strict';

  var RESOURCE = "hotze-israel-nopres24.swf";

  var CLASS_CONTENT_READY = 'content-ready';

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

  var messageCount = LOADING_MESSAGES.length;

  var dom = {
    container: document.getElementById('container'),
    intro: document.getElementById('intro'),
    content: document.getElementById('content'),
    progressText: document.getElementById('progressText'),
    progressFill: document.getElementById('progressFill'),
    loadingMessage: document.getElementById('loadingMessage'),
    startButton: document.getElementById('start')
  };

  var Loader = (function() {
    var progress = 0,
      loadingStarted = false;

    function mock() {
      if (loadingStarted) return;

      progress += 10;
      if (progress < 100) {
        setTimeout(mock, 300);
      } else {
        onResourceReady();
        return;
      }
      dom.progressFill.style.width = progress + '%';
      dom.progressText.textContent = progress + '%';
      setLoadingMessage();
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
        setLoadingMessage();
      }
    }

    function onreadystatechange(e) {
      if (e.target.readyState === 4) {
        onResourceReady();
      }
    }

    function onResourceReady() {
      dom.container.addEventListener('transitionend', function tEnd(e) {
        e.target.removeEventListener('transitionend', tEnd);
        dom.intro.style.opacity = 1;
      });

      document.body.className += (' ' + CLASS_CONTENT_READY);

      dom.startButton.addEventListener('click', function onClick() {
        dom.container.addEventListener('transitionend', function(e) {
          e.target.style.display = 'none';
          dom.content.style.display = 'block';
        });

        dom.container.style.opacity = 0;
      });
    }

    return {
      start: start,
      mock: mock,
      getProgress: function() {
        return progress;
      }
    };

  })();


  function setLoadingMessage(index) {
    if (typeof index === 'undefined') {
      index = Math.round(Loader.getProgress() / (100 / messageCount));
    }
    index = Math.min(index, messageCount - 1);
    dom.loadingMessage.textContent = LOADING_MESSAGES[index] + '…';
  }

  setLoadingMessage(0);
  // Loader.mock();
  Loader.start();
})();