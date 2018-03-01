// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
    $('form').submit(function(){
	socket.emit('chat', $('#m').val());
	$('#m').val('');
	return false;
    });
    socket.on('chat', function(msg){
	$('#messages').append($('<li>').text(msg));
    });
    socket.on('setUsername', function(sillyName){
        $('#username-bar').text(sillyName);
    });

    socket.on('connectedDisconnected', function(onlineUsers){
        $('#users').empty();
        for (let user of onlineUsers){
            $('#users').append($('<li>').text(user));
        }
    });

});
