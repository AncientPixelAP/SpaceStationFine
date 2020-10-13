import Button from "./lcars/button.js";
import Welcome from "./stations/welcomeScreen.js";

export default class StationList {
    constructor(_scene, _stations) {
        this.scene = _scene;

        this.offset = {
            x: 0,
            y: 0
        }

        this.station = new Welcome(this.scene);

        this.data = {
            name: "stationlist",
            power: 1,
            short: "LST",
            passkey: ["alpha"],
            type: 0,
            inventory: []
        }

        this.leftLTop = this.scene.add.sprite(this.scene.left + 34, this.scene.top + 18, "sprLcarsL64thin");
        this.leftLTop.setTintFill(LCARSCOLOR.gold);

        this.rightLTop = this.scene.add.sprite(this.scene.right - 34, this.scene.top + 18, "sprLcarsL64thin");
        this.rightLTop.setScale(-1, 1);
        this.rightLTop.setTintFill(LCARSCOLOR.gold);

        this.buttons = [];
        for(let [i, s] of _stations.entries()){
            this.buttons.push(new Button(this.scene, { x: this.scene.left + 34, y: this.scene.top + 44 + (i * 18) }, "sprLcarsBtnLong64", s.data.short, true, () => {
                //deactive all other buttons
                for(let [j, b] of this.buttons.entries()){
                    if(i !== j){
                        b.active = false;
                    }
                }
                //move all stations out
                for(let sta of this.scene.stations){
                    sta.moveOut();
                }
                //move desired station in 
                s.moveIn();
                this.scene.currentStation = s;
                this.station.dismiss();
            }));
        }

        this.leftLLower = this.scene.add.sprite(this.scene.left + 34, this.scene.top + 52 + (this.buttons.length * 18), "sprLcarsL64thin");
        this.leftLLower.setScale(-1, -1);
        this.leftLLower.setTintFill(LCARSCOLOR.gold);
        this.leftPillar = this.scene.add.sprite(this.scene.left + 50, this.scene.bottom-34, "sprLcarsPillar32");
        this.leftPillar.setTintFill(LCARSCOLOR.gold);
        this.leftPillarMid = this.scene.add.sprite(this.scene.left + 50, (this.leftLLower.y + 8 + this.leftPillar.y - 16) * 0.5, "sprLcarsPillar32");
        this.leftPillarMid.setTintFill(LCARSCOLOR.gold);

        this.locationTxt = this.scene.add.bitmapText(this.scene.left + 16, (this.leftPillar.y+this.leftLLower.y) * 0.5, "pixelmix", this.scene.locationData.id, 8, 1).setOrigin(0.5);
        this.locationTxt.angle = -90;
    }

    update() {
        for (let b of this.buttons) {
            b.update();
        }

        this.station.update();
    }

    moveIn() {
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

    move() {

    }
}