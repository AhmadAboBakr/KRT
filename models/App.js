const Room = require('./Room');
const AppError = require('../Errors/AppError')

class App {

    static instance;

    App() {
        if (instance) {
            return instance;
        }
        this.instance = this;
    }

    /**
     * @type { Room[] } List of rooms the app currently has
    */
    rooms = [];
    lastId=-1;
    /**
     * Generate a new room
     *
     * @returns Room a new room
     * @throws AppError if we have too many rooms
     */
    generateRoom() {
        //Just in case
        if(this.rooms.length > 1000) throw new AppError({message: "Too many rooms!"})
        let newRoom = new Room();
        this.lastId++;
        newRoom.setId(this.lastId);
        this.rooms[this.lastId]=newRoom;
        return newRoom;
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
            throw new AppError({ publicMessage: 'Requested room ' + id + ' does not exist!'});
        }
        return this.rooms[id];
    }
    
    JoinOrCreateRoom(){
        if(this.rooms[this.lastId] && this.rooms[this.lastId].peers.length<this.rooms[this.lastId].maxPeers){
            return this.rooms[this.lastId];
        }
        else return this.generateRoom();
    }


    removeRomeByID(id){
        this.rooms[id]=undefined;
    }
}


const instance = new App();
Object.seal(instance);

module.exports = instance;
