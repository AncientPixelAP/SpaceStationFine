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

        this.btnRooms = [];
        for (let [i, r] of this.scene.locationData.rooms.entries()) {
            this.btnRooms.push(new ListButton(this.scene, {x: 0, y: 0}, r.name, false, () => {
                console.log("TODO: move to another room");
                this.scene.createStations(this.scene.locationData.rooms[i].stations);
            }));
        }
    }

    update() {
        for(let b of this.btnRooms){
            b.update();
        }
    }

    move() {
        for (let [i, b] of this.btnRooms.entries()) {
            b.move(this.pos.x - 168, this.pos.y - 116 + (i * 18))
        }
    }

    synchronize() {
        for(let r of this.scene.locationData.rooms){

        }
    }

    destroy() {
        for (let [i, b] of this.btnRooms.entries()) {
            b.destroy();
        }
    }
}