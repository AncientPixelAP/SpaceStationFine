import Player from "./player.js";
import OtherPlayer from "./otherPlayer.js";
import Conversation from "./conversation.js";
import Flower from "./flower.js";
import Ball from "./ball.js";
import Wall from "./wall.js";
import CrateTree from "./tree.js";

export default class ScnMain extends Phaser.Scene {

    constructor() {
        super("ScnMain");
        this.levelName = "";
    }

    init(_levelName) {
        console.log("init ScnMain");
        this.levelName = _levelName;
    }

    create() {
        //console.log(this);
        this.cameras.main.setScroll(-this.game.config.width / 2, -this.game.config.height / 2);
        this.cameras.main.setBackgroundColor(0x000000);

        //this.level = this.cache.json.get(this.levelName);

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
            let x = (Math.floor(this.input.activePointer.worldX / 8) * 8) + 4;
            let y = (Math.floor(this.input.activePointer.worldY / 8) * 8) + 4;
            this.walls.push(new Wall(this, x, y, "sprWallHalfFront"));
        }, this);

        //Phaser.Math.RND.sow(["seed"]);
        //console.log(Phaser.Math.RND);
        
        this.bsp = this.add.bitmapText(-124, -124, "pixelmix", "", 8, 1);//.setOrigin(0.5);
        this.bsp.alpha = 0.25;

        this.player = null;//new Player(this, 0, 0);
        this.otherPlayers = [];
        this.balls = [];
        this.walls = [];
        this.tiles = [];

        this.flowers = [];
        for(let i = 0 ; i < 16 ; i++){
            this.flowers.push(new Flower(this, Phaser.Math.RND.between(-96, 96), Phaser.Math.RND.between(-96, 96)));
        }
        for(let y = 0 ; y < 6 ; y++){
            for (let x = 0; x < 10; x++) {
                let wgl = Phaser.Math.RND.between(0, 1);
                this.flowers.push(new Flower(this, 128 + (x * 10) + wgl, -30 + (y * 10) + wgl));
            }
        }
        
        this.tree = new CrateTree(this, -48, 0, 0);

        
        //console.log(socket);
        socket.on("pongTest", (_data) => {
            console.log(_data);
        });

        socket.on("getUpdate", (_data) => {
            for(let dp of _data.players){
                let arr = this.otherPlayers.filter((o) => {return o.id === dp.id});
                if(arr.length > 0){
                    arr[0].move(dp.pos.x, dp.pos.y);
                    arr[0].setState(dp.state);
                }else{
                    if(dp.id !== this.player.id){
                        this.otherPlayers.push(new OtherPlayer(this, dp.pos.x, dp.pos.y, dp.id));
                    }
                }
            }
            for(let db of _data.level.balls){
                let arr = this.balls.filter((o) => {return o.id === db.id});
                if(arr.length > 0){
                    arr[0].move(db.pos.x, db.pos.y);
                }
            }
            this.tree.getDust(_data.level.glowTree.dust);
        });

        socket.on("joinGame", (_data) => {
            console.log(_data);
            //get alll players
            for(let dp of _data.players){
                if(dp.id !== _data.you){
                    this.otherPlayers.push(new OtherPlayer(this, dp.pos.x, dp.pos.y, dp.id));
                }else{
                    this.player = new Player(this, dp.pos.x, dp.pos.y, _data.you);
                    this.bsp.setText(_data.you);
                }
            }
            //get all level objects
            for (let db of _data.level.balls) {
                this.balls.push(new Ball(this, db.pos.x, db.pos.y, db.id));
            }
        });

        socket.on("kickPlayer", (_data) => {
            for(let i = this.otherPlayers.length-1 ; i >= 0 ; i--){
                if(this.otherPlayers[i].id === _data.id){
                    this.otherPlayers[i].destroy();
                    this.otherPlayers.splice(i, 1);
                }
            }
        });

        socket.emit("joinPlayer", {
            pos: {
                x: 0,
                y: 0
            }
        });

    }

    update() {
        if(this.input.activePointer.isDown){
            
            if(this.player !== null){
                this.player.move(this.input.activePointer.worldX, this.input.activePointer.worldY);

                //check hugging opportunities
                for(let p of this.otherPlayers){
                    let d = Phaser.Math.Distance.Between(this.player.pos.x, this.player.pos.y, p.pos.x, p.pos.y);
                    if(d <= 14){
                        if(this.player.state === PLAYERSTATES.NORMAL){
                            this.player.setState(PLAYERSTATES.HUG);
                        }
                    }else{
                        if(this.player.state === PLAYERSTATES.HUG){
                            this.player.setState(PLAYERSTATES.NORMAL);
                        }
                    }
                }

                this.player.sendPlayer();
            }
        }else{
            if (this.player !== null) {
                for (let p of this.otherPlayers) {
                    if(this.player.state === PLAYERSTATES.HUG && p.state === PLAYERSTATES.HUG){
                        let d = Phaser.Math.Distance.Between(this.player.pos.x, this.player.pos.y, p.pos.x, p.pos.y);
                        if(d <= 14 && d > 6){
                            this.player.move(p.pos.x, p.pos.y);

                            this.player.sendPlayer();
                        }
                    }
                }
            }
        }

        //UPDATE FLOWERS
        for(let f of this.flowers){
            let stopSearch = false;
            if(this.player !== null){
                if (f.sprite.getBounds().contains(this.player.pos.x, this.player.pos.y)) {
                    f.isGlowing = true;
                    stopSearch = true;
                } else {
                    f.isGlowing = false;
                }
            }
            glow: for(let p of this.otherPlayers){
                if(stopSearch === false){
                    if (f.sprite.getBounds().contains(p.pos.x, p.pos.y)) {
                        f.isGlowing = true;
                        //stopSearch = true;
                        break glow;
                    } else {
                        f.isGlowing = false;
                    }
                }
            }
            f.update();
        }

        //UPDATE TREE
        if (this.player !== null) {
            if(this.player.dust > 0){
                //let d = Phaser.Math.Distance.Between(this.player.pos.x, this.player.pos.y, this.tree.pos.x, this.tree.pos.y);
                if (this.tree.base.getBounds().contains(this.player.pos.x, this.player.pos.y)){
                    this.tree.addDust(this.player.dust);
                    this.player.dust = 0;
                }
            }
        }
        this.tree.update();

        //UPDATE BALLS
        for(let b of this.balls){
            let d = Phaser.Math.Distance.Between(this.player.pos.x, this.player.pos.y, b.pos.x, b.pos.y);
            if (d < 6) {
                b.kick(this.input.activePointer.worldX - this.player.pos.x, this.input.activePointer.worldY - this.player.pos.y);
            }

            b.update();
        }

        if(this.keys.nine.isDown){
            socket.emit("pingTest", {
                message: "ping!"
            });
        }

        if (this.player !== null) {
            let toX = Phaser.Math.Linear(this.cameras.main.scrollX, (this.game.config.width * -0.5) + this.player.pos.x, 0.1);
            let toY = Phaser.Math.Linear(this.cameras.main.scrollY, (this.game.config.height * -0.5) + this.player.pos.y, 0.1);
            this.cameras.main.setScroll(toX, toY);
        }

        socket.emit("requestUpdate");

        this.zSort();
    }

    zSort(){
        if(this.player !== null){
            this.player.zSort();
            for(let p of this.otherPlayers){
                p.zSort();
            }
            for (let b of this.balls) {
                b.zSort();
            }
        }
    }
}