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

let chatHistory = [];
let onlineUsers = [];
// listen to 'chat' messages
io.on('connection', function(socket){
    var sillyName = generateName();
    var color = "black"
    while (onlineUsers.indexOf(sillyName) !== -1){
        console.log(onlineUsers.indexOf(sillyName));
        sillyName = generateName();
    }
    onlineUsers.push(sillyName);
    socket.emit('setUsername', sillyName);
    socket.emit('chatHistory', chatHistory);
    io.emit('connectedDisconnected', onlineUsers); 

    socket.on('changeColor', function(newColor){
        color = newColor;
        socket.emit('chat', "Color succesfully changed");
    });
    socket.on('changeName', function(list){
        let newName = list['newName'];
        if (onlineUsers.indexOf(newName) !== -1){
            socket.emit('chat', "Error name already taken");
        }
        else {
            let currentName = list['currentName'];
            let indexCurrent = onlineUsers.indexOf(currentName);
            console.log(onlineUsers);
            console.log(currentName);
            if (indexCurrent === -1){
                socket.emit('chat', "Error occured");
            }else{
                onlineUsers.splice(indexCurrent, 1);
                socket.emit('setUsername', newName);
                onlineUsers.push(newName);
                sillyName = newName;
                io.emit('connectedDisconnected', onlineUsers);
                socket.emit('chat', "Username successfully changed");
            }
        }
    });
    socket.on('chat', function(msg){
        var d = new Date();
        var time = d.getHours() + ":"+d.getMinutes();
        msg = time +  " " + "<span style='color:"+color+"'>"+sillyName+"</span>" +" : "+msg;
        chatHistory.push(msg);
	socket.broadcast.emit('chat', msg);
        msg = "<b>"+msg+"</b>";
        socket.emit('chat', msg);
    });
    
    socket.on('disconnect', function(){
        var index = onlineUsers.indexOf(sillyName);
        console.log(onlineUsers);
        onlineUsers.splice(index, 1);
        io.emit('connectedDisconnected', onlineUsers);
    });
});
