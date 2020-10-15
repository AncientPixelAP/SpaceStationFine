import Button from "../lcars/button.js";
import ListButton from "../lcars/listButton.js";

export default class Turbolift {
    constructor(_scene, _data) {
        this.scene = _scene;
        this.data = _data;

        this.pos = {
            x: 0,
            y: 0
        }

        this.pipRoomNameLeft = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsPipLeft16");
        this.pipRoomNameLeft.setTintFill(LCARSCOLOR.offOrange);
        this.pipRoomNameRight = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsBtnRight32");
        this.pipRoomNameRight.setTintFill(LCARSCOLOR.offOrange);
        this.roomNameTxt = this.scene.add.bitmapText(this.pos.x, this.pos.y, "pixelmix", "Rooomname", 8, 1).setOrigin(0, 0.5);
        
        this.blueprint = this.scene.add.sprite(this.pos.x, this.pos.y, this.scene.locationData.blueprint);

        this.listWidth = 0;

        this.btnRooms = [];
        for (let [i, r] of this.scene.locationData.rooms.entries()) {
            if(this.scene.currentRoom !== r){
                this.btnRooms.push(new ListButton(this.scene, {x: 0, y: 0}, r.name, false, () => {
                    this.scene.createRoom(this.scene.locationData.rooms[i]);
                }));
                //adjust listWidth if necessary
                let checkWidth = this.btnRooms[this.btnRooms.length - 1].txt.getTextBounds().local.width;
                if (checkWidth > this.listWidth){
                    this.listWidth = checkWidth;
                }
            }else{
                this.roomNameTxt.setText(r.name);
                //adjust listWidth if necessary
                let checkWidth = this.roomNameTxt.getTextBounds().local.width;
                if (checkWidth > this.listWidth) {
                    this.listWidth = checkWidth;
                }
            }
        }
    }

    update() {
        for(let b of this.btnRooms){
            b.update();
        }
    }

    move() {
        for (let [i, b] of this.btnRooms.entries()) {
            b.move(this.pos.x - 168, this.pos.y - 80 + (i * 18))
        }

        this.pipRoomNameLeft.x = this.pos.x - 168;
        this.pipRoomNameLeft.y = this.pos.y - 116;
        this.roomNameTxt.x = this.pos.x - 152;
        this.roomNameTxt.y = this.pos.y - 116;
        this.pipRoomNameRight.x = this.roomNameTxt.x + this.listWidth + 24;
        this.pipRoomNameRight.y = this.pos.y - 116;

        this.blueprint.x = this.pos.x;
        this.blueprint.y = this.pos.y + 64;
    }

    synchronize() {
        for(let r of this.scene.locationData.rooms){

        }
    }

    destroy() {
        for (let [i, b] of this.btnRooms.entries()) {
            b.destroy();
        }

        this.pipRoomNameLeft.destroy();
        this.pipRoomNameRight.destroy();
        this.roomNameTxt.destroy();
        this.blueprint.destroy();
    }
}