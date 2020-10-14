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

    }

    setName(_name){
        this.name = _name;
    }

    addLocation(_location){
        this.locations.push(_location);
        _location.sector = this;
    }

    removeLocationById(_location){
        for(let i = this.locations.length-1 ; i >= 0 ; i--){
            if(this.locations[i] === _location){
                this.locations.splice(i, 1);
            }
        }
    }
}