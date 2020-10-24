class Player {
    constructor(_id) {
        this.id = _id;
        this.name = "";
        this.race = 0;
        
        this.sectorId = "";
        this.locationId = "";
        this.rooomId = "";
        this.stationId = "";
        this.sector = null;
        this.location = null;
        this.room = null;
        this.station = null;

        this.passkeys = ["alpha"];
        this.inventory = [];
        this.hiddenInventory = []; // <- for story clues or logs
    }

    addInventory(_item, _amount, _unique){
        if(_unique === true){
            this.removeInventory(_item.id);
        }
        for(let i = 0 ; i < _amount ; i++){
            this.inventory.push(_item);
        }
    }

    removeInventory(_id){
        for(let i = this.inventory.length-1 ; i >= 0 ; i--){
            if(this.inventory[i].id === _id){
                this.inventory.splice(i, 1);
                //TODO probably needs to be more specific liek type or smth, bc a topedo Id could be too little to identify the specific item
            }
        }
    }

    setLocation(_location){
        this.location = _location;
        this.locationId = _location.id;
    }

    setSector(_sector){
        this.sectorId = _sector.name;
        this.sector = _sector;
    }

    setName(_name){
        this.name = _name;
    }

    setRace(_race){
        this.race = _race;
    }
}
module.exports = Player;