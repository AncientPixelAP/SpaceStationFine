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

        this.list = {
            locations: 0,
            options: 1
        }
        this.listview = this.list.locations;

        this.commRange = 2;
        this.commLocation = null;

        this.pipListNameLeft = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsPipLeft16");
        this.pipListNameLeft.setTintFill(LCARSCOLOR.offOrange);
        this.pipListNameRight = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsBtnRight32");
        this.pipListNameRight.setTintFill(LCARSCOLOR.offOrange);
        this.listNameTxt = this.scene.add.bitmapText(this.pos.x, this.pos.y, "pixelmix", "Locations", 8, 1).setOrigin(0, 0.5);

        this.locations = [];
        this.btnOptions = [];
        this.btnBack = new Button(this.scene, {x: this.pos.x, y: this.pos.y}, "sprLcarsBtnLong64", "BACK", false, () => {
            this.listview = this.list.locations;
            this.listNameTxt.setText("Locations");
        });

        this.answerTxt = this.scene.add.bitmapText(99990, 0, "pixelmix", "no answers yet", 8, 1).setOrigin(0);
        this.answerTxt.maxWidth = 128;
        this.answerTxt.setLeftAlign();

        this.btnAlert = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "ALERT", false, () => {
            if(this.scene.locationData.alert === true){
                this.scene.locationData.alert = false;
                socket.emit("setAlert", {
                    locationId: this.scene.locationData.id,
                    alert: false
                });
            }else{
                this.scene.locationData.alert = true;
                socket.emit("setAlert", {
                    locationId: this.scene.locationData.id,
                    alert: true
                });
            }
        });
    }

    update() {
        this.btnAlert.update();

        this.pipListNameRight.x = this.listNameTxt.x + this.listNameTxt.getTextBounds().local.width + 24;
        this.pipListNameRight.y = this.pos.y - 116;

        for (let [i, l] of this.locations.entries()) {
            l.btn.move(this.pos.x - 168, this.pos.y - 80 + (i * 18));
            l.btn.update();
        }

        if(this.listview === this.list.locations){
            for (let [i, l] of this.locations.entries()) {
                l.btn.move(this.pos.x - 168, this.pos.y - 80 + (i * 18));
                l.btn.update();
            }
            for (let [i, b] of this.btnOptions.entries()) {
                b.move(this.pos.x +1000, this.pos.y - 80 + (i * 18));
            }
            this.answerTxt.x = this.pos.x + 1000;
            this.answerTxt.y = this.pos.y;
            this.btnBack.move(this.pos.x +1000, this.pos.y - 80 + ((this.btnOptions.length+1) * 18));
        }else{
            for (let [i, l] of this.locations.entries()) {
                l.btn.move(this.pos.x + 1000, this.pos.y - 80 + (i * 18));
            }
            for (let [i, b] of this.btnOptions.entries()) {
                b.move(this.pos.x - 168, this.pos.y - 80 + (i * 18));
                b.update();
            }
            this.answerTxt.x = this.pos.x;
            this.answerTxt.y = this.pos.y - 84;
            this.btnBack.move(this.pos.x - 144, this.pos.y - 80 + ((this.btnOptions.length+1) * 18));
            this.btnBack.update();
        }
    }

    move(){
        this.btnAlert.move(this.pos.x + 222, this.pos.y - 116);

        this.pipListNameLeft.x = this.pos.x - 168;
        this.pipListNameLeft.y = this.pos.y - 116;
        this.listNameTxt.x = this.pos.x - 152;
        this.listNameTxt.y = this.pos.y - 116;
        this.pipListNameRight.x = this.listNameTxt.x + this.listNameTxt.getTextBounds().local.width + 24;
        this.pipListNameRight.y = this.pos.y - 116;

        if(this.listview === this.list.locations){
            for (let [i, l] of this.locations.entries()) {
                l.btn.move(this.pos.x - 168, this.pos.y - 80 + (i * 18));
            }
            for (let [i, b] of this.btnOptions.entries()) {
                b.move(this.pos.x +1000, this.pos.y - 80 + (i * 18));
            }
            this.answerTxt.x = this.pos.x + 1000;
            this.answerTxt.y = this.pos.y - 80;
            this.btnBack.move(this.pos.x +1000, this.pos.y - 80 + ((this.btnOptions.length+1) * 18));
        }else{
            for (let [i, l] of this.locations.entries()) {
                l.btn.move(this.pos.x +1000, this.pos.y - 80 + (i * 18));
            }
            for (let [i, b] of this.btnOptions.entries()) {
                b.move(this.pos.x - 168, this.pos.y - 80 + (i * 18));
            }
            this.answerTxt.x = this.pos.x;
            this.answerTxt.y = this.pos.y - 80;
            this.btnBack.move(this.pos.x - 144, this.pos.y - 80 + ((this.btnOptions.length+1) * 18));
        }
    }

    synchronize(){
        if (this.scene.sectorData !== null) {
            //refresh location lsit
            for (let ol of this.scene.sectorData.locations) {
                if(ol.id !== this.scene.locationData.id){
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
                        let talkable = false;
                        if (ol.type === ELOCATION.ship || ol.type === ELOCATION.shuttle || ol.type === ELOCATION.station || ol.type === ELOCATION.planet) {
                            if(ol.hidden === false){
                                talkable = true;
                            }
                        }
                        if(talkable === true){
                            this.locations.push({
                                data: ol,
                                btn: new ListButton(this.scene, { x: this.pos.x - 168, y: this.pos.y - 80 + (this.locations.length * 18) }, ol.id, false, () => {
                                    if(this.listview === this.list.locations){
                                        this.commLocation = ol;
                                        this.listview = this.list.options;
                                        this.listNameTxt.setText(ol.id);
                                        this.createOptions();
                                    }
                                })
                            });
                        }
                    }
                }
            }
        }
    }
    
    createOptions(){
        for(let b of this.btnOptions){
            b.destroy();
        }
        this.btnOptions = [];
        
        /*let talkable = false;
        if(this.commLocation.type === ELOCATION.ship || this.commLocation.type === ELOCATION.shuttle || this.commLocation.type === ELOCATION.station || this.commLocation.type === ELOCATION.planet){
            talkable = true;
        }
        let cargo = false;*/

        //HAILING
        this.btnOptions.push(new ListButton(this.scene, {x: this.pos.x, y: this.pos.y}, "hail", false, () => {
            this.answerTxt.setText("TODO hail location");
        }));
        if(this.commLocation.relation !== ERELATION.allied){
            this.btnOptions.push(new ListButton(this.scene, {x: this.pos.x, y: this.pos.y}, "intimidate", false, () => {
                this.answerTxt.setText("TODO threat location and get response depending on ally status");
            }));
        }else{
            this.btnOptions.push(new ListButton(this.scene, {x: this.pos.x, y: this.pos.y}, "any news?", false, () => {
                this.answerTxt.setText("TODO request news from location eg a quest or special sight");
            }));
        }
        if(this.commLocation.dockingPorts.length < this.commLocation.dockingPortsMax && this.scene.locationData.dockedAt === ""){
            this.btnOptions.push(new ListButton(this.scene, {x: this.pos.x, y: this.pos.y}, "request docking", false, () => {
                if(Phaser.Math.Distance.Between(this.scene.locationData.coords.x, this.scene.locationData.coords.y, this.commLocation.coords.x, this.commLocation.coords.y) <= this.commLocation.dockingRange){
                    let vx = (this.scene.locationData.coords.x - this.commLocation.coords.x).toFixed(2);
                    let vy = (this.scene.locationData.coords.y - this.commLocation.coords.y).toFixed(2);
                    this.answerTxt.setText("Docking granted!\n\nSet your docking computer to " + String(vx) + "," + String(vy));
                    //this.answerTxt.setText("Docking granted!\n\nWelcome aboard!");

                    socket.emit("dockAt", {
                        locationId: this.scene.locationData.id,
                        otherId:this.commLocation.id
                    });
                    this.clearOptions();
                }else{
                    let vx = (this.scene.locationData.coords.x + this.commLocation.coords.x).toFixed(2) * 100;
                    let vy = (this.scene.locationData.coords.y + this.commLocation.coords.y).toFixed(2) * 100;
                    this.answerTxt.setText("Move closer to dock!\n\nSet course to " + String(vx) + "," + String(vy));
                }
            }));
        }
        if(this.scene.locationData.dockedAt === this.commLocation.id){
            this.btnOptions.push(new ListButton(this.scene, { x: this.pos.x, y: this.pos.y }, "undock", false, () => {
                this.answerTxt.setText("Have a nice fly!");
                
                socket.emit("undockFrom", {
                    locationId: this.scene.locationData.id,
                    fromId: this.commLocation.id
                });
                this.clearOptions();
            }));
        }
        if(Phaser.Math.Distance.Between(this.scene.locationData.coords.x, this.scene.locationData.coords.y, this.commLocation.coords.x, this.commLocation.coords.y) <= this.commLocation.hangarRange){
            this.btnOptions.push(new ListButton(this.scene, {x: this.pos.x, y: this.pos.y}, "request landing", false, () => {
                this.answerTxt.setText("TODO request landing in hangar at location");
            }));
        }
    }

    clearOptions(){
        for (let b of this.btnOptions) {
            b.destroy();
        }
        this.btnOptions = [];
    }

    destroy() {
        this.btnAlert.destroy();

        this.pipListNameLeft.destroy();
        this.listNameTxt.destroy();
        this.pipListNameRight.destroy();

        for(let l of this.locations){
            l.btn.destroy();
        }
        this.locations = [];

        for(let b of this.btnOptions){
            b.destroy();
        }
        this.btnOptions = [];

        this.answerTxt.destroy();
    }
}