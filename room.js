class Room{
    constructor(_location, _name){
        this.location = _location;
        this.name = _name;
        this.stations = [];
        this.players = [];
    }

    update(){

    }

    addStation(_stations){
        for(let s of _stations){
            this.stations.push(s);
            s.room = this;
        }
    }

    removeStations(_stations){
        for(let i = this.stations.length -1 ; i >= 0 ; i--){
            for(let s of _stations){
                if(s.id === this.stations[i].id){
                    this.stations.splice(i, 1);
                }
            }
        }
    }

    addPlayers(_players){
        for(let p of _players){
            this.players.push(p);
            p.room = this;
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
    }
}
module.exports = Room;