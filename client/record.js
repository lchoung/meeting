'use strict';
var mongodb = require('mongodb');
const RecordRTC = require('recordrtc');
var uri = 'mongodb://meeting-admin:ce902ffsd318e@ds059306.mlab.com:59306/meeting';

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
    recordRTC.stopRecording(function(audioURL) {
      var formData = new FormData();
      formData.append('edition[audio]', recordRTC.getBlob());
      formData.append('test_thing', 'hello');
      console.log(formData.get('edition[audio]'));
      console.log(recordRTC.getBlob());

      mongodb.MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var recordings = db.collection('recordings');
        recordings.insert({cat:"hello", qty: 15}, function(err, data) {
          if (err) throw err;
          console.log("Successful insertion into db");
        });
      });
    });
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
