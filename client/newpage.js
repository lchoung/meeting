'use strict';
var mongodb = require('mongodb');

var uri = 'mongodb://meeting-admin:ce902ffsd318e@ds059306.mlab.com:59306/meeting';

function errorMediaCallback(error) {
  console.log("There was an error getting the media stream.");
}

var recordModule = angular.module('recordModule', []);

recordModule.controller('mainController', function($scope) {
  function readRecordingCallback(mediaStream) {
    console.log("in");
    mongodb.MongoClient.connect(uri, function(err, db) { //talks to database
        if (err) throw err;

        var recordings = db.collection('recordings'); //want to read from recordings
        /* Wouldn't let me use other functions, like
        var ind = recordings.getIndexes() b/c 'not a function' even tho
        it's in the mongo library? */
        var dbstat = recordings.stats({
          'indexDetails' : true
        })
        console.log(dbstat);
        /* To see output of this, go to the console, press
        the Print list button in the new window, open the 
        'Promise' tab, then open the [[PromiseValue]]:Object
        tab. Variable 'count' is updated based on how many
        recordings are currently in the server. Yay it's talking to the db! */

      });
    console.log("out");
  }


   $scope.stopRecording = function() {
     var audioPromise = navigator.mediaDevices.getUserMedia({audio: true});
     /* I feel like I don't need the audioPromise for this but it won't let me do
     (readRecordingCallback).catch(errorMediaCallback) ?*/
     audioPromise.then(readRecordingCallback).catch(errorMediaCallback); 
   }
 });
