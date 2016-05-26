angular.module('App').service('SocketService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {

  var service = this;

  var socket = null; 

  this.getSocket = function (ip) {
    console.log("getSocket");
    if(socket==null){
      socket = io.connect(window.location.protocol+"//"+ip+"/game");
    }
    return socket;
  }

  this.disconnectSocket = function (argument) {
    if(socket!=null){
      socket.close();
    }
  }

}]);