console.log("Scripts loading...");



$(document).ready(function(){

  $(".add-playlists").on("click", function(){
    $('.ui.modal').modal('show');
  })

  // $('.ui.search').search({
  //   apiSettings: {
  //     url: 'https://api.spotify.com/v1/search?q='
  //   },
  //   fields: {
  //     results : 'items',
  //     title   : 'name',
  //     url     : 'html_url'
  //   },
  //   minCharacters : 3
  // });

})
