let Player = require("./player");
let Location = require("./location");
const Sector = require("./sector");
const Station = require("./station");
const Room = require("./room");

const ELOCATION = {
    ship: "ship",
    shuttle: "shuttle",
    evSuit: "EV-Suit",
    station: "station",
    asteroid: "asteroid",
    planet: "planet",
    moon: "moon",
    nebula: "nebula",
    resonanceTraces: "resonanceTraces"
}

const ESTATION = {
    astronometry: "astronometry",
    navigation: "navigation",
    communications: "communications",
    weapons: "weapons",
    engineering: "engineering",
    transporter: "transporter",
    storage: "storage",
    hangar: "hangar",
    bar: "bar",
    shop: "shop",
    map: "map",
    sickbay: "sickbay",
    medical: "medical",
    holodeck: "holodeck",
    science: "science"
}

class GameData{
    constructor(){
        this.players = [];
        this.sectors = [];

        let spawnSector, spawnLocation, spawnRoom;
        spawnSector = this.createSector(192, 168, 0);
        spawnSector.setName("Home");
        this.sectors.push(spawnSector);
        //create Enterprise
        spawnLocation = this.createLocation("Enterprise", ELOCATION.ship, {x: 0.25,y: 0.6,z: 0.5}, "sprBlueprintShipGalaxyClass");
        spawnSector.addLocations([spawnLocation]);
        spawnRoom = this.createRoom("Bridge");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Turbolift", "MAP", ["alpha"]),
            this.createStation(ESTATION.astronometry, "Astrometrics", "AST", ["alpha"]),
            this.createStation(ESTATION.navigation, "Navigation", "NAV", ["alpha"]),
            this.createStation(ESTATION.weapons, "Weapons", "WPN", ["alpha"]),
            this.createStation(ESTATION.communications, "Communications", "COM", ["alpha"]),
            this.createStation(ESTATION.science, "Science", "SCI", ["alpha"]),
        ]);
        spawnRoom = this.createRoom("Conference Room");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Turbolift", "MAP", ["alpha"]),
        ]);
        spawnRoom = this.createRoom("Deck B");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Turbolift", "MAP", ["alpha"]),
            this.createStation(ESTATION.bar, "Be Front", "FWD", ["alpha"]),
            this.createStation(ESTATION.holodeck, "HoloDeck", "HOL", ["alpha"]),
            this.createStation(ESTATION.sickbay, "Sickbay", "MED", ["alpha"]),
        ]);
        spawnRoom = this.createRoom("Deck E");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Turbolift", "MAP", ["alpha"]),
            this.createStation(ESTATION.engineering, "Engineering", "ENG", ["alpha"]),
            this.createStation(ESTATION.transporter, "Transporter Room", "TRS", ["alpha"]),
            this.createStation(ESTATION.storage, "Storage Room", "STG", ["alpha"]),
            this.createStation(ESTATION.hangar, "Hangar", "HNG", ["alpha"])
        ]);

        //create Deep Space Nine
        spawnLocation = this.createLocation("Deep Space Fine", ELOCATION.station, { x: 0.25, y: 0.5, z: 0.5 }, "sprBlueprintStationDeepStation");
        spawnSector.addLocations([spawnLocation]);
        spawnRoom = this.createRoom("OPS");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Turbolift", "MAP", ["alpha"]),
            this.createStation(ESTATION.astronometry, "Astrometrics", "AST", ["dsfine"]),
            this.createStation(ESTATION.communications, "Communications", "COM", ["dsfine"]),
            this.createStation(ESTATION.transporter, "Transporter Room", "TRS", ["dsfine"]),
        ]);
        spawnRoom = this.createRoom("Promenade");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Turbolift", "MAP", ["alpha"]),
            this.createStation(ESTATION.bar, "Quirks", "BAR", ["alpha"]),
            this.createStation(ESTATION.shop, "Derrek", "SHP", ["alpha"]),
            this.createStation(ESTATION.transporter, "Transporter Room", "TRS", ["dsfine"]),
        ]);
        spawnRoom = this.createRoom("Machinery");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Turbolift", "MAP", ["alpha"]),
            this.createStation(ESTATION.engineering, "Engineering", "ENG", ["alpha"]),
            this.createStation(ESTATION.storage, "Storage Room", "STG", ["alpha"]),
            this.createStation(ESTATION.hangar, "Hangar", "HNG", ["alpha"])
        ]);

        //create Shuttle Danube
        spawnLocation = this.createLocation("Shuttle Danube", ELOCATION.ship, { x: -0.45, y: -0.35, z: 0.5 }, "sprBlueprintShipShuttle");
        spawnSector.addLocations([spawnLocation]);
        spawnRoom = this.createRoom("Cockpit");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Map", "MAP", ["alpha"]),
            this.createStation(ESTATION.astronometry, "Astrometrics", "AST", ["alpha"]),
            this.createStation(ESTATION.navigation, "Navigation", "NAV", ["alpha"]),
            this.createStation(ESTATION.weapons, "Weapons", "WPN", ["alpha"]),
            this.createStation(ESTATION.communications, "Communications", "COM", ["alpha"])
        ]);
        spawnRoom = this.createRoom("Back");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Map", "MAP", ["alpha"]),
            this.createStation(ESTATION.science, "Science", "SCI", ["alpha"]),
            this.createStation(ESTATION.engineering, "Engineering", "ENG", ["alpha"]),
            this.createStation(ESTATION.storage, "Storage Room", "STG", ["alpha"]),
        ]);
    }

    update(){
        for(let s of this.sectors){
            s.update();
        }
    }

    addSector(_x, _y, _z){
        this.sectors.push(new Sector(192, 168, 0));
    }

    removeSectors(_sectors){
        for(let i = this.sectors.length-1 ; i >= 0 ; i--){
            for(let s of _sectors){
                if(s === this.sectors[i]){
                    this.sectors.splice(i, 1);
                }
            }
        }
    }

    spawnPlayer(_id){
        this.players.push(new Player(_id));
    }

    /*addPlayer(_id, _start){
        this.players.push(new Player(_id));
        let start = null
        let arr = this.locations.filter((loc) => { return loc.id === _start });
        if (arr.length > 0) {
            start = arr[0];
            this.players[this.players.length-1].setLocation(start);
        }
    }*/

    removePlayer(_id) {
        for (let i = this.players.length - 1; i >= 0; i--) {
            if (this.players[i].id === _id) {
                this.players.splice(i, 1);
            }
        }
    }

    createSector(_x, _y, _z){
        return new Sector(192, 168, 0);
    }

    createLocation(_id, _type, _coords, _blueprint){
        return new Location(_id, _type, _coords, _blueprint);
    }

    createRoom(_name){
        return new Room(_name);
    }

    createStation(_type, _name, _short, _passkeys){
        return new Station(_type, _name, _short, _passkeys);
    }
    
}
module.exports = GameData;

/*
class GameData {
    constructor() {
        this.players = [];
    this.locations = [];

    this.locations.push(new Location(
        "Enterprise",
        "ship",
        ["Alpha"],
            [{
            name: "Astronometry",
            short: "AST",
            type: 0
        }, {
            name: "Navigation",
            short: "NAV",
            type: 0
        }, {
            name: "Weapons",
            short: "WPN",
            type: 0
        }, {
            name: "Communications",
            short: "COM",
            type: 0
        }, {
            name: "Engineering",
            short: "ENG",
            type: 0
        }, {
            name: "Transporter",
            short: "TRS",
            type: 0
        },{
            name: "Storage",
            short: "STG",
            type: 2
        },{
            name: "Hangar",
            short: "HNG",
            type: 0
        }],{
            x: 192,
            y: 168,
            z: 0
        },{
            x: 0.25,
            y: 0.6,
            z: 0.5
        }
    ));

    this.locations.push(new Location(
        "Deep Station Fine",
        "station",
        ["DS9"],
            [{
            name: "Astronometry",
            short: "AST",
            type: 0
        }, {
            name: "Communications",
            short: "COM",
            type: 0
        }, {
            name: "Engineering",
            short: "ENG",
            type: 0
        }, {
            name: "Transporter",
            short: "TRS",
            type: 0
        }, {
            name: "Storage",
            short: "STG",
            type: 2
        }, {
            name: "Hangar",
            short: "HNG",
            type: 0
        }, {
            name: "Bar",
            short: "BAR",
            type: 0
        }, {
            name: "Merchant",
            short: "MRC",
            type: 0
        }], {
            x: 192,
            y: 168,
            z: 0
        }, {
            x: -0.5,
            y: -0.4,
            z: 0.5
        }
    ));

    }

    update(){
        for(let l of this.locations){
            l.update();
        }
    }

    addPlayer(_id, _start){
        this.players.push(new Player(_id));
        let start = null
        let arr = this.locations.filter((loc) => { return loc.id === _start });
        if (arr.length > 0) {
            start = arr[0];
            this.players[this.players.length-1].setLocation(start);
        }
    }

    removePlayer(_id) {
        for (let i = this.players.length - 1; i >= 0; i--) {
            if (this.players[i].id === _id) {
                this.players.splice(i, 1);
            }
        }
    }

    warpLocation(_location, _fromSector, _toSector){
        _toSector.addLocation(_location);
        _fromSector.removeLocation(_location);
        //how to move theplayer
    }
}
module.exports = GameData;
    
*/