let Player = require("./player");
let Location = require("./location");
const Sector = require("./sector");
const Station = require("./station");
const Room = require("./room");
const NPC = require("./npc");

const ERACE = {
    human: "human",
    blingon: "blingon",
    otherianen: "otherianen",
    berengi: "berengi",
    klongon: "klongon",
    cardosian: "cardosian"
}

const ERELATION = {
    neutral: "neutral",
    allied: "allied",
    hostile: "hostile",
    friendly: "friendly"
}

const ELOCATION = {
    ship: "ship",
    shuttle: "shuttle",
    evSuit: "EV-Suit",
    station: "station",
    planet: "planet",
    asteroid: "asteroid",
    moon: "moon",
    nebula: "nebula",
    resonanceTraces: "resonanceTraces",
    warpcore: "warpcore",
    topedo: "torpedo"
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
    science: "science",
    airlock: "airlock",
    npcquarter: "npcquarter",
    warpcore: "warpcore",
    table: "table"
}

const ESYSTEM = {
    warpcore: "warpcore",
    impulseDrive: "impulseDrive",
    shieldGenerator: "shieldGenerator",
    target: "target",
    airlock: "airlock",
    transporter: "transporter",
    phaserBank: "phaserBank",
    deflectorShield: "deflectorShield",
    sensors: "sensors"
}

class GameData{
    constructor(){
        this.npcs = [];
        this.players = [];
        this.sectors = [];
        this.group = {
            flags: [],
            inventory: []
        }

        let spawnSector, spawnLocation, spawnRoom;
        spawnSector = this.createSector(192, 168, 0);
        spawnSector.setName("Baja");
        this.sectors.push(spawnSector);

        //create Deep Station Nine
        spawnLocation = this.createLocation("Deep Station Fine", ELOCATION.station, { x: 0, y: 0, z: 0.5 }, "sprBlueprintStationDeepStation", ERELATION.allied);
        spawnSector.addLocations([spawnLocation]);
        spawnRoom = this.createRoom("OPS");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Turbolift", "MAP", ["alpha"]),
            this.createStation(ESTATION.astronometry, "Astrometrics", "AST", ["dsfine"]),
            this.createStation(ESTATION.communications, "Communications", "COM", ["dsfine"]),
            this.createStation(ESTATION.transporter, "Transporter Room", "TRS", ["dsfine"]),
            this.createStation(ESTATION.npcquarter, "Commander´s Office", "CMD", ["dsfine"]),
        ]);
        this.spawnNPC("Commander Bernhardette Circa", "bajaCommanderCirca00", spawnSector.name, spawnLocation.id, spawnRoom.id, "Commander´s Office");
        spawnRoom = this.createRoom("Promenade");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Turbolift", "MAP", ["alpha"]),
            this.createStation(ESTATION.npcquarter, "Derrek´s Cardosiann Shoes", "DRK", ["alpha"]),
            this.createStation(ESTATION.transporter, "Transporter Room", "TRS", ["alpha"]),
            this.createStation(ESTATION.airlock, "Airlock", "AIR", ["alpha"])
        ]);
        this.spawnNPC("Derrek", "bajaDerrek00", spawnSector.name, spawnLocation.id, spawnRoom.id, "Derrek´s Cardosiann Shoes");
        spawnRoom = this.createRoom("Quirks Bar");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Turbolift", "MAP", ["alpha"]),
            this.createStation(ESTATION.bar, "Quirks", "BAR", ["alpha"]),
            this.createStation(ESTATION.table, "Table 01", "TBL", ["alpha"]),
            this.createStation(ESTATION.npcquarter, "Bar Counter", "QRK", ["dsfine"]),
        ]);
        this.spawnNPC("Quirk", "bajaQuirk00", spawnSector.name, spawnLocation.id, spawnRoom.id, "Bar Counter");
        spawnRoom = this.createRoom("Machinery");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Turbolift", "MAP", ["alpha"]),
            this.createStation(ESTATION.engineering, "Engineering", "ENG", ["alpha"]),
            this.createStation(ESTATION.npcquarter, "Chef Engineering", "COB", ["dsfine"]),
            this.createStation(ESTATION.storage, "Storage Room", "STG", ["alpha"]),
            this.createStation(ESTATION.hangar, "Hangar", "HNG", ["alpha"])
        ]);
        this.spawnNPC("Chef O´Bran", "bajaChefOBran00", spawnSector.name, spawnLocation.id, spawnRoom.id, "Chef Engineering");
        spawnLocation.dockingPortsMax = 5;
        spawnLocation.addSystem(this.createSystem(ESYSTEM.shieldGenerator, "Shield Generator", 1, 1));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.deflectorShield, "Deflector Shield", 1, 1));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.airlock, "Docking Computer", 1, 1));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.transporter, "Transporter", 1, 1));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.sensors, "Sensor Array", 1, 1));

        //create planet Baja
        spawnLocation = this.createLocation("Baja Prime", ELOCATION.planet, { x: -0.21, y: 0.45, z: 0.5 }, "sprBlueprintShipShuttle", ERELATION.allied);
        spawnSector.addLocations([spawnLocation]);
        spawnRoom = this.createRoom("Ambassy");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Map", "MAP", ["alpha"]),
            this.createStation(ESTATION.astronometry, "Astrometrics", "AST", ["alpha"]),
            this.createStation(ESTATION.communications, "Communications", "COM", ["alpha"]),
            this.createStation(ESTATION.bar, "Baja Beach", "BAR", ["alpha"]),
            this.createStation(ESTATION.transporter, "Transporter Room", "TRS", ["alpha"]),
            this.createStation(ESTATION.npcquarter, "Conference Room", "AMB", ["alpha"]),
        ]);
        this.spawnNPC("Ambassador Veyn", "bajaCaptain00", spawnSector.name, spawnLocation.id, spawnRoom.id, "Conference Room");
        spawnLocation.spd = 0.001;
        spawnLocation.addSystem(this.createSystem(ESYSTEM.shieldGenerator, "Shield Generator", 1, 1));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.transporter, "Transporter", 1, 1));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.sensors, "Sensor Array", 1, 1));

        //create Enterprise
        spawnLocation = this.createLocation("Enterprise", ELOCATION.ship, {x: 0.01,y: -0.01,z: 0.5}, "sprBlueprintShipGalaxyClass", ERELATION.allied);
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
            this.createStation(ESTATION.npcquarter, "Captain Quarters", "CPT", ["alpha"]),
        ]);
        this.spawnNPC("Captain John Pickert", "bajaCaptain00", spawnSector.name, spawnLocation.id, spawnRoom.id, "Captain Quarters");
        spawnRoom = this.createRoom("Conference Room");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Turbolift", "MAP", ["alpha"]),
            this.createStation(ESTATION.table, "Conference Table", "TBL", ["alpha"])
        ]);
        spawnRoom = this.createRoom("Deck B");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Turbolift", "MAP", ["alpha"]),
            this.createStation(ESTATION.bar, "Be Front", "FWD", ["alpha"]),
            this.createStation(ESTATION.holodeck, "HoloDeck", "HOL", ["alpha"]),
            this.createStation(ESTATION.sickbay, "Sickbay", "MED", ["alpha"]),
            this.createStation(ESTATION.airlock, "Airlock", "AIR", ["alpha"])
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
        spawnLocation.dockingPortsMax = 1;
        spawnLocation.dockAt(spawnSector.locations[0]);
        spawnLocation.addSystem(this.createSystem(ESYSTEM.warpcore, "Welpcore", 0, 0));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.impulseDrive, "Impulse Drive", 0, 0));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.shieldGenerator, "Shield Generator", 1, 1));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.deflectorShield, "Deflector Shield", 1, 1));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.airlock, "Docking Computer", 1, 1));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.transporter, "Transporter", 1, 1));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.sensors, "Sensor Array", 1, 1));

        //create Shuttle Danube
        spawnLocation = this.createLocation("Shuttle Danube", ELOCATION.ship, { x: -0.45, y: -0.35, z: 0.5 }, "sprBlueprintShipShuttle", ERELATION.allied);
        spawnLocation.unknow = true;
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
        spawnRoom = this.createRoom("Cabin");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Map", "MAP", ["alpha"]),
            this.createStation(ESTATION.science, "Science", "SCI", ["alpha"]),
            this.createStation(ESTATION.engineering, "Engineering", "ENG", ["alpha"]),
            this.createStation(ESTATION.storage, "Storage Room", "STG", ["alpha"]),
            this.createStation(ESTATION.airlock, "Airlock", "AIR", ["alpha"])
        ]);
        spawnLocation.dockingPortsMax = 1;
        spawnLocation.alert = true;
        spawnLocation.headingCoords.x = -200;
        spawnLocation.headingCoords.y = -75;
        spawnLocation.addSystem(this.createSystem(ESYSTEM.impulseDrive, "Impulse Drive", 1, 1));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.shieldGenerator, "Shield Generator", 0, 0));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.deflectorShield, "Deflector Shield", 1, 1));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.airlock, "Docking Computer", 1, 1));
        spawnLocation.addSystem(this.createSystem(ESYSTEM.sensors, "Sensor Array", 1, 1));

        //create ejected Warpcore
        spawnLocation = this.createLocation("Ejected Welpcore", ELOCATION.warpcore, { x: 0.35, y: 0.15, z: 0.5 }, "sprBlueprintShipShuttle", ERELATION.neutral);
        spawnLocation.unknow = true;
        spawnSector.addLocations([spawnLocation]);
        spawnRoom = this.createRoom("Control Module");
        spawnLocation.addRooms([spawnRoom]);
        spawnRoom.addStations([
            this.createStation(ESTATION.map, "Map", "MAP", ["alpha"]), 
            this.createStation(ESTATION.engineering, "Engineering", "ENG", ["alpha"])
        ]);
        spawnLocation.addSystem(this.createSystem(ESYSTEM.warpcore, "Welpcore", 0, 0));

        //create klongoin wepcore traces
        spawnLocation = this.createLocation("Klongon Welptraces", ELOCATION.resonanceTraces, { x: -0.44, y: -0.38, z: 0.5 }, "sprBlueprintShipShuttle", ERELATION.neutral);
        spawnLocation.unknow = true;
        spawnLocation.hidden = true;
        spawnSector.addLocations([spawnLocation]);
        spawnLocation.headingCoords.x = 10;
        spawnLocation.headingCoords.y = -9;
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

    removePlayer(_id) {
        for (let i = this.players.length - 1; i >= 0; i--) {
            if (this.players[i].id === _id) {
                this.players.splice(i, 1);
            }
        }
    }

    spawnNPC(_name, _file, _sectorId, _locationId, _roomId, _stationId){
        this.npcs.push(new NPC(_name, _file, _sectorId, _locationId, _roomId, _stationId));
    }

    removeNPC(_name){
        for(let i = this.npcs.length-1 ; i >= 0 ; i--){
            if(this.npcs[i].name === _name){
                this.npcs.splice(i, 1);
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

    createSystem(_type, _name, _power, _hp){
        return {
            type: _type,
            name: _name,
            power: _power,
            hp: _hp
        }
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