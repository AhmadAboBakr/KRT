const Table = require("./Table");

class Tawla {
    /**
      * @type { Table } Maximum number of peers the room should have
      */
    table;
    constructor(tableData) {
        this.table = tableData;
    }
    Apply(id, data) {
        switch (id) {
            case 2://onMove
                this.table.Move(data.source, data.target, JSON.parse(data.dice));
                break;
            case 4://on end  turn
                console.log("it was the turn of " + this.table.playerTurn);
                this.table.playerTurn = (this.table.playerTurn + 1) % 2;
                console.log("but is now the age of " + this.table.playerTurn);
                var isAI = data.isAI;

                this.table.GenerateDice();
                data = {};
                if (isAI) {
                    data.isAI = isAI;
                }
                data.playerTurn = this.table.playerTurn;
                data.dice = (this.table.dice.GetString());
                break;
            case 3://undo
                this.table.Undo(data.target, data.source, JSON.parse(data.dice));
                break;
            case 6:// new Round
                this.table = new Table();
                this.table.roundData = JSON.parse(data.roundData);
                this.table.playerTurn = (this.table.started == 0) ? 1 : 0;
                data.table = this.table;
                break;
        };
        return JSON.stringify(data);
    }
}

module.exports = Tawla;
