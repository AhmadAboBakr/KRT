const Peer = require("./Peer");

class Table {
    /**
     * @type {[Slot]} the socket
     */
    slots;

    /**
     * @type {Peer} the socket
     */

    currentPlayer;
    dice;
    playerBlack;
    playerWhite;
    constructor(socket, serverID, name) {
        this.dice = { dice: [] };
        this.dice.dice[0] = parseInt(Math.random() * 6 + 1);
        this.dice.dice[1] = parseInt(Math.random() * 6 + 1);

        if (this.dice.dice[0] === this.dice.dice[1]) {
            this.dice.dice[3] = this.dice.dice[2] = this.dice.dice[0];
        }
        this.slots = [];
        this.slots[0] = new Slot(2, 2, 15);
        for (let index = 1; index < 23; index++) {
            this.slots[index] = new Slot(0, 0, 0);
        }
        this.slots[23] = new Slot(1, 1, 15);
        this.playerWhite = { playerColor: 1, reserve: new Slot(0, 0, 0), id: 0,type:3 };
        this.playerBlack = { playerColor: 2, reserve: new Slot(0, 0, 0), id: 1,type:3 };
        this.currentPlayer = Math.random() > .5 ? this.playerBlack : this.playerWhite;
    }
}

class Slot {
    baseColor;
    topColor;
    piecesNumber;
    constructor(base, top, number) {
        this.baseColor = base;
        this.topColor = top;
        this.piecesNumber = number;
    }
}

module.exports = Table;