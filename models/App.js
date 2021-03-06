const Room = require('./Room');
const AppError = require('../Errors/AppError')
const sid = require("shortid");

class App {
    /**
     * @type { Room[] } List of rooms the app currently has
    */
    rooms = []; //TODO : Refactor
    privateRooms = [];
    lastId = -1;
    test = sid.generate();
    

    createPrivateRoom() {
        let newRoom = new Room(this);
        var uid = sid.generate();
        uid = uid.toUpperCase();
        newRoom.setId(uid);
        this.privateRooms[uid] = newRoom;
        return newRoom;
    }
    /**
     * Generate a new room
     *
     * @returns Room a new room
     * @throws AppError if we have too many rooms
     */
    generateRoom() {
        //Just in case
        if (this.rooms.length > 1000) {
            throw new AppError({ message: "Too many rooms!" });
        }
        var room = this.createPrivateRoom();
        this.lastId=room.id;
        this.rooms[this.lastId] = room;
        return room;
    }
    /**
     * Retrieves a room by id
     *
     * @param {string} id
     * @returns {Room} the room in question
     * @throws AppError if room does not exist
     */
    getRoomById(id) {
        if (!this.rooms[id]) {
            throw new AppError({ publicMessage: 'Requested room ' + id + ' does not exist!' });
        }
        return this.rooms[id];
    }

    JoinOrCreateRoom() {
        if (this.rooms[this.lastId] && this.rooms[this.lastId].peers.length < this.rooms[this.lastId].maxPeers) {
            return this.rooms[this.lastId];
        }
        else return this.generateRoom();
    }

    GetPrivateRoom(id) {
        return this.privateRooms[id];
    }

    removeRomeByID(id) {
        this.rooms[id] = null;//// Todo make it better
    }
}


module.exports = App;
