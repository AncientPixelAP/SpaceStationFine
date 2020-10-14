class Room{
    constructor(_name){
        this.locationId = "";
        this.name = _name;
        this.stations = [];
    }

    update(){

    }

    addStations(_stations){
        for(let s of _stations){
            s.roomId = this.name;
            this.stations.push(s);
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
}
module.exports = Room;