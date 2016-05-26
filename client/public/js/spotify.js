// we are going to implement the implicit grant flow

// 1. we need our spotify client_id: 9074e9602d034625aa6585d86a9de25d

// 2. we need to redirect to this end-point:
// https://accounts.spotify.com/authorize

// 3. when the user is redirected BACK to our page, our client doesn't know if this is a redirection from spotify or just my browser asking for my main page. We can look for the hash fragment containing the access_token and also the state to decide.

// 4. if there is an access_token in the haash fragment, we are going to save the acess_token in a cookie.

//5. we will proceed to get the user's playlists.

// *************************
// Utility Functions
// *************************

// 1. Check if logged in:
//   a. this function will check if there is a valid token.
//      If there is one, it will hide the login button and show a logout

//   b. it will make the ajax call to get the playlists if logged in
