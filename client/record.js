'use strict';
var mongodb = require('mongodb');
const RecordRTC = require('recordrtc');
var uri = 'mongodb://meeting-admin:ce902ffsd318e@ds059306.mlab.com:59306/meeting';

var recordRTC;
var recorder;
var recorderReady = false;
var recordingStatus;
var isRecording;

var recognizer;
var recognizerReady = false;
var callbackManager;
var outputContainer;


var wordList = [
	["ONE", "W AH N"],
	["TWO", "T UW"],
	["THREE", "TH R IY"],
	["FOUR", "F AO R"],
	["FIVE", "F AY V"],
	["SIX", "S IH K S"],
	["SEVEN", "S EH V AH N"],
	["EIGHT", "EY T"],
	["NINE", "N AY N"],
	["ZERO", "Z IH R OW"],
	["NEW-YORK", "N UW Y AO R K"],
	["NEW-YORK-CITY", "N UW Y AO R K S IH T IY"],
	["PARIS", "P AE R IH S"],
	["PARIS(2)", "P EH R IH S"],
	["SHANGHAI", "SH AE NG HH AY"],
	["SAN-FRANCISCO", "S AE N F R AE N S IH S K OW"],
	["LONDON", "L AH N D AH N"],
	["BERLIN", "B ER L IH N"],
	["SUCKS", "S AH K S"],
	["ROCKS", "R AA K S"],
	["IS", "IH Z"],
	["NOT", "N AA T"],
	["GOOD", "G IH D"],
	["GOOD(2)", "G UH D"],
	["GREAT", "G R EY T"],
	["WINDOWS", "W IH N D OW Z"],
	["LINUX", "L IH N AH K S"],
	["UNIX", "Y UW N IH K S"],
	["MAC", "M AE K"],
	["AND", "AE N D"],
	["AND(2)", "AH N D"],
	["O", "OW"],
	["S", "EH S"],
	["X", "EH K S"]
];

var grammars = [{
	g: {
		numStates: 1,
		start: 0,
		end: 0,
		transitions: [{
			from: 0,
			to: 0,
			word: "ONE"
		}, {
			from: 0,
			to: 0,
			word: "TWO"
		}, {
			from: 0,
			to: 0,
			word: "THREE"
		}, {
			from: 0,
			to: 0,
			word: "FOUR"
		}, {
			from: 0,
			to: 0,
			word: "FIVE"
		}, {
			from: 0,
			to: 0,
			word: "SIX"
		}, {
			from: 0,
			to: 0,
			word: "SEVEN"
		}, {
			from: 0,
			to: 0,
			word: "EIGHT"
		}, {
			from: 0,
			to: 0,
			word: "NINE"
		}, {
			from: 0,
			to: 0,
			word: "ZERO"
		}]
	}
}];


function errorMediaCallback(error) {
  console.log("There was an error getting the media stream.");
}

var recordModule = angular.module('recordModule', []);

// Instantiating AudioContext
try {
    var audioContext = new AudioContext();
} catch (e) {
    console.log("Error initializing Web Audio");
}

recordModule.controller('mainController', function($scope) {
  // A function that spawns a recognizer worker and runs function on worker
  // when the worker is ready
  // function spawnWorker(workerURL, onReady) {
  //   console.log("Spawning new worker");
  //   recognizer = new Worker(workerURL);
  //   // Does not run function until recognizer can read messages
  //   recognizer.onmessage = function(event) {
  //     console.log("On message of the worker recognizer", event);
  //     onReady(recognizer);
  //   };
  //   recognizer.postMessage('');
  //   console.log("First message sent");
  // }
  // A convenience function to post a message to the recognizer and associate
  // a callback to its response
  // var initRecognizer = function() {
  //   console.log("Called initRecognizer");
  //   postRecognizerJob({command: 'initialize'},
  //     function() {
  //       if (recorder) {
  //         recorder.consumers = [recognizer];
  //         console.log("Initialized recognizer:", recognizer);
  //       }
  //     }
  //   );
  // };

  // function successStartRecordingCallback(mediaStream) {
  //   // var input = audioContext.createMediaStreamSource(mediaStream);
  //   // console.log("Entered function: successStartRecordingCallback");
  //   // var options = {
  //   //   type: 'audio',
  //   // };
  //   // recorder = new AudioRecorder(input);
  //   callbackManager = new CallbackManager();
  //   //Spawn a recognizer
  //   console.log("Spawned a recognizer");
  //   spawnWorker("../pocketsphinx/recognizer.js", function(worker) {
  //     worker.onmessage = function(e) {
  //       debugger;
  //       console.log("Second message sent.");
  //       //This is the case when we have a callback id to be called
  //       if (e.data.hasOwnProperty('id')) {
  //         console.log("ID");
  //         var clb = callbackManager.get(e.data['id']);
  //         var data = {};
  //         if ( e.data.hasOwnProperty('data')) data = e.data.data;
  //         if(clb) clb(data);
  //       }
  //       // This is a case when the recognizer has a new hypothesis
  //       if (e.data.hasOwnProperty('hyp')) {
  //         console.log("hyp");
  //         var newHyp = e.data.hyp;
  //         if (e.data.hasOwnProperty('final') &&  e.data.final) newHyp = "Final: " + newHyp;
  //         // updateHyp(newHyp);
  //       }
  //       // This is the case when we have an error
  //       if (e.data.hasOwnProperty('status') && (e.data.status == "error")) {
  //         console.log(e);
  //         console.log("Error in " + e.data.command + " with code " + e.data.code);
  //       }
  //     };
  //     initRecognizer();
  //     console.log("Called initRecognizer from main");
  //   });
  //
  //   recorder.start();
  //   $scope.$apply(function() {
  //     $scope.isRecording = true;
  //   });
  //   console.log("Started recording");
  // }
  //
  // function successStopRecordingCallback(mediaStream) {
  //   recorder.stop()
  //   $scope.$apply(function() {
  //     $scope.isRecording = false;
  //   });
  //   console.log("Stopped recording.");
  // }

   $scope.startRecording = function() {
    //  var audioPromise = navigator.mediaDevices.getUserMedia({audio: true});
    //  audioPromise.then(successStartRecordingCallback).catch(errorMediaCallback);
      console.log("Start recording");
   }
   $scope.stopRecording = function() {
    //  var audioPromise = navigator.mediaDevices.getUserMedia({audio: true});
    //  audioPromise.then(successStopRecordingCallback).catch(errorMediaCallback);
      console.log("Stop recording");
   }
 });

 function postRecognizerJob(message, callback) {
   console.log("Post recognizer job. Message: ", message);
   var msg = message || {};
   if (callbackManager) {
     msg.callbackId = callbackManager.add(callback);
     console.log("Added callback");
   }
   if (recognizer) {
     recognizer.postMessage(msg);
     console.log("Posted messages");
   }
 };

 function feedGrammar(g, index, id) {

 	if (index < g.length) {

 		postRecognizerJob({
 			command: 'addGrammar',
 			data: g[index].g
 		}, function(id) {
 			feedGrammar(grammars, index + 1, {
 				id: id
 			});
 		});

 	} else {
 		recognizerReady = true;
 	}

 }

 // This starts recording. We first need to get the id of the grammar to use
function startRecording() {
	if (recorder && recorder.start(0)) {
		//keywordIndicator.style.display = 'block';
	}
}

 window.onload = function() {
   // Create a worker thread to run recognizer
   recognizer = new Worker('../pocketsphinx/recognizer.js');
   callbackManager = new CallbackManager();

   outputContainer = document.getElementById("output");

   // Instantiate Audio Context
   try {
     window.AudioContext = window.AudioContext || window.webkitAudioContext;
     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
     window.URL = window.URL || window.webkitURL;
   } catch (e) {
     console.log("Incompatible browser");
   }
   // Start an audio stream from user media
   if (navigator.getUserMedia) {
     navigator.getUserMedia({
       audio: true
     }, function(stream) {
       var input = audioContext.createMediaStreamSource(stream);
       var audioRecorderConfig = {
         errorCallback: function(e) {
           console.log("Error");
         }
       };

      // Create a recorder object
      recorder = new AudioRecorder(input, audioRecorderConfig);

      // Add our recognizer as a listener to what the recorder outputs
      if (recognizer) {
        recorder.consumers = [recognizer];
      }
      recorderReady = true;
    }, function(error) {
      console.log("error: ", error);
    });
   }

   // Set up what the recognizer does on a message receive
   recognizer.onmessage = function() {
     recognizer.onmessage = function(e) {
       if (e.data.hasOwnProperty('id')) {
         var data = {};

         if (e.data.hasOwnProperty('data')) {
            data = e.data.data;
         }
         var callback = callbackManager.get(e.data['id']);
         if (callback) {
           callback(data);
         }
       }
       if (e.data.hasOwnProperty('hyp')) {
         var hypothesis = e.data.hyp;
         if (outputContainer) {
           outputContainer.innerHTML = hypothesis;
         }
       }

       if (e.data.hasOwnProperty('status') && (e.data.status == "error")) {
         console.log("Error");
       }
     };

     // When the worker is loaded, we call initialize
     postRecognizerJob({
       command: 'initialize'
     }, function() {
       if (recorder) {
         recorder.consumers = [recognizer];
       }

       postRecognizerJob({
         command: 'addWords',
         data: wordList
       }, function() {
         feedGrammar(grammars, 0);
         startRecording();
       });
     });
   }
   recognizer.postMessage('');
   console.log("message posted");
 };
