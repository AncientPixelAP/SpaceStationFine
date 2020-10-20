class NPC {
    constructor(_name, _file, _sectorId, _locationId, _roomId, _stationId) {
        this.name = _name;
        this.race = 0;
        
        this.sectorId = _sectorId;
        this.locationId = _locationId;
        this.rooomId = _roomId;
        this.stationId = _stationId;
        this.sector = null;
        this.location = null;
        this.room = null;
        this.station = null;

        this.conversation = {
            file: _file,
            treePosition: 0,
            speakingTo: {
                name: null,
                id: null
            }
        }

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

    setName(_name){
        this.name = _name;
    }

    setRace(_race){
        this.race = _race;
    }
}
module.exports = NPC;