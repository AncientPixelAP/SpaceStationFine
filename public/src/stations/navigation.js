import Button from "../lcars/button.js";
import Numpad from "../lcars/numpad.js";
import ListButton from "../lcars/listButton.js";

export default class Navigation{
    constructor(_scene, _data) {
        this.scene = _scene;
        this.data = _data;

        this.pos = {
            x: 0,
            y: 0
        }

        this.heading = 0;
        this.spd = 0;
        this.impulseFactor = 0;
        this.warping = false;
        this.headingTxt = this.scene.add.bitmapText(0, -100, "pixelmix", this.heading, 8, 1).setOrigin(0.5);

        //IMPULSE
        this.btnsImpulse = [];
        this.btnsImpulse.push( new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "STOP", true, () => {
            for(let [i, b] of this.btnsImpulse.entries()){
                if(i !== 0){b.active = false;}
            }
            this.spd = 0;
            this.impulseFactor = 0;
            this.setCourse();
        }));
        this.btnsImpulse.push( new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "1/4", true, () => {
            for (let [i, b] of this.btnsImpulse.entries()) {
                if (i !== 1) { b.active = false; }
            }
            this.spd = 0.0025;
            this.impulseFactor = 0.25;
            this.setCourse();
        }));
        this.btnsImpulse.push( new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "2/4", true, () => {
            for (let [i, b] of this.btnsImpulse.entries()) {
                if (i !== 2) { b.active = false; }
            }
            this.spd = 0.005;
            this.impulseFactor = 0.5;
            this.setCourse();
        }));
        this.btnsImpulse.push( new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "3/4", true, () => {
            for (let [i, b] of this.btnsImpulse.entries()) {
                if (i !== 3) { b.active = false; }
            }
            this.spd = 0.0075;
            this.impulseFactor = 0.75;
            this.setCourse();
        }));
        this.btnsImpulse.push( new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "FULL", true, () => {
            for (let [i, b] of this.btnsImpulse.entries()) {
                if (i !== 4) { b.active = false; }
            }
            this.spd = 0.01;
            this.impulseFactor = 1;
            this.setCourse();
        }));

        //WARPING
        this.btnWarp = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "WARP", false, () => {
            console.log("warping");
            /*socket.emit("setWarp", {
                id: this.scene.locationData.id
            });*/
        });
        this.sectorCoords = {
            x: 0,
            y: 0,
            z: 0
        }
        this.pipWarpLeft = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsBtnLeft32");
        this.pipWarpLeft.setTintFill(LCARSCOLOR.offOrange);
        this.pipWarpRight = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsBtnRight48");
        this.pipWarpRight.setTintFill(LCARSCOLOR.offOrange);
        this.sectorXTxt = new Button(this.scene, { x: 0, y: 0 }, "sprLcarsBtnLong64", this.sectorCoords.x, true, () => {
            this.numpad.setForInput(this.sectorXTxt, this.sectorCoords.x);
        });
        this.sectorYTxt = new Button(this.scene, { x: 0, y: 0 }, "sprLcarsBtnLong48", this.sectorCoords.y, true, () => {
            this.numpad.setForInput(this.sectorYTxt, this.sectorCoords.y);
        });
        this.sectorZTxt = new Button(this.scene, { x: 0, y: 0 }, "sprLcarsBtnLong48", this.sectorCoords.z, true, () => {
            this.numpad.setForInput(this.sectorZTxt, this.sectorCoords.z);
        });

        //HEADING
        this.headingCoords = {
            x: 0,
            y: 0,
            z: 0
        }
        this.pipHeadingLeft = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL64");
        this.pipHeadingLeft.setTintFill(LCARSCOLOR.offOrange);
        this.pipHeadingRight = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsBtnRight48");
        this.pipHeadingRight.setTintFill(LCARSCOLOR.offOrange);
        this.headingXTxt = new Button(this.scene, {x: 0, y: 0}, "sprLcarsBtnLong64", this.headingCoords.x, true, () => {
            this.numpad.setForInput(this.headingXTxt, this.headingCoords.x);
            this.headingYTxt.active = false;
        });
        this.headingYTxt = new Button(this.scene, { x: 0, y: 0 }, "sprLcarsBtnLong48", this.headingCoords.y, true, () => {
            this.numpad.setForInput(this.headingYTxt, this.headingCoords.y);
            this.headingXTxt.active = false;
        });

        this.numpad = new Numpad(this.scene, {x: this.pos.x, y: this.pos.y});
        this.numpad.setFunc = () => {
            this.heading = Phaser.Math.Angle.Between(0, 0, this.headingCoords.x, this.headingCoords.y);
            this.setCourse();
        };
        this.numpad.clrFunc = () => {
            this.headingCoords.x = 0;
            this.headingCoords.y = 0;
            this.headingCoords.z = 0;
        }
        this.numpad.pointFunc = () => {
            this.numpad.setFunc();
            if(this.headingXTxt.active === true){
                this.headingXTxt.active = false;
                this.headingYTxt.simulateClick();
            }else{
                this.headingYTxt.active = false;
                this.headingXTxt.simulateClick();
            }
        }

        this.headingLTopR = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL64").setScale(-1, -1);
        this.headingLTopR.setTintFill(LCARSCOLOR.gold);
        this.headingLTopL = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL64").setScale(1, -1);
        this.headingLTopL.setTintFill(LCARSCOLOR.gold);
        this.headingLBotR = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL64").setScale(-1, 1);
        this.headingLBotR.setTintFill(LCARSCOLOR.gold);
        this.headingLBotL = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL64").setScale(1, 1);
        this.headingLBotL.setTintFill(LCARSCOLOR.gold);

        this.simpleHeading = this.scene.add.sprite(this.pos.x, this.pos.y, "sprPinkSimpleHeading01");

        this.headingCoordsTxt = this.scene.add.bitmapText(0, 0, "pixelmix", this.heading, 8, 1).setOrigin(0.5);
        this.currentCoord = "x"

        //DOCKING
        this.dockedTxt = new ListButton(this.scene, {x: this.pos.x, y: this.pos.y}, "docked Location", false, () => {});
        this.btnDock = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "DOCK", false, () => {
            if(this.scene.locationData.docketAt !== ""){
                socket.emit("undockFrom", {
                    locationId: this.scene.locationData.id,
                    fromId: this.scene.locationData.dockedAt
                })
            }
        });
        
    }

    update(){
        for(let b of this.btnsImpulse){
            b.update();
        }
        
        this.btnWarp.update();
        this.sectorXTxt.txt.setText(this.sectorCoords.x);
        this.sectorYTxt.txt.setText(this.sectorCoords.y);
        this.sectorZTxt.txt.setText(this.sectorCoords.z);
        this.sectorXTxt.update();
        this.sectorYTxt.update();
        this.sectorZTxt.update();

        this.numpad.update();
        switch (this.numpad.currentField) {
            case this.sectorXTxt:
                this.sectorCoords.x = this.numpad.input;
                break;
            case this.sectorYTxt:
                this.sectorCoords.y = this.numpad.input;
                break;
            case this.sectorZTxt:
                this.sectorCoords.z = this.numpad.input;
                break;
            case this.headingXTxt:
                this.headingCoords.x = this.numpad.input;
                break;
            case this.headingYTxt:
                this.headingCoords.y = this.numpad.input;
                break;
            default:
                break;
        }

        this.headingXTxt.txt.setText(this.headingCoords.x);
        this.headingYTxt.txt.setText(this.headingCoords.y);
        this.headingXTxt.update();
        this.headingYTxt.update();
        this.headingTxt.setText(this.heading.toFixed(3));
        this.headingCoordsTxt.setText(String(this.headingCoords.x) + "," + String(this.headingCoords.y));

        this.simpleHeading.setRotation(this.scene.locationData.heading);

        if (this.scene.locationData.dockedAt !== "") {
            this.dockedTxt.move(this.pos.x + 62, this.pos.y + 28);
            this.dockedTxt.txt.setText(this.scene.locationData.dockedAt);
            this.btnDock.txt.setText("UNDOCK");
            this.btnDock.update();
        } else {
            this.dockedTxt.move(this.pos.x + 1000, this.pos.y);
            this.btnDock.txt.setText("");
        }
    }

    move(){
        this.btnsImpulse[0].move(this.pos.x + 222, this.pos.y - 8);
        this.btnsImpulse[1].move(this.pos.x + 222, this.pos.y - 26);
        this.btnsImpulse[2].move(this.pos.x + 222, this.pos.y - 44);
        this.btnsImpulse[3].move(this.pos.x + 222, this.pos.y - 62);
        this.btnsImpulse[4].move(this.pos.x + 222, this.pos.y - 80);

        //this.dockedTxt.move(this.pos.x + 222 - this.dockedTxt.txt.getTextBounds().local.width - 64, this.pos.y + 28);
        this.dockedTxt.move(this.pos.x + 62, this.pos.y + 28);
        this.btnDock.move(this.pos.x + 222, this.pos.y + 28);

        this.btnWarp.move(this.pos.x + 222, this.pos.y - 116);
        this.pipWarpLeft.x = this.pos.x - 110;
        this.pipWarpLeft.y = this.pos.y -116;
        this.pipWarpRight.x = this.pos.x + 134;
        this.pipWarpRight.y = this.pos.y -116;
        this.sectorXTxt.move(this.pos.x - 28, this.pos.y - 116);
        this.sectorYTxt.move(this.pos.x + 30, this.pos.y - 116);
        this.sectorZTxt.move(this.pos.x + 80, this.pos.y - 116);

        this.numpad.move(this.pos.x + 82, this.pos.y - 44);

        this.pipHeadingLeft.x = this.pos.x - 94;
        this.pipHeadingLeft.y = this.pos.y - 89;
        this.pipHeadingRight.x = this.pos.x + 134;
        this.pipHeadingRight.y = this.pos.y - 80;

        this.headingLTopR.x = this.pos.x - 28;
        this.headingLTopR.y = this.pos.y - 53;
        this.headingLTopL.x = this.pos.x - 94;
        this.headingLTopL.y = this.pos.y - 53;
        this.headingLBotR.x = this.pos.x - 28;
        this.headingLBotR.y = this.pos.y - 17;
        this.headingLBotL.x = this.pos.x - 94;
        this.headingLBotL.y = this.pos.y - 17;

        this.simpleHeading.x = this.pos.x - 62;
        this.simpleHeading.y = this.pos.y - 35;

        this.headingXTxt.move(this.pos.x - 28, this.pos.y - 80);
        this.headingYTxt.move(this.pos.x + 30, this.pos.y - 80);

        this.headingTxt.x = this.pos.x + 80;
        this.headingTxt.y = this.pos.y - 80;

        this.headingCoordsTxt.x = this.pos.x - 62;
        this.headingCoordsTxt.y = this.pos.y - 35;
    }

    setCourse(){
        if (this.scene.locationData.dockedAt === ""){ 
            socket.emit("setCourse", {
                id: this.scene.locationData.id,
                spd: this.spd,
                impulseFactor: this.impulseFactor,
                heading: this.heading,
                headingCoords: this.headingCoords
            });
        }else{
            this.btnsImpulse[0].simulateClick();
        }
    }

    synchronize(){
        this.heading = this.scene.locationData.heading;
        this.impulseFactor = this.scene.locationData.impulseFactor;
        for(let b of this.btnsImpulse){
            b.active = false;
        }
        switch(this.impulseFactor){
            case 0:
                this.btnsImpulse[0].active = true;
            break;
            case 0.25:
                this.btnsImpulse[1].active = true;
            break;
            case 0.5:
                this.btnsImpulse[2].active = true;
            break;
            case 0.75:
                this.btnsImpulse[3].active = true;
            break;
            case 1:
                this.btnsImpulse[4].active = true;
            break;
            default:
            break;
        }
        this.spd = this.scene.locationData.spd;
        this.warping = this.scene.locationData.warping;
        this.sectorCoords.x = this.scene.locationData.sectorCoords.x;
        this.sectorCoords.y = this.scene.locationData.sectorCoords.y;
        this.sectorCoords.z = this.scene.locationData.sectorCoords.z;
        if(this.headingXTxt.active === false){
            this.headingCoords.x = this.scene.locationData.headingCoords.x;
        }
        if (this.headingYTxt.active === false) {
            this.headingCoords.y = this.scene.locationData.headingCoords.y;
        }
        this.headingCoords.z = this.scene.locationData.headingCoords.z;
    }

    destroy() {
        this.btnsImpulse[0].destroy();
        this.btnsImpulse[1].destroy();
        this.btnsImpulse[2].destroy();
        this.btnsImpulse[3].destroy();
        this.btnsImpulse[4].destroy();

        this.btnWarp.destroy();
        this.pipWarpLeft.destroy();
        this.pipWarpRight.destroy();
        this.sectorXTxt.destroy();
        this.sectorYTxt.destroy();
        this.sectorZTxt.destroy();

        this.numpad.destroy();

        this.pipHeadingLeft.destroy();
        this.pipHeadingRight.destroy();

        this.headingLTopR.destroy();
        this.headingLTopL.destroy();
        this.headingLBotR.destroy();
        this.headingLBotL.destroy();

        this.simpleHeading.destroy();

        this.headingXTxt.destroy();
        this.headingYTxt.destroy();

        this.headingTxt.destroy();

        this.headingCoordsTxt.destroy();
    }
}