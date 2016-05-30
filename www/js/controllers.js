angular.module('App.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, SocketService, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.server = {
    ip: "",
    name: ""
  };
  var socket;

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.server.ip);
    console.log($scope.server.ip);
    socket = SocketService.getSocket($scope.server.ip);
    if(socket!=null){

      socket.on('connect', function(){
        socket.emit('user', $scope.server.name);
      })
      .on('join', function(name, img){
        console.log('join ! :)');
        if(name==$scope.server.name){
          console.log("Connected ! Waiting other players...");
          $scope.res = "Connected ! Waiting other players...\nYou can start !";
        }
      })
      .on('startGame', function(){
        $state.go('app.game', {player: $scope.server});
      });

    }
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('GameCtrl', function($scope, SocketService, $state, $http) {
  console.log('GameCtrl');
  var player = $state.params.player;
  var socket = SocketService.getSocket(player.ip);
  $scope.results = [];

  socket.on('reset', function(){
    SocketService.disconnectSocket();
    window.location.href="/#/app/home";
    window.location.reload();
  })
  .on('startButtons', function(){
    $state.go('app.buttons', {player: player});
  })
  .on('startYoutube', function(){
    $state.go('app.youtube', {player: player});
  });

})

.controller('ButtonsCtrl', function($scope, SocketService, $state) {
  console.log('ButtonsCtrl');
  var player = $state.params.player;
  console.log(player);
  var socket = SocketService.getSocket(player.ip);
  $scope.points = 0;
  $scope.start = false;
  $scope.end = false;

  socket.on('reset', function(){
    SocketService.disconnectSocket();
    window.location.href="/#/app/home";
    window.location.reload();
  })
  .on('stopButtons', function(results){
    console.log('retour stopButtons');
    $state.go('app.game', {player: player});
  });

  function getRandomArbitrary(min, max) {
    return Math.floor((Math.random() * max) + min);
  }

  $scope.addPoints = function(){
    $scope.buttonNumber = getRandomArbitrary(1, 24);
    $scope.points++;
  };

  function chronoGame(seconds){
    console.log(seconds);
    setTimeout(function(){ 
      if(seconds>0){
        $scope.countdown = seconds;
        chronoGame(seconds-1);
      }
      else if(seconds==0){
        $scope.buttonNumber = 0;
        console.log('Your score is '+$scope.points);
        $scope.end = true;
        socket.emit('endButtons', $scope.points);
        /*setTimeout(function(){ 
          $state.go('app.game', {player: player});
        }, 5000);*/
      }
      else{
        console.log('Your final score is '+$scope.points);
      }
      $scope.$apply();
    }, 1000);
  }

  function chrono(seconds){
    setTimeout(function(){ 
      if(seconds>0){
        $scope.countdown = seconds;
        chrono(seconds-1);
      }
      else if(seconds==0){
        $scope.countdown = "Go !";
        $scope.start = true;
        chrono(seconds-1);
      }
      else{
        $scope.buttonNumber = getRandomArbitrary(1, 24);
        console.log('chronoGame lancé !');
        chronoGame(20);
      }
      $scope.$apply();
    }, 1000);
  }
  console.log("chrono lancé !");
  chrono(10);

})

.controller('YoutubeCtrl', function($scope, SocketService, $state) {
  console.log('YoutubeCtrl');
  var player = $state.params.player;
  console.log(player);
  var socket = SocketService.getSocket(player.ip);
  $scope.points = 0;
  $scope.start = false;
  $scope.end = false;

  socket.on('reset', function(){
    SocketService.disconnectSocket();
    window.location.href="/#/app/home";
    window.location.reload();
  })
  .on('stopYoutube', function(results){
    console.log('retour stopButtons');
    $state.go('app.game', {player: player});
  });

  function youtubeGame(seconds){
    console.log(seconds);
    setTimeout(function(){ 
      if(seconds>0){
        $scope.countdown = seconds;
        youtubeGame(seconds-1);
      }
      else if(seconds==0){
        console.log('Your score is '+$scope.points);
        $scope.end = true;
        socket.emit('endYoutube', $scope.points);
        /*setTimeout(function(){ 
          $state.go('app.game', {player: player});
        }, 5000);*/
      }
      else{
        console.log('Your final score is '+$scope.points);
      }
      $scope.$apply();
    }, 1000);
  }

  function chrono(seconds){
    setTimeout(function(){ 
      if(seconds>0){
        $scope.countdown = seconds;
        chrono(seconds-1);
      }
      else if(seconds==0){
        $scope.countdown = "Go !";
        $scope.start = true;
        chrono(seconds-1);
      }
      else{
        console.log('Youtube lancé !');
        youtubeGame(10);
      }
      $scope.$apply();
    }, 1000);
  }
  console.log("chrono lancé !");
  chrono(10);  
});
