'use strict';
const RecordRTC = require('recordrtc');
var recordRTC;
var recordingStatus;
var isRecording;

function successStartRecordingCallback(mediaStream) {
  var options = {
    type: 'audio',
  };
  recordRTC = RecordRTC(mediaStream, options);
  recordRTC.startRecording();
  console.log("Started recording");
  isRecording = true;
}

function successStopRecordingCallback(mediaStream) {
  recordRTC.stopRecording();
  console.log("Stopped recording.");
  isRecording = false;
}

function errorMediaCallback(error) {
  console.log("There was an error getting the media stream.");
}

var recordModule = angular.module('recordModule', []);
  recordModule.controller('mainController', function($scope) {
   $scope.quantity=1;
   $scope.startRecording = function() {
     var audioPromise = navigator.mediaDevices.getUserMedia({audio: true});
     audioPromise.then(successStartRecordingCallback).catch(errorMediaCallback);
   }
   $scope.stopRecording = function() {
     console.log("Stop recording");
     var audioPromise = navigator.mediaDevices.getUserMedia({audio: true});
     audioPromise.then(successStopRecordingCallback).catch(errorMediaCallback);
   }
 });
