// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
    $('form').submit(function(){
        let msg = $('#m').val();
        if (msg.substring(0,6) === "/nick "){
            let newNickName = msg.substring(6, msg.length);
            socket.emit('changeName', {'newName':newNickName, 
                'currentName':$('#username-bar').text()});
        }else{
            socket.emit('chat', msg);
        }
        $('#m').val('');
        return false;
    });
    socket.on('chat', function(msg){
	$('#messages').append($('<li>').text(msg));
    });
    socket.on('setUsername', function(sillyName){
        $('#username-bar').text(sillyName);
    });

    socket.on('chatHistory', function(chatHistory){
        for (let msg of chatHistory){
            $('#messages').append($('<li>').text(msg));
        }
    });
    socket.on('connectedDisconnected', function(onlineUsers){
        $('#users').empty();
        for (let user of onlineUsers){
            $('#users').append($('<li>').text(user));
        }
    });

});
