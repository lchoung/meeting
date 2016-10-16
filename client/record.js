'use strict';
const RecordRTC = require('recordrtc');
var recordRTC;
var recordingStatus;
var isRecording;

function errorMediaCallback(error) {
  console.log("There was an error getting the media stream.");
}

var recordModule = angular.module('recordModule', []);

recordModule.controller('mainController', function($scope) {
  function successStartRecordingCallback(mediaStream) {
    var options = {
      type: 'audio',
    };
    recordRTC = RecordRTC(mediaStream, options);
    recordRTC.startRecording();
    $scope.$apply(function() {
      $scope.isRecording = true;
    });
    console.log("Started recording");
  }

  function successStopRecordingCallback(mediaStream) {
    recordRTC.stopRecording();
    $scope.$apply(function() {
      $scope.isRecording = false;
    });
    console.log("Stopped recording.");
  }

   $scope.startRecording = function() {
     var audioPromise = navigator.mediaDevices.getUserMedia({audio: true});
     audioPromise.then(successStartRecordingCallback).catch(errorMediaCallback);
   }
   $scope.stopRecording = function() {
     var audioPromise = navigator.mediaDevices.getUserMedia({audio: true});
     audioPromise.then(successStopRecordingCallback).catch(errorMediaCallback);
   }
 });
