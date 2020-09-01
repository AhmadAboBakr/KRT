'use strict';
const express = require('express');
const Peer = require("./models/Peer");
const app = require("./models/App");
var io = require("socket.io")(3150);

const expressApp = express();

app.generateRoom(); //for testing


let routes = require('./routes');
expressApp.use(routes);
expressApp.listen(3500)


io.on("connection", (socket) => {
    var room;
    try {
        room = app.getRoomById(parseInt(socket.handshake.query.room));
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
        console.log('error! ', error.message);
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
