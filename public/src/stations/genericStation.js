import Astronometry from "./astronometry.js";
import Navigation from "./navigation.js";

export default class GenericStation{
    constructor(_scene, _data) {
        this.scene = _scene;
        this.data = _data;

        this.offset = {
            x: 0,
            y: 0
        }

        this.txt = this.scene.add.bitmapText(0, -100, "pixelmix", this.data.name, 8, 1).setOrigin(0, 0.5);

        this.station = null;
        this.createStation();

        this.moveOut();
    }

    update(){
        if(this.station !== null){
            this.station.update();
        }
    }

    createStation(){
        switch(this.data.name){
            case "Astronometry":
                switch(this.data.type){
                    case 0:
                        this.station = new Astronometry(this.scene, this.data);
                    break;
                    case 1:
                        //TODO other astronometry class with diff layout, eg withourt warp for shuttle
                        this.station = new Astronometry(this.scene, this.data);
                    break;    
                    default:
                    break;
                }
            break;
            case "Navigation":
                this.station = new Navigation(this.scene, this.data);
                break;
            default:
            break;
        }
    }

    moveIn(){
        this.offset = {
            x: 0,
            y: 0
        }
        this.move();
    }

    moveOut() {
        this.offset = {
            x: this.scene.game.config.width * 2,
            y: 0
        }
        this.move();
    }

    move(){
        this.txt.x = this.scene.left + this.offset.x + 42;
        this.txt.y = this.scene.top + this.offset.y + 13;

        if(this.station !== null){
            this.station.pos.x = this.offset.x;
            this.station.pos.y = this.offset.y;
            this.station.move();
        }
    }
}