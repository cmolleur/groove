var app = angular.module("GrooveApp", [])

app.controller("OAuthController", ["$scope", "$http", "$window", function($scope, $http, $window){

  $scope.redirect = function(){
    $window.location.href = 'https://accounts.spotify.com/authorize/?client_id=6df5a5da139441d2842b4483b6370c13&show_dialog=true&response_type=token&redirect_uri=http://localhost:8080/user-profile&state=spotify_authorization_redirect&scope=user-read-email%20playlist-read-private%20playlist-read-collaborative'
  }

  $scope.getUserInfo = function(){
    //get users info, including the access_token
    var callbackResponse = (document.URL).split("#")[1];
    var responseParameters = callbackResponse.split("&");
    params = {}
    // oauth;

    responseParameters.forEach( function(pair){
      parameters = pair.split("=");
      params[ parameters[0] ] = parameters[1];
    })

    if( params.access_token ){
      oauth = {
        access_token: params.access_token
        // consider adding the expires in and starting a timer
      };
      console.log("oauth: ", oauth);
    } else {
      alert("Problem Authenticating!");
    }

    console.log( "params: " )
    console.log( params )

    $http.get("https://api.spotify.com/v1/me/", { headers: { Authorization: "Bearer " + oauth.access_token} }).then(function(response){
      console.log("Response ", response);

      $scope.user = response.data.display_name.split(" ")[0];
      userId = response.data.id;
      // console.log("Response " + response);

      $scope.getUserPlaylists();
    });

    // maybe check if token's valid - OTHER FUNCTION

    // use the users current accesstoken to access spotify = OTHER FUNCTION

  };


  $scope.getUserPlaylists = function(){
    $http.get("https://api.spotify.com/v1/me/playlists",  { headers: { Authorization: "Bearer " + oauth.access_token}}).then(function(response){
      $scope.playlists = response.data.items;
      console.log($scope.playlists);

    });
  }



  //look up refresh token, to see if your current token is valid



}])


//everyone that logs into oauth in my app, will get stored as a user in my own database that people can then add as friends.
