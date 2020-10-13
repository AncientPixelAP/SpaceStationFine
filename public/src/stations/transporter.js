import Button from "../lcars/button.js";
import Numpad from "../lcars/numpad.js";
import CrossPad from "../lcars/crossPad.js";

export default class Transporter {
    constructor(_scene, _data) {
        this.scene = _scene;
        this.data = _data;

        this.pos = {
            x: 0,
            y: 0
        }

        this.players = [];
        socket.on("getPlayersAtLocation", (_data) => {
            console.log(_data);
            //remove old images
            for(let p of this.players){
                p.txt.destroy();
                p.pip.destroy();
            }
            this.players = [];
            //fill new players
            for(let [i, p] of _data.entries()){
                this.players.push({
                    pip: this.scene.add.sprite(0, i * 18, "sprLcarsPipLeft16").setTintFill(LCARSCOLOR.gold),
                    txt: this.scene.add.bitmapText(0, i * 18, "pixelmix", p.id, 8, 1).setOrigin(0, 0.5)
                });
            }
        });

        this.btnScanSector = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "REFRESH", false, () => {
            socket.emit("requestPlayersAtLocation", {
                id: this.scene.locationData.id
            });
        });

        //HEADING fo transporter beam
        this.headingCoords = {
            x: 0,
            y: 0,
            z: 0
        }
        this.headingXTxt = new Button(this.scene, { x: 0, y: 0 }, "sprLcarsBtnLong48", this.headingCoords.x, true, () => {
            //this.numpad.setForInput(this.headingXTxt, this.headingCoords.x);
            this.crossPad.setForInput(this.headingXTxt, this.headingCoords.x);
            this.headingYTxt.active = false;
        });
        this.headingYTxt = new Button(this.scene, { x: 0, y: 0 }, "sprLcarsBtnLong48", this.headingCoords.y, true, () => {
            //this.numpad.setForInput(this.headingYTxt, this.headingCoords.y);
            this.crossPad.setForInput(this.headingYTxt, this.headingCoords.y);
            this.headingXTxt.active = false;
        });
        this.numpad = new Numpad(this.scene, { x: this.pos.x, y: this.pos.y });
        /*this.numpad.setFunc = () => {
            this.heading = Phaser.Math.Angle.Between(0, 0, this.headingCoords.x, this.headingCoords.y);
            this.setCourse();
        };*/
        this.numpad.clrFunc = () => {
            this.headingCoords.x = 0;
            this.headingCoords.y = 0;
            this.headingCoords.z = 0;
        }
        this.numpad.pointFunc = () => {
            this.numpad.setFunc();
            if (this.headingXTxt.active === true) {
                this.headingXTxt.active = false;
                this.headingYTxt.simulateClick();
            } else {
                this.headingYTxt.active = false;
                this.headingXTxt.simulateClick();
            }
        }

        this.crossPad = new CrossPad(this.scene, {x: 0, y: 0});

    }

    update() {
        this.btnScanSector.update();

        this.numpad.update();
        /*switch (this.numpad.currentField) {
            case this.headingXTxt:
                this.headingCoords.x = this.numpad.input;
                break;
            case this.headingYTxt:
                this.headingCoords.y = this.numpad.input;
                break;
            default:
                break;
        }*/

        this.crossPad.update();
        switch (this.crossPad.currentField) {
            case this.headingXTxt:
                this.headingCoords.x = this.crossPad.input;
                break;
            case this.headingYTxt:
                this.headingCoords.y = this.crossPad.input;
                break;
            default:
                break;
        }

        this.headingXTxt.txt.setText(this.headingCoords.x);
        this.headingYTxt.txt.setText(this.headingCoords.y);
        this.headingXTxt.update();
        this.headingYTxt.update();

        for(let [i, p] of this.players.entries()){
            p.pip.x = this.pos.x - 168;
            p.pip.y = this.pos.y - 116 + (i * 18);
            p.txt.x = this.pos.x - 158;
            p.txt.y = this.pos.y -116 + (i * 18);
        }
    }

    move(){
        this.btnScanSector.move(this.pos.x + 222, this.pos.y - 116);

        this.numpad.move(this.pos.x - 100, this.pos.y + 114);

        this.crossPad.move(this.pos.x + 32, this.pos.y + 105);

        this.headingXTxt.move(this.pos.x - 100, this.pos.y + 60);
        this.headingYTxt.move(this.pos.x - 48, this.pos.y + 60);

        for (let [i, p] of this.players.entries()) {
            p.pip.x = this.pos.x - 168;
            p.pip.y = this.pos.y - 116 + (i * 18);
            p.txt.x = this.pos.x - 158;
            p.txt.y = this.pos.y - 116 + (i * 18);
        }
    }

    synchronize(){
        
    }
}