import Button from "../lcars/button.js";
import Numpad from "../lcars/numpad.js";
import CrossPad from "../lcars/crossPad.js";
import ListButton from "../lcars/listButton.js";
import { SliderVertical } from "../lcars/slider.js";

export default class Transporter {
    constructor(_scene, _data) {
        this.scene = _scene;
        this.data = _data;

        this.pos = {
            x: 0,
            y: 0
        }

        this.beamRange = 0.22;
        this.beamRangeMax = 0.22;

        this.pipListNameLeft = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsPipLeft16");
        this.pipListNameLeft.setTintFill(LCARSCOLOR.offOrange);
        this.pipListNameRight = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsBtnRight32");
        this.pipListNameRight.setTintFill(LCARSCOLOR.offOrange);
        this.listNameTxt = this.scene.add.bitmapText(this.pos.x, this.pos.y, "pixelmix", "Locations", 8, 1).setOrigin(0, 0.5);

        this.list = {
            locations: 0,
            players: 1
        }
        this.listview = this.list.locations;
        this.showDestinations = false;

        this.lastPlayer = null;
        this.lastDestination = null;

        this.btnBack = new Button(this.scene, {x: this.pos.x, y: this.pos.y}, "sprLcarsBtnLong64", "BACK", false, () => {
            this.listview = this.list.locations;
            for(let d of this.destinations){
                d.btn.destroy();
            }
            this.destinations = [];
            for (let p of this.players) {
                p.btn.destroy();
            }
            this.players = [];
            this.listNameTxt.setText("Locations");
        });

        this.locations = [];
        this.destinations = [];
        this.players = [];
        socket.on("getPlayersAtLocation", (_data) => {
            //remove old images
            for(let p of this.players){
                p.btn.destroy();
            }
            this.players = [];
            //fill new players
            for(let [i, p] of _data.entries()){
                //x: this.pos.x - 168, y: this.pos.y - 80 + (i * 18)
                this.players.push({
                    data: p,
                    btn: new ListButton(this.scene, { x: this.pos.x - 64, y: this.pos.y - 80 + (i * 18) }, p.name, true, () => {
                        this.showDestinations = true;
                        this.lastPlayer = p;
                    })
                });
                
            }
        });

        this.btnScanSector = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "LIST", false, () => {
            socket.emit("requestPlayersAtLocation", {
                id: this.scene.locationData.id
            });
        });
        this.btnTest = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "TEST", false, () => {
            
        });

        //HEADING fo transporter beam
        this.headingCoords = {
            x: 0,
            y: 0,
            z: 0
        }
        this.headingXTxt = new Button(this.scene, { x: 0, y: 0 }, "sprLcarsBtnLong48", this.headingCoords.x, true, () => {
            this.crossPad.setForInput(this.headingXTxt, this.headingCoords.x);
            this.headingYTxt.active = false;
        });
        this.headingYTxt = new Button(this.scene, { x: 0, y: 0 }, "sprLcarsBtnLong48", this.headingCoords.y, true, () => {
            this.crossPad.setForInput(this.headingYTxt, this.headingCoords.y);
            this.headingXTxt.active = false;
        });
        this.rangeTxt = new Button(this.scene, { x: 0, y: 0 }, "sprLcarsBtnLong48", "RNG", false, () => {
            
        });
        this.intensityTxt = new Button(this.scene, { x: 0, y: 0 }, "sprLcarsBtnLong48", this.beamRange, false, () => {

        });

        this.crossPad = new CrossPad(this.scene, {x: 0, y: 0});
        /*this.crossPad.setFunc = () => {
            this.heading = Phaser.Math.Angle.Between(0, 0, this.headingCoords.x, this.headingCoords.y);
            this.setCourse();
        };
        this.crossPad.clrFunc = () => {
            this.headingCoords.x = 0;
            this.headingCoords.y = 0;
            this.headingCoords.z = 0;
        }
        this.crossPad.pointFunc = () => {
            this.crossPad.setFunc();
            if (this.headingXTxt.active === true) {
                this.headingXTxt.active = false;
                this.headingYTxt.simulateClick();
            } else {
                this.headingYTxt.active = false;
                this.headingXTxt.simulateClick();
            }
        }*/

        this.slider = new SliderVertical(this.scene, {x: this.pos.x, y: this.pos.y}, 0, 106);
        this.slider.autoReturn = true;
        this.slider.maxFunc = () => {
            if((this.lastPlayer !== null && this.lastDestination !== null) && this.listview === this.list.players){
                if (Phaser.Math.Distance.Between(this.beamAlignTarget.outerX.x, 0, this.beamAlignTarget.innerX.x, 0) < 1 && Phaser.Math.Distance.Between(0, this.beamAlignTarget.outerY.y, 0, this.beamAlignTarget.innerY.y) < 1){
                    this.btnBack.simulateClick();
                    console.log(this.lastPlayer.id + " > " + this.lastDestination.id);
                    socket.emit("beamPlayer", {
                        playerId: this.lastPlayer.id,
                        locationId: this.lastDestination.id
                    });
                }
            }
        }

        this.sliderIntensity = new SliderVertical(this.scene, { x: this.pos.x, y: this.pos.y }, 1, 106);
        this.sliderIntensity.releaseFunc = () => {
            this.beamRange = (this.beamRangeMax * this.sliderIntensity.value);
            this.intensityTxt.txt.setText(this.beamRange.toFixed(2));
        }
        this.sliderIntensity.changeFunc = () => {
            this.beamRange = (this.beamRangeMax * this.sliderIntensity.value);
            this.intensityTxt.txt.setText(this.beamRange.toFixed(2));
        }

        this.beamAlignBase = this.scene.add.sprite(this.pos.x, this.pos.y, "sprBlueRect52");
        this.beamAlignTarget = {
            outerX: this.scene.add.sprite(this.pos.x, this.pos.y, "sprBeamAlignTargetOuter52"),
            innerX: this.scene.add.sprite(this.pos.x, this.pos.y, "sprBeamAlignTargetInner52"),
            outerY: this.scene.add.sprite(this.pos.x, this.pos.y, "sprBeamAlignTargetOuter52").setAngle(90),
            innerY: this.scene.add.sprite(this.pos.x, this.pos.y, "sprBeamAlignTargetInner52").setAngle(90),
            x: 0,
            y: 0
        }

        

        this.headingLTopL = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL48").setScale(1, -1);
        this.headingLTopL.setTintFill(LCARSCOLOR.gold);
        this.headingPillarL = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsPillar32");
        this.headingPillarL.setTintFill(LCARSCOLOR.gold);
        this.headingLBotL = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL48").setScale(1, 1);
        this.headingLBotL.setTintFill(LCARSCOLOR.gold);

        this.headingPillarML = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsPillar32");
        this.headingPillarML.setTintFill(LCARSCOLOR.gold);
        this.headingLBotML = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL64").setScale(-1, 1);
        this.headingLBotML.setTintFill(LCARSCOLOR.gold);

        this.headingLTopMR = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL48").setScale(1, -1);
        this.headingLTopMR.setTintFill(LCARSCOLOR.gold);
        this.headingPillarMR = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsPillar32");
        this.headingPillarMR.setTintFill(LCARSCOLOR.gold);
        this.headingLBotMR = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL48").setScale(1, 1);
        this.headingLBotMR.setTintFill(LCARSCOLOR.gold);

        this.headingLTopR = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL48");
        this.headingLTopR.setTintFill(LCARSCOLOR.gold);
        this.headingLBotR = this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsL48").setScale(1, -1);
        this.headingLBotR.setTintFill(LCARSCOLOR.gold);

    }

    update() {
        this.btnScanSector.update();
        this.btnTest.update();

        this.crossPad.update();
        switch (this.crossPad.currentField) {
            case this.headingXTxt:
                this.headingCoords.x = this.crossPad.input;
                break;
            case this.headingYTxt:
                this.headingCoords.y = this.crossPad.input;
                break;
            default:
                break;
        }

        this.slider.update();
        this.sliderIntensity.update();

        this.headingXTxt.txt.setText(this.headingCoords.x);
        this.headingYTxt.txt.setText(this.headingCoords.y);
        this.headingXTxt.update();
        this.headingYTxt.update();

        if(this.lastDestination !== null){
            this.beamAlignTarget.outerX.x = this.beamAlignBase.x + Math.floor(this.lastDestination.coords.x * 25);
            this.beamAlignTarget.outerY.y = this.beamAlignBase.y + Math.floor(this.lastDestination.coords.y * 25);

            this.beamAlignTarget.innerX.x = this.beamAlignBase.x + (this.headingCoords.x);
            this.beamAlignTarget.innerY.y = this.beamAlignBase.y + (this.headingCoords.y);
        }

        this.pipListNameRight.x = this.listNameTxt.x + this.listNameTxt.getTextBounds().local.width + 24;
        this.pipListNameRight.y = this.pos.y - 116;

        if(this.listview === this.list.players){
            for (let [i, p] of this.players.entries()) {
                p.btn.move(this.pos.x - 168, this.pos.y - 80 + (i * 18));
                p.btn.update();
            }
            for (let [i, l] of this.locations.entries()) {
                l.btn.move(this.pos.x + 1000 - 168, this.pos.y - 80 + (i * 18));
            }
            for (let [i, d] of this.destinations.entries()) {
                d.btn.move(this.pos.x, this.pos.y - 80 + (i * 18));
                d.btn.update();
            }
            this.btnBack.move(this.pos.x - 144, this.pos.y - 80 + ((this.players.length+1) * 18));
            this.btnBack.update();
        }else{
            for (let [i, p] of this.players.entries()) {
                p.btn.move(this.pos.x + 1000 - 168, this.pos.y - 80 + (i * 18));
            }
            for (let [i, l] of this.locations.entries()) {
                l.btn.move(this.pos.x - 168, this.pos.y - 80 + (i * 18));
                l.btn.update();
            }
            for (let [i, d] of this.destinations.entries()) {
                d.btn.move(this.pos.x + 1000, this.pos.y - 80 + (i * 18));
            }
            this.btnBack.move(this.pos.x + 1000, this.pos.y);
        }
    }

    move(){
        this.btnScanSector.move(this.pos.x + 222, this.pos.y - 116);
        this.btnTest.move(this.pos.x + 222, this.pos.y - 98);

        this.crossPad.move(this.pos.x + 32, this.pos.y + 105);
        this.slider.move(this.pos.x + 147, this.pos.y + 105);
        this.sliderIntensity.move(this.pos.x + 166, this.pos.y + 105);

        this.beamAlignBase.x = this.pos.x - 100;
        this.beamAlignBase.y = this.pos.y + 105;
        this.beamAlignTarget.outerX.x = this.beamAlignBase.x;
        this.beamAlignTarget.outerX.y = this.beamAlignBase.y;
        this.beamAlignTarget.innerX.x = this.beamAlignBase.x;
        this.beamAlignTarget.innerX.y = this.beamAlignBase.y;
        this.beamAlignTarget.outerY.x = this.beamAlignBase.x;
        this.beamAlignTarget.outerY.y = this.beamAlignBase.y;
        this.beamAlignTarget.innerY.x = this.beamAlignBase.x;
        this.beamAlignTarget.innerY.y = this.beamAlignBase.y;

        this.headingXTxt.move(this.pos.x - 100, this.pos.y + 60);
        this.headingYTxt.move(this.pos.x - 48, this.pos.y + 60);
        this.rangeTxt.move(this.pos.x + 200, this.pos.y + 96);
        this.intensityTxt.move(this.pos.x + 200, this.pos.y + 114);

        this.pipListNameLeft.x = this.pos.x - 168;
        this.pipListNameLeft.y = this.pos.y - 116;
        this.listNameTxt.x = this.pos.x - 152;
        this.listNameTxt.y = this.pos.y - 116;
        this.pipListNameRight.x = this.listNameTxt.x + this.listNameTxt.getTextBounds().local.width + 24;
        this.pipListNameRight.y = this.pos.y - 116;

        if (this.listview === this.list.players) {
            for (let [i, p] of this.players.entries()) {
                p.btn.move(this.pos.x - 168, this.pos.y - 80 + (i * 18));
            }
            for (let [i, l] of this.locations.entries()) {
                l.btn.move(this.pos.x + 1000 - 168, this.pos.y - 80 + (i * 18));
            }
            for (let [i, d] of this.destinations.entries()) {
                d.btn.move(this.pos.x, this.pos.y - 80 + (i * 18));
            }
            this.btnBack.move(this.pos.x - 144, this.pos.y - 80 + (this.players.length * 18));
        } else {
            for (let [i, p] of this.players.entries()) {
                p.move(this.pos.x + 1000 - 168, this.pos.y - 80 + (i * 18));
            }
            for (let [i, l] of this.locations.entries()) {
                l.btn.move(this.pos.x - 168, this.pos.y - 80 + (i * 18));
            }
            for (let [i, d] of this.destinations.entries()) {
                d.btn.move(this.pos.x + 1000, this.pos.y - 80 + (i * 18));
            }
            this.btnBack.move(this.pos.x + 1000, this.pos.y);
        }
        
        this.headingLTopL.x = this.pos.x - 151;
        this.headingLTopL.y = this.pos.y + 69;
        this.headingPillarL.x = this.pos.x - 159;
        this.headingPillarL.y = this.pos.y + 104;
        this.headingLBotL.x = this.pos.x - 151;
        this.headingLBotL.y = this.pos.y + 142;

        this.headingPillarML.x = this.pos.x - 41;
        this.headingPillarML.y = this.pos.y + 104;
        this.headingLBotML.x = this.pos.x - 57;
        this.headingLBotML.y = this.pos.y + 142;

        this.headingLTopMR.x = this.pos.x + 112;
        this.headingLTopMR.y = this.pos.y + 69;
        this.headingPillarMR.x = this.pos.x + 104;
        this.headingPillarMR.y = this.pos.y + 104;
        this.headingLBotMR.x = this.pos.x + 112;
        this.headingLBotMR.y = this.pos.y + 142;

        this.headingLTopR.x = this.pos.x + 200;
        this.headingLTopR.y = this.pos.y + 69;
        this.headingLBotR.x = this.pos.x + 200;
        this.headingLBotR.y = this.pos.y + 141;
    }

    synchronize(){
        if (this.scene.sectorData !== null) {
            if(this.listview === this.list.locations){
                //refresh location lsit
                for (let ol of this.scene.sectorData.locations) {
                    let found = false;
                    for(let i = this.locations.length -1 ; i >= 0 ; i--){
                        if (ol.id === this.locations[i].data.id) {
                            this.locations[i].data = ol;
                            found = true;
                        }
                        if (Phaser.Math.Distance.Between(this.scene.locationData.coords.x, this.scene.locationData.coords.y, this.locations[i].data.coords.x, this.locations[i].data.coords.y) > this.beamRange){
                            this.locations[i].btn.destroy();
                            this.locations.splice(i, 1);
                        }
                    }
                    if (found === false && Phaser.Math.Distance.Between(this.scene.locationData.coords.x, this.scene.locationData.coords.y, ol.coords.x, ol.coords.y) <= this.beamRange) {
                        this.locations.push({
                            data: ol,
                            btn: new ListButton(this.scene, { x: this.pos.x - 168, y: this.pos.y - 80 + (this.locations.length * 18) }, ol.id, false, () => {
                                socket.emit("requestPlayersAtLocation", {
                                    id: ol.id
                                });
                                this.listNameTxt.setText(ol.id);
                                this.listview = this.list.players;
                            })
                        });
                    }
                }
            }else{
                if(this.showDestinations === true){
                    for (let ol of this.scene.sectorData.locations) {
                        let found = false;
                        for (let d of this.destinations) {
                            if (ol.id === d.data.id) {
                                d.data = ol;
                                found = true;
                            }
                        }
                        if (found === false) {
                            if (this.listNameTxt.text !== ol.id && Phaser.Math.Distance.Between(this.scene.locationData.coords.x, this.scene.locationData.coords.y, ol.coords.x, ol.coords.y) <= this.beamRange){
                                let asset = "sprSymbolUnkown";
                                switch (ol.type) {
                                    case "ship":
                                        asset = "sprSymbolFriendlyShip";
                                        break;
                                    case "station":
                                        asset = "sprSymbolFriendlyStation";
                                        break;
                                    default:
                                        break;
                                }
                                this.destinations.push({
                                    data: ol,
                                    btn: new ListButton(this.scene, { x: this.pos.x - 168, y: this.pos.y - 80 + (this.locations.length * 18) }, ol.id, true, () => {
                                        this.lastDestination = ol;
                                    })
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    destroy() {
        this.btnScanSector.destroy();
        this.btnTest.destroy();

        this.crossPad.destroy();
        this.slider.destroy();
        this.sliderIntensity.destroy();

        this.headingXTxt.destroy();
        this.headingYTxt.destroy();
        this.rangeTxt.destroy();
        this.intensityTxt.destroy();

        for (let p of this.players) {
            p.btn.destroy();
        }
        this.players = [];
        for (let l of this.locations) {
            l.btn.destroy();
        }
        this.locations = [];
        for (let d of this.destinations) {
            d.btn.destroy();
        }
        this.destinations = [];
        this.btnBack.destroy();

        this.pipListNameLeft.destroy();
        this.pipListNameRight.destroy();
        this.listNameTxt.destroy();

        this.beamAlignBase.destroy();
        this.beamAlignTarget.outerX.destroy();
        this.beamAlignTarget.outerY.destroy();
        this.beamAlignTarget.innerX.destroy();
        this.beamAlignTarget.innerY.destroy();

        this.headingLTopL.destroy();
        this.headingPillarL.destroy();
        this.headingLBotL.destroy();

        this.headingPillarML.destroy();
        this.headingLBotML.destroy();

        this.headingLTopMR.destroy();
        this.headingPillarMR.destroy();
        this.headingLBotMR.destroy();

        this.headingLTopR.destroy();
        this.headingLBotR.destroy();

        socket.off("getPlayersAtLocation");
    }
}