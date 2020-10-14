let Player = require("./player");
let Location = require("./location");

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

    /*spawnShip(_type, _name){
        switch(_type){
            case SHIPTYPE.GALAXYCLASS:
            break;
        }
    }*/
}
module.exports = GameData;