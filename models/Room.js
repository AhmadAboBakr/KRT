const { json } = require("express");
const Peer = require("./Peer");
const Table = require("./Table");
const Tawla = require("./Tawla");

class Room {
    /**
     * @type { Number } the room identifier
     */
    id;
    /**
     * @type { Peer[] } connected peers
    */
    peers = [];

    /**
     * @type { Number } Maximum number of peers the room should have
     */
    maxPeers = 2;
    variables = [];
    /**
     * @type { Table } Maximum number of peers the room should have
     */
    tableData;
    #currentPlayers = 0;
    #hashedPeers = [];
    #app;
    constructor(app) {
        this.#app = app;
        this.tableData = new Table();
    }

    /**
     * Sets the room id
     *
     * @param {Number} id
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Sets max number of peers
     *
     * @param {Number} maxPeers
     */
    setMaxPeers(maxPeers) {
        this.maxPeers = maxPeers;
        this.availableSeats = new Array(maxPeers);
        for (let i = 0; i < this.availableSeats.length; i++) {
            this.availableSeats[i] = i + 1;
        }
    }
    /**
     *
     * @param {Peer} peer the peer to add to the room
     * @returns {Number} the new peer ID
     * @throws AppError if maxPeers is reached
     */
    AddPeer(peer) {
        var hash = peer.serverID;
        if (this.#hashedPeers[hash]) {
            peer.id = this.#hashedPeers[hash].id;
            console.log("old peer with id: ", peer.id + "in room :" + this.id);

        }
        else if (this.peers.length >= this.maxPeers) {
            throw new AppError({ publicMessage: 'Can not add peer, max peers is reached!' });
        }
        else {
            peer.id = this.#currentPlayers++;
            console.log("new peer with id: ", peer.id + "in room :" + this.id);

        }
        this.#hashedPeers[hash] = peer;
        this.RegisterPeerMessages(peer);
        this.peers.push(peer);
        this.SendInitMessages(peer);
        return peer.id;
    }
    SendInitMessages(peer) {
        peer.sendRawMessage("init",  this.id);

        peer.sendMessage("1", JSON.stringify({ data: JSON.stringify(this.tableData), roundData: JSON.stringify(this.tableData.roundData) }), peer.id);
        console.log(this.peers.length);
        if (this.peers.length >= this.maxPeers) {
            this.BroadcastMessage("0", JSON.stringify({ roundData: JSON.stringify(this.tableData.roundData),peers:JSON.stringify(this.peers) }), -1);
            this.#app.generateRoom(); //Todo Diffrentiate room types
        }
    }
    /**
     *
     * 
     * @param {SocketIO.Socket} socket the socket used by the peer to Remove
     */
    RemovePeerBySocket(socket) {
        var index = this.peers.findIndex(peer => peer.socket === socket);
        if (index >= 0) {
            var seat = this.peers[index].id;
            this.peers.splice(index, 1);
            this.BroadcastMessage("remove", {}, seat);
            console.log("removed player number " + index + ":" + seat);
        }
        if (this.peers.length == 0) {
            //// Delete Room from list
            ///// this requires a ton shit of work fuck it for now but please fix later
            //this.#app.removeRomeByID(this.id);
        }
        else {
            throw new AppError({ publicMessage: 'Can not remove peer' });
        }
    }
    /**
     *
     * @param {any} id the peer ID
     * @returns {Peer}  the selected Peer
     */
    GetPeerById(id) {
        for (var i = 0; i < this.peers.length; i++) {
            if (this.peers[i].id === id) {
                return this.peers[i];
            }
        }
        return undefined;
    }

    /**
    * @param {string} name The message name
     * @param {string} data the message data
     * @param {Number} sender the Sender
     */
    BroadcastMessage(name, data, sender) {
        for (var i = 0; i < this.peers.length; i++) {
            //if (sender != this.peers[i].id) 
            {
                try {
                    this.peers[i].sendMessage(name, data, sender);
                }
                catch (ex) {
                    console.log(ex);
                }
            }
        }
    }

    RegisterPeerMessages(peer) {
        peer.socket.on("RTMessage", (msg) => {
            var data = {};
            if (msg.data) {
                data = JSON.parse(msg.data);
            }
            var tawla = new Tawla(this.tableData);
            msg.data = tawla.Apply(msg.name, data);
            this.BroadcastMessage(msg.name, msg.data, msg.senderID);
        });
        peer.socket.on("setVariable", (data) => {
            this.BroadcastMessage("variableSet", data, -2);
            this.variables[data.name] = data.value;
        });
    }
}

module.exports = Room;
