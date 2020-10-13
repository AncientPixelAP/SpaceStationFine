import Button from "../lcars/button.js";

export default class Numpad{
    constructor(_scene, _pos) {
        this.scene = _scene;
        this.pos = _pos;

        this.input = 0;
        this.currentField = null;
        this.setFunc = () => {};
        this.negFunc = () => {};
        this.delFunc = () => {};
        this.clrFunc = () => {};
        this.cFunc = () => {};
        this.pointFunc = () => {};

        this.numpadLTop = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL48").setScale(1, -1);
        this.numpadLTop.setTintFill(LCARSCOLOR.offOrange);
        this.numpadLBot = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL48");
        this.numpadLBot.setTintFill(LCARSCOLOR.offOrange);

        this.btnsNumber = [];
        for (let i = 0; i < 9; i++) {
            this.btnsNumber.push(new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnMono16", String(i + 1), false, () => {
                let str = this.input.toString();
                str += String(i + 1);
                this.input = parseInt(str);
            }));
        }
        this.btnNumberZero = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnMono16", "0", false, () => {
            let str = this.input.toString();
            str += "0";
            this.input = parseInt(str);
        });
        this.btnPoint = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnMono16", ",", false, () => {
            /*if(this.currentCoord === "x"){
                this.headingCoords.x = this.input;
                this.input = 0;
                this.currentCoord = "y";
            }else{
                this.headingCoords.y = this.input;
                this.input = 0;
                this.currentCoord = "x";
            }*/
            this.pointFunc();
        });
        this.btnC = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnMono16", "C", false, () => {
            /*this.headingCoords.x = 0;
            this.headingCoords.y = 0;
            this.headingCoords.z = 0;*/
            this.input = 0;
            this.cFunc();
        });
        this.btnNegate = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnRight48", "NEG", false, () => {
            this.input *= -1;
            this.negFunc();
        });
        this.btnDelete = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnRight48", "DEL", false, () => {
            let str = this.input.toString();
            if (str.length > 1) {
                str = str.slice(0, str.length - 1);
                if (str === "-") {
                    str = "0";
                }
            } else {
                str = "0";
            }
            this.input = parseInt(str);
            this.delFunc();
        });
        this.btnSet = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnRight48", "SET", false, () => {
            //this.heading = Phaser.Math.Angle.Between(0, 0, this.headingCoords.x, this.headingCoords.y);
            //this.setCourse();
            this.setFunc();
        });
        this.btnClear = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnRight48", "CLR", false, () => {
            /*this.headingCoords.x = 0;
            this.headingCoords.y = 0;
            this.headingCoords.z = 0;*/
            this.input = 0;
            this.clrFunc();
        });
    }

    update(){
        for (let b of this.btnsNumber) {
            b.update();
        }
        this.btnNumberZero.update();
        this.btnPoint.update();
        this.btnC.update();
        this.btnNegate.update();
        this.btnDelete.update();
        this.btnSet.update();
        this.btnClear.update();
    }

    move(_x, _y){
        this.pos.x = _x;
        this.pos.y = _y;

        for (let [i, b] of this.btnsNumber.entries()) {
            let xx = 18 * (i % 3);
            let yy = 18 * (Math.floor(i / 3));
            b.move(this.pos.x + xx -18 , this.pos.y - yy + 18);
        }
        this.btnNumberZero.move(this.pos.x -18, this.pos.y + 36);
        this.btnPoint.move(this.pos.x, this.pos.y + 36);
        this.btnC.move(this.pos.x + 18, this.pos.y + 36);
        this.btnSet.move(this.pos.x + 52, this.pos.y + 36);
        this.btnDelete.move(this.pos.x + 52, this.pos.y - 18);
        this.btnNegate.move(this.pos.x + 52, this.pos.y);
        this.btnClear.move(this.pos.x + 52, this.pos.y + 18);

        this.numpadLTop.x = this.pos.x - 52;
        this.numpadLTop.y = this.pos.y - 9;
        this.numpadLBot.x = this.pos.x - 52;
        this.numpadLBot.y = this.pos.y + 27;
    }

    setForInput(_button, _defaultInput) {
        this.currentField = _button;
        this.input = _defaultInput;
    }
}