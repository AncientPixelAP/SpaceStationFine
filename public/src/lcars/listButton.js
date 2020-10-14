export default class ListButton {
    constructor(_scene, _pos, _text, _togglebutton, _func) {
        this.scene = _scene;
        this.pos = _pos;
        this.func = _func;

        this.colors = {
            out: LCARSCOLOR.offBlue,
            over: LCARSCOLOR.blue,
            on: LCARSCOLOR.orange
        }

        this.states = {
            out: 0,
            over: 1,
            on: 2
        }
        this.state = this.states.out;
        this.togglebutton = _togglebutton;
        this.active = false;
        
        this.sprite = this.scene.add.sprite(_pos.x, _pos.y, "sprLcarsPipLeft16");
        this.txt = this.scene.add.bitmapText(_pos.x, _pos.y, "pixelmix", _text, 8, 1).setOrigin(0, 0.5);
        let txtData = this.txt.getTextBounds().local;
        this.txtBounds = new Phaser.Geom.Rectangle(0, 0, txtData.width + 8, txtData.height + 4);
        
        this.colorInState(this.state);
    }

    update() {
        if (this.sprite.getBounds().contains(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY) || this.txtBounds.contains(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY)) {
            if (this.scene.hand.pressed === false) {
                if (this.active === false) {
                    this.switchState(this.states.over);
                } else {
                    this.switchState(this.states.on);
                }
            }
            if (this.scene.hand.justPressed === true) {
                if (this.active === true) {
                    this.switchState(this.states.over);
                } else {
                    this.switchState(this.states.on);
                }
            }
            if (this.scene.hand.justReleased === true) {
                if (this.togglebutton === true) {
                    if (this.active === false) {
                        this.active = true;
                        this.func();
                    } else {
                        this.active = false;
                    }
                } else {
                    this.func();
                }
            }
        } else {
            if (this.active === false) {
                this.switchState(this.states.out);
            } else {
                this.switchState(this.states.on);
            }
        }
    }

    simulateClick() {
        if (this.togglebutton === true) {
            if (this.active === false) {
                this.active = true;
                this.func();
            } else {
                this.active = false;
            }
        } else {
            this.func();
        }
    }

    switchState(_state) {
        if (this.state !== _state) {
            this.state = _state;
            this.colorInState(this.state);
        }
    }

    colorInState(_state) {
        switch (this.state) {
            case this.states.out:
                this.sprite.setTintFill(this.colors.out);
                break;
            case this.states.over:
                this.sprite.setTintFill(this.colors.over);
                break;
            case this.states.on:
                this.sprite.setTintFill(this.colors.on);
                break;
            default:
                break;
        }
    }

    move(_x, _y) {
        this.sprite.x = _x;
        this.sprite.y = _y;
        this.txt.x = _x + 16;
        this.txt.y = _y;
        this.txtBounds.x = this.txt.x - 4;
        this.txtBounds.y = this.txt.y + (this.txtBounds.height * -0.5);
    }

    destroy() {
        this.sprite.destroy();
        this.txt.destroy();
    }
}