import Button from "../lcars/button.js";
import ListButton from "../lcars/listButton.js";

export default class Communications {
    constructor(_scene, _data) {
        this.scene = _scene;
        this.data = _data;

        this.pos = {
            x: 0,
            y: 0
        }

        this.commRange = 2;

        this.pipListNameLeft = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsPipLeft16");
        this.pipListNameLeft.setTintFill(LCARSCOLOR.offOrange);
        this.pipListNameRight = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsBtnRight32");
        this.pipListNameRight.setTintFill(LCARSCOLOR.offOrange);
        this.listNameTxt = this.scene.add.bitmapText(this.pos.x, this.pos.y, "pixelmix", "Locations", 8, 1).setOrigin(0, 0.5);

        this.locations = [];
    }

    update() {
        for (let [i, l] of this.locations.entries()) {
            l.btn.move(this.pos.x - 168, this.pos.y - 80 + (i * 18));
            l.btn.update();
        }
    }

    move(){
        this.pipListNameLeft.x = this.pos.x - 168;
        this.pipListNameLeft.y = this.pos.y - 116;
        this.listNameTxt.x = this.pos.x - 152;
        this.listNameTxt.y = this.pos.y - 116;
        this.pipListNameRight.x = this.listNameTxt.x + this.listNameTxt.getTextBounds().local.width + 24;
        this.pipListNameRight.y = this.pos.y - 116;

        for (let [i, l] of this.locations.entries()) {
            l.btn.move(this.pos.x - 168, this.pos.y - 80 + (i * 18));
        }
    }

    synchronize(){
        if (this.scene.sectorData !== null) {
            //refresh location lsit
            for (let ol of this.scene.sectorData.locations) {
                let found = false;
                for (let i = this.locations.length - 1; i >= 0; i--) {
                    if (ol.id === this.locations[i].data.id) {
                        this.locations[i].data = ol;
                        found = true;
                    }
                    if (Phaser.Math.Distance.Between(this.scene.locationData.coords.x, this.scene.locationData.coords.y, this.locations[i].data.coords.x, this.locations[i].data.coords.y) > this.commRange) {
                        this.locations[i].btn.destroy();
                        this.locations.splice(i, 1);
                    }
                }
                if (found === false && Phaser.Math.Distance.Between(this.scene.locationData.coords.x, this.scene.locationData.coords.y, ol.coords.x, ol.coords.y) <= this.commRange) {
                    this.locations.push({
                        data: ol,
                        btn: new ListButton(this.scene, { x: this.pos.x - 168, y: this.pos.y - 80 + (this.locations.length * 18) }, ol.id, false, () => {
                            
                        })
                    });
                }
            }
        }
    }

    destroy() {
        this.pipListNameLeft.destroy();
        this.listNameTxt.destroy();
        this.pipListNameRight.destroy();

        for(let l of this.locations){
            l.btn.destroy();
        }
        this.locations = [];
    }
}