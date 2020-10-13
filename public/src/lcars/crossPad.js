import Button from "../lcars/button.js";

export default class CrossPad{
    constructor(_scene, _pos){
        this.scene = _scene;
        this.pos = _pos;

        this.input = 0;
        this.currentField = null;
        this.setFunc = () => { };
        this.negFunc = () => { };
        this.delFunc = () => { };
        this.clrFunc = () => { };
        this.cFunc = () => { };
        this.pointFunc = () => { };

        this.bg = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsCrosspadBg");

        this.btnPlusOne = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnLeft32", ">", false, () => {
            this.input += 1;
        });
        this.btnPlusOne.sprite.angle = 180;
        this.btnMinusOne = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnLeft32", "<", false, () => {
            this.input -= 1;
        });
        this.btnMinusTen = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnLeft32", ">>", false, () => {
            this.input -= 10;
        });
        this.btnMinusTen.sprite.angle = -90;
        this.btnMinusTen.txt.angle = 90;
        this.btnPlusTen = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnLeft32", "<<", false, () => {
            this.input += 10;
        });
        this.btnPlusTen.sprite.angle = 90;
        this.btnPlusTen.txt.angle = 90;
    }

    update(){
        this.btnMinusOne.update();
        this.btnPlusTen.update();
        this.btnPlusOne.update();
        this.btnMinusTen.update();
    }

    move(_x, _y) {
        this.pos.x = _x;
        this.pos.y = _y;

        this.bg.x = this.pos.x;
        this.bg.y = this.pos.y;

        this.btnMinusOne.move(this.pos.x - 26, this.pos.y);
        this.btnPlusTen.move(this.pos.x, this.pos.y - 26);
        this.btnPlusOne.move(this.pos.x + 26, this.pos.y);
        this.btnMinusTen.move(this.pos.x, this.pos.y + 26);
    }

    setForInput(_button, _defaultInput) {
        this.currentField = _button;
        this.input = _defaultInput;
    }
}