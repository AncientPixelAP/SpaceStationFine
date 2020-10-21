class Station{
    constructor(_type, _name, _short, _passkeys) {
        this.roomId = "";
        this.name = _name; //arbitrary name
        this.short = _short; //arbitrary short hand for map screen
        this.type = _type; //eg Astronometry, Navigation, 
        this.passkeys = _passkeys; //array of keys valid for use
        this.power = 1;
        this.hp = 1;
        this.inventory = [];
        //this.players = [];
    }

    update(){

    }

    /*addPlayers(_players){
        for(let p of _players){
            this.players.push(p);
            p.station = this;
            p.room = this.room;
            p.location = this.room.location;
        }
    }

    removePlayers(_players){
        for(let i = this.players.length -1 ; i >= 0 ; i--){
            for(let p of _players){
                if(p.id === this.players[i].id){
                    this.players.splice(i, 1);
                }
            }
        }
    }*/
}
module.exports = Station;