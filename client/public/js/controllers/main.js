var app = angular.module("GrooveApp", [])

app.controller("OAuthController", ["$scope", "$http", "$window", function($scope, $http, $window){

  $scope.redirect = function(){
    $window.location.href = 'https://accounts.spotify.com/authorize/?client_id=6df5a5da139441d2842b4483b6370c13&response_type=token&redirect_uri=http://localhost:8080/user-profile&state=spotify_authorization_redirect&scope=user-read-email%20playlist-read-private'

    $scope.getUserInfo();
  }

  $scope.getUserInfo = function(){
    $http.get({
      url: "https://api.spotify.com/v1/me",
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }
    .then(function(response){
      console.log(response);
    })
    );


  }

  //look up refresh token, to see if your current token is valid

  // $.get({url: "",
  //       data: {},
  //       header: {
  //         Authorization: "Bearer access_token"
  //       }
  //
  // })



  var token = BQCt0pTY0ugluKHGvlQ-nx3ovOmaUw7jO26TYSkLDkMXtpNOyyPeM713HBbDpBf-O3IAbpLDLIFwtYEG4oBe976j3OPHa_5AHOQSK7fg6V9qbpfZzqkN4_3u9qFH_Js6cpzdewmNOor4gO4aRwbkewpTOcB16BI



}])
