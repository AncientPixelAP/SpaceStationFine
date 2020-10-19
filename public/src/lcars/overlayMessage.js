import Button from "./button.js";

export default class OverlayMessage{
    constructor(_scene, _pos, _text){
        this.scene = _scene;
        this.pos = _pos;

        this.bg = this.scene.add.graphics(this.pos.x, this.pos.y);
        this.bg.fillStyle(0xff0000);
        this.bg.fillRect(-128, -64, 256, 128);
        this.bg.depth = 1000;

        this.txt = this.scene.add.bitmapText(this.x, this.y, "pixelmix", "TEST text gg\nMultiline ftw.!", 8, 1).setOrigin(0.5);
        this.txt.setLeftAlign();
        this.txt.maxWidth = 248;
        this.txt.depth = 1000;

        this.btnDismiss = new Button(this.scene, {x: this.pos.x, y: this.pos.y + 64}, "sprLcarsBtnLong48", "OK", false, () => {
            this.destroy();
        });
        this.btnDismiss.setDepth(1000);
    }

    update(){
        this.btnDismiss.update();
    }

    setText(_txt){
        this.txt.setText(_text);

        let txtBounds = this.txt.getTextBounds().local;

        this.bg.clear();
        this.bg.fillStyle(0xff0000);
        this.bg.fillRect(txtBounds.width * -0.5, txtBounds.height * -0.5, txtBounds.width, txtBounds.height);
        this.bg.depth = 1000;
    }

    move(_x, _y){
        this.bg.x = _x;
        this.bg.y = _y;
        this.txt.x = _x;
        this.txt.y = _y;
        this.btnDismiss.move(_x, _y + 64);
    }

    destroy(){
        this.bg.destroy();
        this.txt.destroy();
        this.btnDismiss.destroy();
    }
}