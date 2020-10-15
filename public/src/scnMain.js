import Hand from "./hand.js";
import GenericStation from "./stations/genericStation.js";
import StationList from "./stationList.js";

export default class ScnMain extends Phaser.Scene {

    constructor() {
        super("ScnMain");
    }

    create() {
        //console.log(this);
        this.cameras.main.setScroll(-this.game.config.width * 0.5, -this.game.config.height * 0.5);
        this.cameras.main.setBackgroundColor(0x000000);

        this.left = this.game.config.width * -0.5;
        this.right = this.game.config.width * 0.5;
        this.top = this.game.config.height * -0.5;
        this.bottom = this.game.config.height * 0.5;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = {
            e: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            s: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            end: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.END),
            one: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
            two: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
            three: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
            four: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
            five: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE),
            six: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX),
            seven: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN),
            eight: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT),
            nine: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE),
            zero: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO),
        }

        this.keys.w.on('down', function (key, event) {
            // event.stopPropagation();
        }, this);

        this.hand = new Hand(this);
        
        //Phaser.Math.RND.sow(["seed"]);
        //console.log(Phaser.Math.RND);
        
        this.bsp = this.add.bitmapText(-124, -124, "pixelmix", "", 8, 1);//.setOrigin(0.5);
        this.bsp.alpha = 1;
        
        this.playerData = null;
        this.locationData = null;
        this.sectorData = null;
        this.stations = [];
        this.currentStation = null;
        this.currentRoom = null;
        
        //console.log(socket);
        socket.on("pongTest", (_data) => {
            console.log(_data);
        });

        socket.on("joinGame", (_data) => {
            console.log(_data);
        });

        socket.on("getLocation", (_data) => {
            console.log(_data);
            this.locationData = _data.locationData;
            this.playerData = _data.playerData;

            this.createRoom(_data.locationData.rooms[0]);

            this.synchronize();
        });

        socket.on("sectorUpdate", (_data) => {
            this.sectorData = _data.sectorData;
            this.locationData = this.sectorData.locations.filter((l) => l.id === this.playerData.location.id)[0];

            this.synchronize();
        });

        socket.emit("joinPlayer", {});
    }
    
    createRoom(_room){
        this.currentRoom = _room;

        for(let s of this.stations){
            s.destroy();
        }
        this.stations = [];

        for (let [i, s] of _room.stations.entries()) {
            this.stations.push(new GenericStation(this, s));
        }

        this.stations.push(new StationList(this, this.stations));
        this.currentStation = this.stations[this.stations.length - 1];
        this.currentStation.buttons[0].simulateClick();
    }

    update() {
        this.hand.update();

        if(this.currentStation !== null){
            this.currentStation.update();
            this.stations[this.stations.length-1].update();
        }
        
    }

    synchronize(){
        for(let s of this.stations){
            if(s.station !== null){
                s.station.synchronize();
            }
        }
    }
}