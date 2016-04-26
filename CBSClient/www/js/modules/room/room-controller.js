'use strict';

function RoomController($scope, $state, localStorageService, SocketService,
                        moment, $ionicScrollDelegate) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  var me = this;

  me.messages = [];

  $scope.humanize = function(timestamp){
    return moment(timestamp).fromNow();
  };

  me.current_room = localStorageService.get('room');

  var current_user = localStorageService.get('username');

  $scope.isNotCurrentUser = function(user){

    if (current_user != user){
      return 'not-current-user';
    }

    return 'current-user';
  };

  $scope.sendTextMessage = function(){

    var msg = {
      'room': me.current_room,
      'user': current_user,
      'text': me.message,
      'time': moment()
    };

    me.messages.push(msg);
    $ionicScrollDelegate.scrollBottom();
    me.message = '';

    SocketService.emit('send:message', msg);
  };

  $scope.leaveRoom = function(){
    var msg = {
      'user': current_user,
      'room': me.current_room,
      'time': moment()
    };

    SocketService.emit('leave:room', msg);
    $state.go('rooms');
  };

  SocketService.on('message', function(msg){
    me.messages.push(msg);
    $ionicScrollDelegate.scrollBottom();
  });

  SocketService.on('updateUsers', function(data){
    alert(data);
  });


}

module.exports = ['$scope', '$state', 'localStorageService', 'SocketService',
                  'moment', '$ionicScrollDelegate', RoomController];
