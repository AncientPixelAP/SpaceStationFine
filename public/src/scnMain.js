import Hand from "./hand.js";
import GenericStation from "./stations/genericStation.js";
import StationList from "./stationList.js";
import GeneralUI from "./generalUI.js";

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
        this.generalUI = new GeneralUI(this);
        
        //Phaser.Math.RND.sow(["seed"]);
        //console.log(Phaser.Math.RND);
        
        this.bsp = this.add.bitmapText(-124, -124, "pixelmix", "", 8, 1);//.setOrigin(0.5);
        this.bsp.alpha = 1;

        this.beamParticles = this.add.particles("sprParticleLong00");
        this.beamParticlesEmitter = this.beamParticles.createEmitter({
            x: { min: this.game.config.width * -0.5, max: this.game.config.width * 0.5 },
            y: this.game.config.height * 0.5,
            lifespan: 1000,
            speedY: { min: -512, max: -800 },
            scale: { start: 1, end: 0 },
            quantity: 0,
            blendMode: 'ADD'
        }).pause();
        
        this.playerData = null;
        this.locationData = null;
        this.sectorData = null;
        this.playersData = null;
        this.npcsData = null;
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
            let col = {r: 0, g: 0, b: 0};
            let time = {in: 1500, out: 1500};
            switch(_data.effect){
                case "none":
                    time.in = 0;
                    time.out = 0;
                    break;
                case "moved":
                    time.in = 250;
                    time.out = 500;
                    break;
                case "beamed":
                    col.b = 255;
                    time.in = 500;
                    time.out = 1000;
                    this.beamParticlesEmitter.setQuantity(8);
                    this.beamParticlesEmitter.resume();
                    break;
                default:
                    break;
            }
            this.cameras.main.fade(time.in, col.r, col.g, col.b, false, (_cam, _dur) => {
                if(_dur >= 1){
                    console.log(_data);
                    this.locationData = _data.locationData;
                    this.playerData = _data.playerData;
                    localStorage.setItem(SAVEGAMENAME, JSON.stringify({
                        name: this.playerData.name,
                        lastLocationId: this.locationData.id
                    }));

                    this.createRoom(_data.locationData.rooms[0]);

                    this.synchronize();

                    this.beamParticlesEmitter.setQuantity(0);
                    _cam.fadeFrom(time.out, col.r, col.g, col.b, true, (_c, _d) => {
                        if(_d >= 1){
                            this.beamParticlesEmitter.pause();
                        }
                    }, this);
                }
            }, this);
        });

        socket.on("sectorUpdate", (_data) => {
            if(this.playerData !== null){
                this.sectorData = _data.sectorData;
                this.locationData = this.sectorData.locations.filter((l) => l.id === this.playerData.location.id)[0];
                this.playersData = _data.playersAtLocation;
                this.npcsData = _data.npcsAtLocation;

                for(let p of this.playersData){
                    if(p.id === this.playerData.id){
                        this.playerData = p;
                    }
                }

                this.synchronize();
            }
        });

        let save = JSON.parse(localStorage.getItem(SAVEGAMENAME));
        socket.emit("joinPlayer", {
            name: save.name,
            locationId: save.lastLocationId
        });
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