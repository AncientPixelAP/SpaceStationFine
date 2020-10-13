class Location {
    constructor(_id, _type, _passkeys, _stations, _sector, _coords) {
        this.id = _id;
        this.type = _type;
        this.passkeys = _passkeys;
        this.sector = _sector;
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

        this.stations = [];
        for(let s of _stations){
            this.stations.push({
                name: s.name,
                short: s.short,
                type: s.type,
                power: 1,
                inventory: [],
                passkey: ["alpha"]
            });
        }

        this.shields = {
            up: false,
            power: 1,
            energy: -1,
            type: 0,
            health: 100
        }
    }

    update(){
        this.coords.x += Math.cos(this.heading) * this.spd;
        if(this.coords.x < -1){this.coords.x += 2};
        if (this.coords.x > 1) { this.coords.x -= 2 };
        this.coords.y += Math.sin(this.heading) * this.spd;
        if (this.coords.y < -1) { this.coords.y += 2 };
        if (this.coords.y > 1) { this.coords.y -= 2 };
    }
}
module.exports = Location;