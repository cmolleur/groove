console.log("Scripts loading...");

$(document).ready(function(){



  var socket = io();
  $('#chat-form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    // var firstName = Cookies.get("userFirstName");
    if (true) {

    }
    // $('#messages').append($('<li>').text(firstName + ": " + msg));
    $('#messages').append($('<li>').text(msg));
    var d = $('.chatbox');
    d.scrollTop(d.prop("scrollHeight"));
  });


})
