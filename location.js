class Location {
    constructor(_id, _type, _coords, _blueprint, _relation) {
        this.sectorCoords = {
            x: 0,
            y: 0,
            z: 0
        }
        this.sectorId = "";
        this.id = _id;
        this.type = _type;
        this.coords = _coords;
        
        this.spd = 0;
        this.warping = false,
        this.impulseFactor = 0;
        this.heading = Math.PI * -0.5;
        this.headingCoords = {
            x: 0,
            y: 0,
            z: 0
        }
        this.blueprint = _blueprint;

        this.shields = {
            up: false,
            /*power: 1,
            energy: -1,
            type: 0,
            health: 100*/
        }

        this.rooms = [];

        this.isDocked = false;
        this.dockingPortsMax = 0;
        this.dockedAt = "";
        this.dockingPorts = [];
        this.dockingRange = 0.1;
        this.hangarRange = 0.1;

        this.relation = _relation;
    }

    update(){
        this.coords.x += Math.cos(this.heading) * this.spd;
        if(this.coords.x < -1){this.coords.x += 2};
        if (this.coords.x > 1) { this.coords.x -= 2 };
        this.coords.y += Math.sin(this.heading) * this.spd;
        if (this.coords.y < -1) { this.coords.y += 2 };
        if (this.coords.y > 1) { this.coords.y -= 2 };

        for(let r of this.rooms){
            r.update();
        }
    }

    dockAt(_location){
        _location.dockingPorts.push(this);
        this.isDocked = true;
        this.dockedAt = _location.id;
    }

    undockFrom(_location){
        for (let i = _location.dockingPorts.length - 1; i >= 0; i--) {
            if (_location.dockingPorts[i].id === this.id) {
                this.isDocked = false;
                this.dockedAt = "";
                _location.dockingPorts.splice(i, 1);
            }
        }
    }

    land(_location){

    }

    takeOff(_location){

    }

    addRooms(_rooms){
        for(let r of _rooms){
            r.locationId = this.id;
            this.rooms.push(r);
        }
    }

    removeRooms(_rooms){
        for(let i = this.rooms.length -1 ; i >= 0 ; i--){
            for(let r of _rooms){
                if(r.id === this.rooms[i].id){
                    this.rooms.splice(i, 1);
                }
            }
        }
    }

    setSector(_sector){
        this.sector = _sector;
    }
}
module.exports = Location;