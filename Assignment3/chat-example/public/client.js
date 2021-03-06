// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
    $('form').submit(function(){
        let msg = $('#m').val();
        if (msg.substring(0,6) === "/nick "){
            let newNickName = msg.substring(6, msg.length);
            socket.emit('changeName', {'newName':newNickName, 
                'currentName':$('#username-bar').text()});
        }else if (msg.substring(0,11) === "/nickcolor "){
            socket.emit('changeColor', msg.substring(11,msg.length));
                
        }else{
            socket.emit('chat', msg);
        }
        $('#m').val('');
        return false;
    });
    socket.on('initialize', function(){
        socket.emit('initialize', document.cookie);
    });
    socket.on('chat', function(msg){
        $('#messages').append($('<li>').html(msg)); 
        //Code retreived from: https://stackoverflow.com/questions/31716529/how-can-i-scroll-down-to-the-last-li-item-in-a-dynamically-added-ul/31716758
        $('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);
    });
    socket.on('setUsername', function(sillyName){
        document.cookie = "name="+sillyName;
        $('#username-bar').text(sillyName);
    });

    socket.on('chatHistory', function(chatHistory){
        for (let msg of chatHistory){
            $('#messages').append($('<li>').html(msg));
        }
    });
    socket.on('connectedDisconnected', function(onlineUsers){
        $('#users').empty();
        for (let user of onlineUsers){
            $('#users').append($('<li>').text(user));
        }
    });
    socket.on('forceDisconnect', function(){
        socket.disconnect();
    });
});
