"use strict";

(function (window, undefined) {
  var document = window.document;
  var docElement = document.documentElement;
  var docBody = document.body;
  var micBtn = document.getElementById('activateMic');
  var consoleLog = document.getElementById('consoleLog');
  var speechRecognition = window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition || window.SpeechRecognition;
  var speechGrammarList = window.webkitSpeechGrammarList || window.mozSpeechGrammarList || window.msSpeechGrammarList || window.oSpeechGrammarList || window.SpeechGrammarList;
  var speechSynthesis = window.speechSynthesis;
  var data = [{
    "emoji": "🐀",
    "hexncr": "&#x1F400;",
    "utf16": "\uD83D\uDC00",
    "lang.en": "rat",
    "lang.zh": "鼠"
  }, {
    "emoji": "🐄",
    "hexncr": "&#x1F404;",
    "utf16": "\uD83D\uDC04",
    "lang.en": "ox",
    "lang.zh": "牛"
  }, {
    "emoji": "🐅",
    "hexncr": "&#x1F405;",
    "utf16": "\uD83D\uDC05",
    "lang.en": "tiger",
    "lang.zh": "虎"
  }, {
    "emoji": "🐇",
    "hexncr": "&#x1F407;",
    "utf16": "\uD83D\uDC07",
    "lang.en": "rabbit",
    "lang.zh": "兔"
  }, {
    "emoji": "🐉",
    "hexncr": "&#x1F409;",
    "utf16": "\uD83D\uDC09",
    "lang.en": "dragon",
    "lang.zh": "龙"
  }, {
    "emoji": "🐍",
    "hexncr": "&#x1F40D;",
    "utf16": "\uD83D\uDC0D",
    "lang.en": "snake",
    "lang.zh": "蛇"
  }, {
    "emoji": "🐎",
    "hexncr": "&#x1F40E;",
    "utf16": "\uD83D\uDC0E",
    "lang.en": "horse",
    "lang.zh": "马"
  }, {
    "emoji": "🐐",
    "hexncr": "&#x1F410;",
    "utf16": "\uD83D\uDC10",
    "lang.en": "goat",
    "lang.zh": "羊"
  }, {
    "emoji": "🐒",
    "hexncr": "&#x1F412;",
    "utf16": "\uD83D\uDC12",
    "lang.en": "monkey",
    "lang.zh": "猴"
  }, {
    "emoji": "🐓",
    "hexncr": "&#x1F413;",
    "utf16": "\uD83D\uDC13",
    "lang.en": "chicken",
    "lang.zh": "鸡"
  }, {
    "emoji": "🐕",
    "hexncr": "&#x1F415;",
    "utf16": "\uD83D\uDC15",
    "lang.en": "dog",
    "lang.zh": "狗"
  }, {
    "emoji": "🐖",
    "hexncr": "&#x1F416;",
    "utf16": "\uD83D\uDC16",
    "lang.en": "pig",
    "lang.zh": "猪"
  }];
  var zodiac = data.map(function (animal) {
    return animal['lang.zh'];
  });
  var grammar = '#JSGF V1.0; grammar zodiac; public <zodiac> = ' + zodiac.join(' | ') + ' ;';
  var voices = [];
  docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1js$2');

  if (speechRecognition !== undefined) {
    addClass('speech');
    detectSpeech();
  } else {
    addClass('no-speech');
  }

  function addClass(className) {
    docElement.className = "".concat(docElement.className, " ").concat(className);
  }

  function detectSpeech() {
    var recognition = new speechRecognition();
    var speechRecognitionList = new speechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'cmn-Hans-CN';
    micBtn.addEventListener('click', function () {
      recognition.start();
      consoleLog.innerHTML = '语音识别功能激活！请对着麦克风讲话。';
    }, false);

    recognition.onresult = function (event) {
      var last = event.results.length - 1;
      var animal = event.results[last][0].transcript;
      consoleLog.innerHTML = '您应该说了: ' + animal + '.\n置信度: ' + event.results[0][0].confidence;
      activateEmoji(animal);
      readResponse('您的生肖是' + animal + '吧');
    };

    recognition.onspeechend = function () {
      recognition.stop();
    };

    recognition.onnomatch = function () {
      consoleLog.innerHTML = '不好意思，听不懂您说了什么。';
    };

    recognition.onerror = function (event) {
      if (event.error == 'no-speech') {
        consoleLog.innerHTML = '未检测到语音，请再试一次。';
      } else {
        consoleLog.innerHTML = 'Recognition error: ' + event.error;
      }
    };
  }

  function readResponse(result) {
    docBody.style.setProperty('--display', 'block');
    populateVoiceList();
    speechSynthesis.addEventListener('voiceschanged', function () {
      populateVoiceList();
    });
    var responseForm = document.getElementById('hearResponse');
    responseForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var select = document.getElementById('pickVoice');
      speechSynthesis.cancel();
      var utterStuff = new SpeechSynthesisUtterance(result);
      var selectedVoice = select.selectedOptions[0].getAttribute('data-name');
      voices.forEach(function (voice) {
        if (voice.name === selectedVoice) {
          utterStuff.voice = voice;
        }
      });
      speechSynthesis.speak(utterStuff);
    }, false);
  }

  function populateVoiceList() {
    var select = document.getElementById('pickVoice');
    voices = speechSynthesis.getVoices();
    voices.forEach(function (voice) {
      var lang = voice.lang;

      if (lang.includes('zh')) {
        var option = document.createElement('option');
        option.textContent = voice.name + ' (' + voice.lang + ')';
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        select.appendChild(option);
      }
    });
  }

  function activateEmoji(result) {
    var animalData = data.filter(function (animal) {
      return animal['lang.zh'] === result;
    });

    if (typeof animalData[0] !== 'undefined') {
      var animal = animalData[0]['lang.zh'];
      var emoji = animalData[0]['hexncr'];
      var zodiacContainer = document.querySelector('[data-animal=' + animal + ']');
      var zodiacMarkup = "<span class=\"emoji\" role=\"img\" tabindex=\"0\" aria-label=\"".concat(animal, "\">").concat(emoji, "</span>");
      zodiacContainer.innerHTML = zodiacMarkup;
    } else {
      /* To be replaced with some proper error handling */
      console.log('不在十二生肖内');
    }
  }
})(window);