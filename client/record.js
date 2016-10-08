'use strict';
var RecordRTC = require('recordrtc');

var recordRTC;
console.log("This is the record javascript file.");

var audioPromise = navigator.mediaDevices.getUserMedia({audio: true});

function successGetMediaCallback(mediaStream) {
  var options = {
    type: 'audio',
  };
  recordRTC = RecordRTC(mediaStream, options);
  recordRTC.startRecording();
  setTimeout(function(){
      console.log('after');
  },5000);
  recordRTC.stopRecording();
  console.log(recordRTC);
}

function errorMediaCallback(error) {
  console.log("There was an error getting the media stream.");
}

audioPromise.then(successGetMediaCallback).catch(errorMediaCallback);
