const Table = require("./Table");

class Tawla{
   /**
     * @type { Table } Maximum number of peers the room should have
     */
    table;
    constructor(tableData){
        this.table=tableData;
    }
    Apply(id,data){
        switch (id) {
            case 2://onMove
                this.table.Move(data.source, data.target,JSON.parse(data.dice));
                break;
            case 4://on end  
                this.table.currentPlayer = (this.table.currentPlayer.playerColor == this.table.playerWhite.playerColor)?this.table.playerBlack:this.table.playerWhite;
                this.table.GenerateDice();
                data={};
                data.color=this.table.currentPlayer.playerColor;
                data.dice=( this.table.dice.GetString());
                break;
            case 3://undo
                this.table.Undo(data.target, data.source,JSON.parse(data.dice));
                break;
        };
        return JSON.stringify(data);
    }
}

module.exports = Tawla;
