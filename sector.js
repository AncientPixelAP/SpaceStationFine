class Sector{
    constructor(_x, _y, _z){
        this.pos = {
            x: _x,
            y: _y,
            z: _z
        }
        this.name = String(this.pos.x)+","+String(this.pos.y)+","+String(this.pos.z);

        this.locations = [];
    }

    update(){
        for(let l of this.locations){
            l.update();
        }
    }

    setName(_name){
        this.name = _name;
    }

    addLocations(_locations){
        for(let l of _locations){
            l.sectorCoords = {
                x: this.pos.x,
                y: this.pos.y,
                z: this.pos.z
            };
            l.sectorId = this.name;
            this.locations.push(l);
        }
    }

    removeLocations(_locations){
        for(let i = this.locations.length-1 ; i >= 0 ; i--){
            for(let l of _locations){
                if(this.locations[i].id === l.id){
                    this.locations.splice(i, 1);
                }
            }
        }
    }

    
}
module.exports = Sector;