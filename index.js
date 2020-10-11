'use strict';
const express = require('express');
const Peer = require("./models/Peer");
const app = require("./models/App");
var io = require("socket.io")(3150);

const expressApp = express();



let routes = require('./routes');
expressApp.use(routes);
expressApp.listen(3500);


io.on("connection", (socket) => {
    var room;
    try {
        setInterval(() => {
            socket.emit("ping");
        }, 5000);
        if(socket.handshake.query.isPrivate== true){
            if(socket.handshake.query.room==undefined){
                room =app.createPrivateRoom();
            }
            else{
                
                room=app.GetPrivateRoom(socket.handshake.query.room);

            }
        }
        else{
            if(socket.handshake.query.room == undefined){
                console.log("someone wants a new match")
                room=app.JoinOrCreateRoom();
    
            }
            else{
                room = app.getRoomById(parseInt(socket.handshake.query.room));
                console.log("someone is rejoining");
            }
    
        }
        var peer = new Peer(socket, String(socket.handshake.query.id), String(socket.handshake.query.userName));
        if (!room) {
            peer.sendMessage('error', 'Invalid request!');
            return;
        }
        try {
            peer.setId(room.AddPeer(peer));
        }
        catch (error) {
            peer.sendMessage('error', {message:"roomfull"});
            console.log(error.message);
        }
    }
    catch (error) {
        console.log('error! ', error);
    }

    socket.on("disconnect", () => {
        try {
            room.RemovePeerBySocket(socket);
        }
        catch (error) {
            console.log(error.message);
        }
    });
});
