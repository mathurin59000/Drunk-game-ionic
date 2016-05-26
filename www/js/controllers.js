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

.controller('GameCtrl', function($scope, SocketService, $state) {
  console.log('GameCtrl');
  var player = $state.params.player;
  var socket = SocketService.getSocket(player.ip);

  socket.on('reset', function(){
    SocketService.disconnectSocket();
    window.location.href="/#/app/home";
    window.location.reload();
  });

})

.controller('PlaylistsCtrl', function($scope) {
  console.log('PlaylistsCtrl');
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
