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