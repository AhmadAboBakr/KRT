const { json } = require("express");

class Peer {
    /**
     * @type {SocketIO.Socket} the socket
     */
    #socket;

    /**
     * @type {Number} id the ID of the user, used in communication
     */
    id;
    isHost=false;

    /**
     *
     * @param {SocketIO.Socket} socket The socket
     * @param {String} serverID OVRID
     * @param {string} name the user name
     */
    constructor(socket, serverID, name) {
        this.name = name ;
        this.serverID = serverID ;
        this.#socket = socket;
    }

    /**
     * Sets the peer id
     *
     * @param {Number} id the ID to set
     */
    setId(id) {
        this.id = id;
     }

    get socket() {
        return this.#socket;
    }
    /**
     *
     * @param {any} message message name
     * @param {any} body message body
     * @param {Number} id userID
     */
    sendMessage(message, body, id,shouldStringfy=false) {
        if(shouldStringfy){
            body=JSON.stringify(body);
        }
        var b = {
            "name": message,
            "data": body,
            "senderID": id
        };
        this.#socket.emit("RTMessage", b);
        console.log(">>"+JSON.stringify(b));
    }
}

module.exports = Peer;
