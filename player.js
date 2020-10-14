class Player {
    constructor(_id) {
        this.id = _id;
        
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
    }

    setLocation(_location){
        this.location = _location;
        this.locationId = _location.id;
    }

    setSector(_sector){
        this.sectorId = _sector.name;
        this.sector = _sector;
    }
}
module.exports = Player;