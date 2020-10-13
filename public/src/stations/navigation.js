import Button from "../lcars/button.js";

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
            this.setForInput(this.sectorXTxt);
        });
        this.sectorYTxt = new Button(this.scene, { x: 0, y: 0 }, "sprLcarsBtnLong48", this.sectorCoords.y, true, () => {
            this.setForInput(this.sectorYTxt);
        });
        this.sectorZTxt = new Button(this.scene, { x: 0, y: 0 }, "sprLcarsBtnLong48", this.sectorCoords.z, true, () => {
            this.setForInput(this.sectorZTxt);
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
            this.setForInput(this.headingXTxt);
        });
        this.headingYTxt = new Button(this.scene, { x: 0, y: 0 }, "sprLcarsBtnLong48", this.headingCoords.y, true, () => {
            this.setForInput(this.headingYTxt);
        });

        this.calculatorLTop = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL48").setScale(1, -1);
        this.calculatorLTop.setTintFill(LCARSCOLOR.offOrange);
        this.calculatorLBot = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL48");
        this.calculatorLBot.setTintFill(LCARSCOLOR.offOrange);
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
        this.calculatorInput = 0;
        this.currentField = null;
        this.currentCoord = "x"
        this.btnsHeading = [];
        for(let i = 0 ; i < 9 ; i++)
{           this.btnsHeading.push( new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnMono16", String(i+1), false, () => {
                let str = this.calculatorInput.toString();
                str += String(i+1);
                this.calculatorInput = parseInt(str);
                this.updateInput();
            }));
        }
        this.btnHeadingZero = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnMono16", "0", false, () => {
            let str = this.calculatorInput.toString();
            str += "0";
            this.calculatorInput = parseInt(str);
            this.updateInput();
        });
        this.btnHeadingPoint = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnMono16", ",", false, () => {
            /*if(this.currentCoord === "x"){
                this.headingCoords.x = this.calculatorInput;
                this.calculatorInput = 0;
                this.currentCoord = "y";
            }else{
                this.headingCoords.y = this.calculatorInput;
                this.calculatorInput = 0;
                this.currentCoord = "x";
            }*/
        });
        this.btnHeadingDelete = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnMono16", "C", false, () => {
            this.headingCoords.x = 0;
            this.headingCoords.y = 0;
            this.headingCoords.z = 0;
            this.calculatorInput = 0;
        });
        this.btnHeadingNegate = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnRight48", "NEG", false, () => {
            this.calculatorInput *= -1;
            this.updateInput();
        });
        this.btnHeadingBackspace = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnRight48", "DEL", false, () => {
            let str = this.calculatorInput.toString();
            if(str.length > 1){
                str = str.slice(0, str.length-1);
                if(str === "-"){
                    str = "0";
                }
            }else{
                str = "0";
            }
            this.calculatorInput = parseInt(str);
            this.updateInput();
        });
        this.btnHeadingSetHeading = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnRight48", "SET", false, () => {
            this.heading = Phaser.Math.Angle.Between(0, 0, this.headingCoords.x, this.headingCoords.y);
            this.setCourse();
            this.calculatorInput = 0;
        });
        this.btnHeadingClear = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnRight48", "CLR", false, () => {
            this.headingCoords.x = 0;
            this.headingCoords.y = 0;
            this.headingCoords.z = 0;
            this.calculatorInput = 0;
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

        for(let b of this.btnsHeading){
            b.update();
        }
        this.btnHeadingZero.update();
        this.btnHeadingPoint.update();
        this.btnHeadingDelete.update();
        this.btnHeadingNegate.update();
        this.btnHeadingBackspace.update();
        this.btnHeadingSetHeading.update();
        this.btnHeadingClear.update();

        this.headingXTxt.txt.setText(this.headingCoords.x);
        this.headingYTxt.txt.setText(this.headingCoords.y);
        this.headingXTxt.update();
        this.headingYTxt.update();
        this.headingTxt.setText(this.heading.toFixed(3));
        this.headingCoordsTxt.setText(String(this.headingCoords.x) + "," + String(this.headingCoords.y));

        this.simpleHeading.setRotation(this.scene.locationData.heading);
    }

    move(){
        this.btnsImpulse[0].move(this.pos.x + 222, this.pos.y - 8);
        this.btnsImpulse[1].move(this.pos.x + 222, this.pos.y - 26);
        this.btnsImpulse[2].move(this.pos.x + 222, this.pos.y - 44);
        this.btnsImpulse[3].move(this.pos.x + 222, this.pos.y - 62);
        this.btnsImpulse[4].move(this.pos.x + 222, this.pos.y - 80);

        this.btnWarp.move(this.pos.x + 222, this.pos.y - 116);
        this.pipWarpLeft.x = this.pos.x - 110;
        this.pipWarpLeft.y = this.pos.y -116;
        this.pipWarpRight.x = this.pos.x + 134;
        this.pipWarpRight.y = this.pos.y -116;
        this.sectorXTxt.move(this.pos.x - 28, this.pos.y - 116);
        this.sectorYTxt.move(this.pos.x + 30, this.pos.y - 116);
        this.sectorZTxt.move(this.pos.x + 80, this.pos.y - 116);

        for(let [i, b] of this.btnsHeading.entries()){
            let xx = 18 * (i%3);
            let yy = 18 * (Math.floor(i/3));
            b.move(this.pos.x + xx + 64, this.pos.y - yy - 26);
        }
        this.btnHeadingZero.move(this.pos.x + 64, this.pos.y - 8);
        this.btnHeadingPoint.move(this.pos.x + 82, this.pos.y - 8);
        this.btnHeadingDelete.move(this.pos.x + 100, this.pos.y - 8);
        this.btnHeadingBackspace.move(this.pos.x + 134, this.pos.y - 62);
        this.btnHeadingNegate.move(this.pos.x + 134, this.pos.y - 44);
        this.btnHeadingClear.move(this.pos.x + 134, this.pos.y - 26);
        this.btnHeadingSetHeading.move(this.pos.x + 134, this.pos.y - 8); 

        this.pipHeadingLeft.x = this.pos.x - 94;
        this.pipHeadingLeft.y = this.pos.y - 89;
        this.pipHeadingRight.x = this.pos.x + 134;
        this.pipHeadingRight.y = this.pos.y - 80;

        this.calculatorLTop.x = this.pos.x + 30;
        this.calculatorLTop.y = this.pos.y - 53;
        this.calculatorLBot.x = this.pos.x + 30;
        this.calculatorLBot.y = this.pos.y - 17;
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

        this.headingCoordsTxt.x = this.pos.x + 80;
        this.headingCoordsTxt.y = this.pos.y - 98;
    }

    setCourse(){
        socket.emit("setCourse", {
            id: this.scene.locationData.id,
            spd: this.spd,
            impulseFactor: this.impulseFactor,
            heading: this.heading,
            headingCoords: this.headingCoords
        });
    }

    setForInput(_button){
        this.currentField = _button;
        if(this.sectorXTxt !== _button){
            this.sectorXTxt.active = false;
        }else{
            this.calculatorInput = this.sectorCoords.x;
        }
        if (this.sectorYTxt !== _button) {
            this.sectorYTxt.active = false;
        } else {
            this.calculatorInput = this.sectorCoords.y;
        }
        if (this.sectorZTxt !== _button) {
            this.sectorZTxt.active = false;
        } else {
            this.calculatorInput = this.sectorCoords.z;
        }

        if (this.headingXTxt !== _button) {
            this.headingXTxt.active = false;
        } else {
            this.calculatorInput = this.headingCoords.x;
        }
        if (this.headingYTxt !== _button) {
            this.headingYTxt.active = false;
        } else {
            this.calculatorInput = this.headingCoords.y;
        }
    }

    updateInput(){
        switch(this.currentField){
            case this.sectorXTxt:
                this.sectorCoords.x = this.calculatorInput;
            break;
            case this.sectorYTxt:
                this.sectorCoords.y = this.calculatorInput;
            break;
            case this.sectorZTxt:
                this.sectorCoords.z = this.calculatorInput;
            break;
            case this.headingXTxt:
                this.headingCoords.x = this.calculatorInput;
            break;
            case this.headingYTxt:
                this.headingCoords.y = this.calculatorInput;
            break;
            default:
            break;
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
        this.sectorCoords.x = this.scene.locationData.sector.x;
        this.sectorCoords.y = this.scene.locationData.sector.y;
        this.sectorCoords.z = this.scene.locationData.sector.z;
        if(this.headingXTxt.active === false){
            this.headingCoords.x = this.scene.locationData.headingCoords.x;
        }
        if (this.headingYTxt.active === false) {
            this.headingCoords.y = this.scene.locationData.headingCoords.y;
        }
        this.headingCoords.z = this.scene.locationData.headingCoords.z;
    }
}