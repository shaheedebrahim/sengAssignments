var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var generateName = require('sillyname');

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

let onlineUsers = [];
// listen to 'chat' messages
io.on('connection', function(socket){
    var sillyName = generateName();
    onlineUsers.push(sillyName);
    socket.emit('setUsername', sillyName);
    io.emit('connectedDisconnected', onlineUsers); 

    socket.on('chat', function(msg){
        var d = new Date();
        var time = d.getHours() + ":"+d.getMinutes();
        msg = time +  " " + sillyName +" : "+msg;
	io.emit('chat', msg);
    });
    
    socket.on('disconnect', function(){
        var index = onlineUsers.indexOf(sillyName);
        console.log(onlineUsers);
        onlineUsers.splice(index, 1);
        io.emit('connectedDisconnected', onlineUsers);
        console.log(onlineUsers);
    });
});
