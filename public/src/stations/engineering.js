import Button from "../lcars/button.js";
import ListButton from "../lcars/listButton.js";
import { SliderHorizontal, SliderVertical } from "../lcars/slider.js";

export default class Engineering {
    constructor(_scene, _data) {
        this.scene = _scene;
        this.data = _data;

        this.pos = {
            x: 0,
            y: 0
        }

        this.systems = [];

        this.systemTxt = new ListButton(this.scene, {x: this.pos.x, y: this.pos.y}, "Systems", false, () => {});
        this.systemTxt.colors.out = LCARSCOLOR.offOrange;
        this.systemTxt.colorInState(this.systemTxt.states.out);
        this.powerTxt = this.scene.add.bitmapText(this.pos.x, this.pos.y, "pixelmix", "Power", 8, 1).setOrigin(0.5);
        this.integrityTxt = this.scene.add.bitmapText(this.pos.x, this.pos.y, "pixelmix", "Integrity", 8, 1).setOrigin(0.5);

        this.pips = [];
        this.pips.push(this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsPipLong64"));
        this.pips.push(this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsPipLong64"));
        this.pips.push(this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsPipLong32"));
        //this.pips.push(this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsPipRight16"));
        for(let p of this.pips){
            p.setTintFill(LCARSCOLOR.offOrange);
        }

        this.rightLTop = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL64").setScale(-1, -1);
        this.rightLTop.setTintFill(LCARSCOLOR.offOrange);
        this.rightLBot = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL64").setScale(-1, 1);
        this.rightLBot.setTintFill(LCARSCOLOR.offOrange);
        this.rightLMid = this.scene.add.graphics(0, 0);
    }

    update() {
        for(let s of this.systems){
            if(s.data.hp > 0){
                s.btn.update();
                if(s.btn.state === s.btn.states.over){
                    s.integrity.setTintFill(s.btn.colors.over);
                }else{
                    s.integrity.setTintFill(0xffffff);
                }
                s.slider.update();
                if (s.btn.colors.out !== LCARSCOLOR.offBlue) {
                    s.btn.colors.out = LCARSCOLOR.offBlue;
                    s.btn.colorInState(s.btn.states.out);
                }
            }else{
                if(s.btn.colors.out !== LCARSCOLOR.red){
                    s.btn.colors.out = LCARSCOLOR.red;
                    s.btn.colorInState(s.btn.states.out);
                }
            }
        }
    }

    move(){
        this.systemTxt.move(this.pos.x - 168, this.pos.y - 116);
        this.powerTxt.x = this.pos.x + 28;
        this.powerTxt.y = this.pos.y - 116;
        this.integrityTxt.x = this.pos.x + 140;
        this.integrityTxt.y = this.pos.y - 116;

        this.pips[0].x = this.pos.x - 70;
        this.pips[0].y = this.pos.y - 116;
        this.pips[1].x = this.pos.x - 37;
        this.pips[1].y = this.pos.y - 116;
        this.pips[2].x = this.pos.x + 69;
        this.pips[2].y = this.pos.y - 116;
        //this.pips[3].x = this.pos.x + 176;
        //this.pips[3].y = this.pos.y - 116;

        this.rightLTop.x = this.pos.x + 222;
        this.rightLTop.y = this.pos.y - 107;
        this.rightLBot.x = this.pos.x + 222;
        this.rightLBot.y = this.pos.y - 124 + (18 * this.systems.length - 1);
        this.rightLMid.clear();
        this.rightLMid.fillStyle(LCARSCOLOR.offOrange);
        this.rightLMid.fillRect(this.rightLTop.x, this.rightLTop.y - 8, 32, (18 * this.systems.length - 4));

        for(let [i, s] of this.systems.entries()){
            s.btn.move(this.pos.x - 168, this.pos.y - 98 + (18 * i));
            s.slider.move(this.pos.x + 32, this.pos.y - 98 + (18 * i));
            s.integrity.x = this.pos.x + 140;
            s.integrity.y = this.pos.y - 98 + (18 * i);
        }
    }

    synchronize(){
        for(let ls of this.scene.locationData.systems){
            let found = false;
            for(let s of this.systems){
                if(ls.name === s.data.name){
                    found = true;
                    s.data = ls;
                }
            }
            if(found === false){
                this.systems.push({
                    data: ls,
                    btn: new ListButton(this.scene, {x: this.pos.x, y: this.pos.y}, ls.name, false, () => {}),
                    slider: new SliderHorizontal(this.scene, {x: this.pos.x, y: this.pos.y}, ls.power, 106),
                    integrity: this.scene.add.bitmapText(this.pos.x, this.pos.y, "pixelmix", ls.power * 100 + "pct", 8, 1).setOrigin(0.5)
                });
            }
        }
    }

    destroy() {
        this.systemTxt.destroy();
        this.powerTxt.destroy();
        this.integrityTxt.destroy();

        this.rightLTop.destroy();
        this.rightLBot.destroy();
        this.rightLMid.destroy();

        for(let p of this.pips){
            p.destroy();
        }

        for(let s of this.systems){
            s.btn.destroy();
            s.slider.destroy();
            s.integrity.destroy();
        }
        this.systems = [];
    }
}