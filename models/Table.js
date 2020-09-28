const Peer = require("./Peer");

class Table {
    dice;

    /**
     * @type {[Slot]} the socket
     */
    slots;
    playerTurn;
    /**
     * @type {Peer} the socket
     */
    blackReserveSlot=new Slot(0,0,0);
    whiteReserveSlot=new Slot(0,0,0);

    constructor(socket, serverID, name) {
        this.dice = { dice: [] };
        this.dice.GetString = function () {
            var str = '{"dice":[';
            for (let index = 0; index < this.dice.length; index++) {
                str += this.dice[index];
                if (index < this.dice.length - 1) {
                    str += ",";
                }
            }
            str += "]}";
            return str;
        }
        this.GenerateDice();
        this.slots = [];
        this.slots[0] = new Slot(2, 2, 15);
        for (let index = 1; index < 23; index++) {
            this.slots[index] = new Slot(0, 0, 0);
        }
        this.slots[23] = new Slot(1, 1, 15);
        this.blackReserveSlot= new Slot(0, 0, 0);
        this.whiteReserveSlot= new Slot(0, 0, 0);
        this.playerTurn = Math.random() > .5 ? this.playerBlack : this.playerWhite;
    }

    Move(source, dest,dice) {
        
        var piece = this.slots[source];
        this.slots[source].RemoveToken();
        if(dest <= 23&& dest >= 0){
            this.slots[dest].AddToken(this.slots[source].topColor);
        }    
        else{
            if(piece.topColor==1){
                this.whiteReserveSlot.AddToken(topColor);
            }
            else if(piece.topColor==2){
                this.blackReserveSlot.AddToken(topColor);

            }
            else{
                /// DO something to update the tables to everyone that ever exsisted and return
                throw "something";
            }
        }
        
        for (let i = 0; i < dice.dice.length; i++) {
            var index =this.dice.dice.indexOf(dice.dice[i]);
            this.dice.dice.splice(index,1);
        }     
    }
    Undo(source, dest,dice) {
        this.slots[dest].AddToken(this.slots[source].topColor);
        this.slots[source].RemoveToken();
        for (let i = 0; i < dice.dice.length; i++) {    
            this.dice.dice.push(dice.dice[i]);
        }
     
    }
    GenerateDice() {
        this.dice.dice = [];
        this.dice.dice[0] = parseInt(Math.random() * 6 + 1);
        this.dice.dice[1] = parseInt(Math.random() * 6 + 1);
        if (this.dice.dice[0] === this.dice.dice[1]) {
            this.dice.dice[3] = this.dice.dice[2] = this.dice.dice[0];
        }
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
    AddToken(color) {
        if (this.piecesNumber == 0) {
            this.baseColor = color;
        }
        this.topColor = color;
        this.piecesNumber++;
    }
    RemoveToken() {
        if (this.piecesNumber == 0)
            return;
        if (this.piecesNumber == 1) {
            this.topColor = this.baseColor = 0;
        }
        if (this.piecesNumber == 2) {
            this.topColor = this.baseColor;
        }
        this.piecesNumber--;
    }
}

module.exports = Table;