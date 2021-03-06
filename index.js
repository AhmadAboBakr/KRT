'use strict';
const Peer = require("./models/Peer");
const App= require("./models/App");
const GameModes = [new App(),new App()];
var io = require("socket.io")(3150);
let routes = require('./routes');
io.on("connection", (socket) => {
    var room;
    try {
        setInterval(() => {
            socket.emit("ping");
        }, 5000);
        var appId=socket.handshake.query.mode || 0;
        var app= GameModes[appId];
        if(socket.handshake.query.isPrivate== 'True'){
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
                room = app.getRoomById(socket.handshake.query.room);
                console.log("someone is rejoining");
            }
        }
        var peer = new Peer(socket, String(socket.handshake.query.id), String(socket.handshake.query.userName));
        if (!room) {
            peer.sendMessage('10', '{"error":"Invalid request!"}');
            return;
        }
        try {
            peer.setId(room.AddPeer(peer));
            peer.sendMessage('11', {message:"Joined"});

        }
        catch (error) {
            peer.sendMessage('10', {message:'"error":"roomfull"}'});
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
