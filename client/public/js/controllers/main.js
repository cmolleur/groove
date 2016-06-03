var app = angular.module("GrooveApp", [])
var redirectURI = "https://groovemusic.herokuapp.com/"
// var redirectURI = "http://localhost:8080/"

app.controller("OAuthController", ["$scope", "$http", "$window", function($scope, $http, $window){

  $scope.redirect = function(){
    console.log("redirecting")
    $window.location.href = 'https://accounts.spotify.com/authorize/?client_id=6df5a5da139441d2842b4483b6370c13&show_dialog=true&response_type=token&redirect_uri=' +  redirectURI + 'user-profile&state=spotify_authorization_redirect&scope=user-read-email%20playlist-read-private%20playlist-read-collaborative%20playlist-modify'
  }

  $scope.isTokenValid = function(response){
    if (response.status === 401) {
      Cookies.remove("spotify_token");
      $scope.redirect();
    }
  }

  $scope.getUserInfo = function(){
    //get users info, including the access_token
    var callbackResponse = (document.URL).split("#")[1];
    var responseParameters = callbackResponse ? callbackResponse.split("&") : [];
    params = {}
    // oauth;

    responseParameters.forEach( function(pair){
      parameters = pair.split("=");
      params[ parameters[0] ] = parameters[1];
    })

    console.log(Cookies.get("spotify_token"), params.access_token);


    if( Cookies.get("spotify_token") && Cookies.get("spotify_token") !== "undefined"  ){
      oauth = {access_token: Cookies.get("spotify_token")};
      // oauth = {}
      // oauth.access_token =  params.access_token || Cookies.get("spotify_token");
      // Cookies.set("spotify_token", oauth.access_token);


      // Cookies.set("spotify_token", oauth.access_token);
        // consider adding the expires in and starting a timer
      // console.log("oauth: ", oauth);
    } else if (params.access_token){
      oauth = {access_token: params.access_token};
      Cookies.set("spotify_token", oauth.access_token);
        // consider adding the expires in and starting a timer
      // console.log("oauth: ", oauth);
    }else {
      // console.log("Problem Authenticating!");
      $scope.redirect();
    }

    // remove ugly hash parameters
    $window.location.hash = '';


    // console.log( "params: ", params )
    // alert(oauth.access_token)

    $http.get("https://api.spotify.com/v1/me/", { headers: { Authorization: "Bearer " + oauth.access_token} }).then(function(response){
      console.log("Response ", response);

      // $scope.getUser( response.data.email ).then( function(response){
      //   if(response.error){
      //     $scope.saveUser({ name: response.data.display_name,
      //                       email: response.data.email
      //                    })
      //   } else {
      //     $scope.getFriends();
      //   }
      //   $scope.getFriends()
      //
      // });
      $scope.userId = response.data.id;
      $scope.user = response.data.display_name ? response.data.display_name.split(" ")[0] : $scope.userId;
      Cookies.set("userFirstName", $scope.user);
      Cookies.set("userID", $scope.userId);
      $scope.getUserPlaylists();
    }, $scope.isTokenValid);

    // maybe check if token's valid - OTHER FUNCTION

    // use the users current accesstoken to access spotify = OTHER FUNCTION

  };




  $scope.getUserPlaylists = function(){
    $http.get("https://api.spotify.com/v1/me/playlists",  { headers: { Authorization: "Bearer " + oauth.access_token}}).then(function(response){
      $scope.playlists = response.data.items;
      console.log("Playlists: ", $scope.playlists);
      for (var i = 0; i < $scope.playlists.length; i++) {
        if(!$scope.playlists[i].images.length) {
          $scope.playlists[i].images[0] = {"url": "./images/album-default.jpg"};
        }
      $scope.playlistOwner = $scope.playlists[i].owner.id;
      Cookies.set("ownerId", $scope.playlistOwner)  
      }
    }, $scope.isTokenValid);
  }


  $scope.createPlaylist = function(playlistTitle, albumArt){
    $http({
      method: 'POST',
      url: "https://api.spotify.com/v1/users/" + $scope.userId + "/playlists",
      data: JSON.stringify({
        "name": playlistTitle,
        "public": true
      }),
      headers: { "Authorization": "Bearer " + oauth.access_token, "Content-Type": "application/json" }
    }).then(function(response){
      $scope.getUserPlaylists();
    }, $scope.isTokenValid);
  }

  $scope.getPlaylistInfo = function(){
    //when you change this app to one-page, you can add $scope.userId instead of Cookies.get... etc.
    // https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}
    $http.get("https://api.spotify.com/v1/users/" + Cookies.get("ownerId") + "/playlists/" + document.URL.split("/").pop(),  { headers: { Authorization: "Bearer " + Cookies.get("spotify_token")}}).then(function(response){
        console.log("This Playlist Info: ", response);
        $scope.firstName = Cookies.get("userFirstName");
        $scope.playlist = response.data;
        $scope.followers = response.data.followers.total;
        $scope.tracks = response.data.tracks.items;
        for (var i = 0; i < $scope.tracks.length; i++) {
          $scope.artists = $scope.tracks[i].track.artists;
        }
    }, $scope.isTokenValid);
  }

  $scope.searchSongs = function(search){
    $http.get("https://api.spotify.com/v1/search?q="+ search + "&type=track&limit=10&type=artist&limit=10").then(function(response){
      console.log(response);
      $scope.trackUri = [];
      $scope.searchResults = response.data.tracks.items;
      for (var i = 0; i < $scope.searchResults.length; i++) {
        $scope.trackUri.push($scope.searchResults[i].uri) ;
      }
    })
  }

  $scope.searchPlaylists = function(playlist){
    $http.get("https://api.spotify.com/v1/search?q="+ playlist + "&type=playlist&limit=10").then(function(response){
      $scope.allSearchedPlaylists = response.data.playlists.items;
      console.log($scope.allSearchedPlaylists);
      for (var i = 0; i < $scope.allSearchedPlaylists.length; i++) {
        $scope.followplaylistId = $scope.allSearchedPlaylists[i].id
        $scope.playlistOwnerId = $scope.allSearchedPlaylists[i].owner.id;
      }
      if (response == 0) {
        alert("No such playlist, search again")
      }
    })
  }

  $scope.addTrack = function($index){
    $http({
      method: 'POST',
      url: "https://api.spotify.com/v1/users/" + Cookies.get("ownerId") + "/playlists/" + document.URL.split("/").pop() + "/tracks",
      data: JSON.stringify({
        "uris": [$scope.trackUri[$index]]
      }),
      headers: { "Authorization": "Bearer " + Cookies.get("spotify_token"), "Content-Type": "application/json" }
    }).then(function(response){
      $scope.getPlaylistInfo();
    }, $scope.isTokenValid)
  }

  $scope.followPlaylist = function(){
    // PUT https://api.spotify.com/v1/users/{owner_id}/playlists/{playlist_id}/followers
    $http({
      method: 'PUT',
      url: "https://api.spotify.com/v1/users/" + $scope.playlistOwnerId + "/playlists/" + $scope.followplaylistId + "/followers",
      headers: { "Authorization": "Bearer " + Cookies.get("spotify_token"), "Content-Type": "application/json" }
    }).then(function(response){
      console.log("Successfully followed!");
    }, $scope.isTokenValid)
  }


  //look up refresh token, to see if your current token is valid

  $scope.getUser = function(email){
    //consider taking advantage of the jwt protection
    // $http.get("/myself/" + email);
  }

  $scope.saveUser = function(userData){
    // //consider taking advantage of the jwt protection
    // $http.post("/users")
    //      .then(function(response){
    //
    //      })
  }

  $scope.getFriends = function(){} // gets your friends from Mongo

  $scope.updateUser = function(){} // update users

  $scope.addFriend = function(){} // add a friend to a user
  //ajax put route




}]) // controller


//everyone that logs into oauth in my app, will get stored as a user in my own database that people can then add as friends.
