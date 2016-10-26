'use strict';
var mongodb = require('mongodb');
var uri =
  'mongodb://meeting-admin:ce902ffsd318e@ds059306.mlab.com:59306/meeting';

console.log("Opening summary page");

var summaryModule = angular.module('summaryModule', []);
summaryModule.controller('summaryController', function($scope) {
  $scope.recordings = [];
  $scope.readRecording = function() {
    console.log("Called read recording");
    mongodb.MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var recordings = db.collection('recordings');
        var dbstat = recordings.find().forEach(function(item){
          $scope.recordings.push(item._id);
        });
      });
  }
  $scope.readRecording();
  $scope.things = [1,2,3];
  console.log($scope.recordings);
 });
