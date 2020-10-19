import Button from "../lcars/button.js";
import ListButton from "../lcars/listButton.js";

export default class Airlock {
    constructor(_scene, _data) {
        this.scene = _scene;
        this.data = _data;

        this.pos = {
            x: 0,
            y: 0
        }

        this.pipDockedNameLeft = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsPipLeft16");
        this.pipDockedNameLeft.setTintFill(LCARSCOLOR.offOrange);
        this.pipDockedNameRight = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsBtnRight32");
        this.pipDockedNameRight.setTintFill(LCARSCOLOR.offOrange);
        this.dockedNameTxt = this.scene.add.bitmapText(this.pos.x, this.pos.y, "pixelmix", "Docking Ports", 8, 1).setOrigin(0, 0.5);

        this.listWidth = this.dockedNameTxt.getTextBounds().local.width;

        this.btnFake = new Button(this.scene, {x: this.pos.x, y: this.pos.y}, "sprLcarsBtnLong64", "", false, () => {});
        this.btnFake.colors.out = LCARSCOLOR.offOrange;
        this.btnFake.colorInState(this.btnFake.states.out);

        this.btnUndock = [];
        this.btnDocked = [];
    }

    update() {
        for (let [i, b] of this.btnDocked.entries()) {
            b.move(this.pos.x - 168, this.pos.y - 80 + (i * 18));
            b.update();

            this.btnUndock[i].move(this.dockedNameTxt.x + this.listWidth + 24 + 64, this.pos.y - 80 + (i * 18));
            this.btnUndock[i].update();
        }
    }

    move() {
        this.pipDockedNameLeft.x = this.pos.x - 168;
        this.pipDockedNameLeft.y = this.pos.y - 116;
        this.dockedNameTxt.x = this.pos.x - 152;
        this.dockedNameTxt.y = this.pos.y - 116;
        this.pipDockedNameRight.x = this.dockedNameTxt.x + this.listWidth + 24;
        this.pipDockedNameRight.y = this.pos.y - 116;

        for (let [i, b] of this.btnDocked.entries()) {
            b.move(this.pos.x - 168, this.pos.y - 80 + (i * 18));
            this.btnUndock[i].move(this.dockedNameTxt.x + this.listWidth + 24 + 64, this.pos.y - 80 + (i * 18));
            //this.btnUndock[i].move(this.pos.x + 222, this.pos.y - 80 + (i * 18));
        }
        this.btnFake.move(this.pos.x + 222, this.pos.y - 116);
    }

    synchronize() {
        //remove all unavailable locations from the list
        for(let i = this.btnDocked.length-1 ; i >= 0 ; i--){
            let found = false;
            for(let d of this.scene.locationData.dockingPorts){
                if(d.id === this.btnDocked[i].txt.text){
                    found = true;
                }
            }
            if (this.scene.locationData.dockedAt === this.btnDocked[i].txt.text){
                found = true;
            }
            if(found === false){
                this.btnDocked[i].destroy();
                this.btnUndock[i].destroy();
                this.btnDocked.splice(i, 1);
                this.btnUndock.splice(i, 1);
            }
        }

        //add new locations to the list
        for (let [i, d] of this.scene.locationData.dockingPorts.entries()) {
            let found = false;
            for(let b of this.btnDocked){
                if(b.txt.text === d.id){
                    found = true;
                }
            }
            if(found === false){
                this.btnDocked.push(new ListButton(this.scene, { x: 1000, y: 0 }, d.id, false, () => {
                    socket.emit("movePlayer", {
                        playerId: this.scene.playerData.id,
                        locationId: d.id
                    });
                }));
                this.btnUndock.push(new Button(this.scene, { x: 1000, y: 0 }, "sprLcarsBtnLong64", "UNDOCK", false, () => {
                    socket.emit("undockFrom", {
                        locationId: d.id,
                        fromId: this.scene.locationData.id
                    })
                }));
                //adjust listWidth if necessary
                let checkWidth = this.btnDocked[this.btnDocked.length - 1].txt.getTextBounds().local.width;
                if (checkWidth > this.listWidth) {
                    this.listWidth = checkWidth;
                }
            }
        }
        if (this.scene.locationData.dockedAt !== "") {
            let found = false;
            for (let b of this.btnDocked) {
                if (b.txt.text === this.scene.locationData.dockedAt) {
                    found = true;
                }
            }
            if(found === false){
                this.btnDocked.push(new ListButton(this.scene, { x: 1000, y: 0 }, this.scene.locationData.dockedAt, false, () => {
                    socket.emit("beamPlayer", {
                        playerId: this.scene.playerData.id,
                        locationId: this.scene.locationData.dockedAt
                    });
                }));
                this.btnUndock.push(new Button(this.scene, { x: 1000, y: 0 }, "sprLcarsBtnLong64", "UNDOCK", false, () => {
                    socket.emit("undockFrom", {
                        locationId: this.scene.locationData.id,
                        fromId: this.scene.locationData.dockedAt
                    })
                }));
                //adjust listWidth if necessary
                let checkWidth = this.btnDocked[this.btnDocked.length - 1].txt.getTextBounds().local.width;
                if (checkWidth > this.listWidth) {
                    this.listWidth = checkWidth;
                }
            }
        }
    }

    destroy() {
        for (let b of this.btnDocked) {
            b.destroy();
        }
        for(let b of this.btnUndock){
            b.destroy();
        }
        this.btnFake.destroy();

        this.pipDockedNameLeft.destroy();
        this.pipDockedNameRight.destroy();
        this.dockedNameTxt.destroy();
    }
}