import Button from "../lcars/button.js";

export default class Astronometry{
    constructor(_scene, _data){
        this.scene = _scene;
        this.data = _data;

        this.pos = {
            x: 0,
            y: 0
        }

        this.zoomFactor = 16;
        this.zoomFactorMax = 16;
        this.shortRange = 1;
        this.longRange = 2;

        this.views = {
            fight: 0,
            sector: 1,
            neighbours: 2
        }
        this.view = this.views.sector;

        this.modes = {
            default: 0,
            waypointAdd: 1,
            waypointDel: 2
        }
        this.mode = this.modes.default;

        this.shape = this.scene.add.graphics(0, 0);
        this.shape.fillStyle(0x000000);
        this.shape.fillRect(-128,-128,256,256);
        this.shape.depth = -11000;
        //this.sectorMask = this.shape.createGeometryMask();
        //console.log(this.sectorMask);

        this.btnScanSector = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "SCAN", false, () => {
            let toScanIds = [];
            for(let l of this.scene.sectorData.locations){
                if(Phaser.Math.Distance.Between(l.coords.x, l.coords.y, this.scene.locationData.coords.x, this.scene.locationData.coords.y) <= this.shortRange){
                    toScanIds.push(l.id);
                }
            }
            socket.emit("revealSectorLocations", {
                locationIds: toScanIds,
                sector: this.scene.locationData.sector
            });
        } );

        this.btnVector = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "PRNT", false, () => {
            /*let vx = this.sectorMap.x + (this.target.sprite.x / this.zoomFactor);
            let vy = this.sectorMap.y + (this.target.sprite.y / this.zoomFactor);
            this.details.setText("target: " + String(vx.toFixed(0)) + "," + String(vy.toFixed(0)));*/

            if (this.target.follow !== null) {
                console.log(this.target.follow.data);

                socket.emit("addToPlayerInventory", {
                    playerId: this.scene.playerData.id,
                    item: {
                        id: "sensorData",
                        type: "locationData",
                        data: this.target.follow.data
                    },
                    amount: 1,
                    unique: true
                });
            }
        });

        this.btnTitleZoom = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnLong64", "ZOOM", false, () => { });
        this.btnTitleZoom.colors.out = LCARSCOLOR.gold;
        this.btnTitleZoom.colorInState(this.btnTitleZoom.states.out);

        this.btnZoomIn = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "+", false, () => {
            this.zoomFactor = Math.min(this.zoomFactorMax, this.zoomFactor * 2);
            this.zoomFactorTxt.setText(String(this.zoomFactor) + "x");
            //this.refreshWaypointConnection();
            this.waypointConnection.clear();
        });

        this.btnZoomOut = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "-", false, () => {
            this.zoomFactor = Math.max(1, this.zoomFactor / 2);
            this.zoomFactorTxt.setText(String(this.zoomFactor) + "x");
            //this.refreshWaypointConnection();
            this.waypointConnection.clear();
        });

        this.btnDetails = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "DETL", false, () => {
            if(this.target.follow !== null){
                let txt = this.target.follow.data.type;
                txt += "\nid: " + this.target.follow.data.id;
                if(this.target.follow.data.type !== ELOCATION.waypoint){
                    txt += "\ncourse: " + this.target.follow.data.headingCoords.x + "," + this.target.follow.data.headingCoords.y + "\nat " + this.target.follow.data.spd + "km/s";
                    txt += "\nshields: " + (this.target.follow.data.shields.up ? "up" : "down");
                    if(this.target.follow.data.dockedAt !== ""){
                        txt += "\ndocked at: " + this.target.follow.data.dockedAt;
                    }
                }
                this.details.setText(txt);
            }else{
                this.details.setText("no target set");
            }
        });
        this.details = this.scene.add.bitmapText(99990, 0, "pixelmix", "no target set", 8, 1).setOrigin(0, 0);
        this.details.maxWidth = 128;
        this.details.setRightAlign();

        let mask = this.shape.createGeometryMask();
        this.sectorMapBg = this.scene.add.sprite(this.pos.x, this.pos.y, "sprSectorGridBg00");
        this.sectorMapBg.alpha = 0;
        this.sectorMapBg.depth = -100;
        this.sectorMapBg.setMask(mask);
        this.sectorMapFg = [];
        for(let i = 0 ; i < 4 ; i++){
            this.sectorMapFg.push(this.scene.add.sprite(this.pos.x, this.pos.y, "sprSectorGridBg00"));
            this.sectorMapFg[i].alpha = 0;
            this.sectorMapFg[i].setMask(mask);
        }

        this.sectorMap = this.scene.add.sprite(this.pos.x, this.pos.y, "sprSectorGrid3d");
        this.sectorHeading = this.scene.add.sprite(this.pos.x, this.pos.y, "sprPinkSimpleHeading");
        this.target = {
            sprite: this.scene.add.sprite(this.pos.x, this.pos.y, "sprGoldTarget"),
            x: 0,
            y: 0,
            follow: null,
            txt: this.scene.add.bitmapText(99990, 0, "pixelmix", "0,0", 8, 1).setOrigin(0.5)
        }
        this.target.sprite.setMask(mask);

        this.btnTitleWaypoint = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnLong64", "WAYPTS", false, () => { });
        this.btnTitleWaypoint.colors.out = LCARSCOLOR.gold;
        this.btnTitleWaypoint.colorInState(this.btnTitleWaypoint.states.out);

        this.waypointNo = 0;
        this.waypointConnection = this.scene.add.graphics(this.pos.x, this.pos.y);
        this.btnWaypointAdd = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "WPT ADD", true, () => {
            this.btnWaypointDel.active = false;
            if(this.mode !== this.modes.default){
                this.mode = this.modes.default;
            }else{
                this.mode = this.modes.waypointAdd;
            }
        });
        this.btnWaypointDel = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "WPT DEL", true, () => {
            this.btnWaypointAdd.active = false;
            if (this.mode !== this.modes.default) {
                this.mode = this.modes.default;
            } else {
                this.mode = this.modes.waypointDel;
            }
        });
        this.btnWaypointClr = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "WPT ClR", false, () => {
            this.mode = this.modes.default;
            this.btnWaypointAdd.active = false;
            this.btnWaypointDel.active = false;

            for(let i = this.locations.length-1 ; i >= 0 ; i--){
                if(this.locations[i].data.type === ELOCATION.waypoint){
                    this.locations[i].sprite.destroy();
                    this.locations.splice(i, 1);
                }
            }
            this.waypointNo = 0;
            this.refreshWaypointConnection();
        });

        this.sectorNameTxt = this.scene.add.bitmapText(99990, 0, "pixelmix", "sectorName", 8, 1).setOrigin(0, 0.5);
        this.zoomFactorTxt = this.scene.add.bitmapText(99990, 0, "pixelmix", String(this.zoomFactor) + "x", 8, 1).setOrigin(1, 0.5);
        
        
        this.locations = [];
    }

    update(){
        if(this.sectorMap.getBounds().contains(this.scene.hand.pos.x, this.scene.hand.pos.y)){
            
            if(this.scene.hand.justPressed === true){
                this.target.follow = null;
                this.details.setText("");
            }
            if (this.scene.hand.pressed === true) {
                this.target.sprite.x = this.scene.hand.pos.x;
                this.target.sprite.y = this.scene.hand.pos.y;
            }
            if(this.scene.hand.justReleased === true){
                for(let l of this.locations){
                    if(l.sprite.getBounds().contains(this.target.sprite.x, this.target.sprite.y)){
                        this.target.follow = l;
                        this.sectorNameTxt.setText(l.data.id);
                    }
                }

                //console.log(this.screenToCoords(this.target.sprite.x, this.target.sprite.y));

                if(this.mode === this.modes.waypointAdd){
                    let vx = ((this.target.sprite.x - this.sectorMap.x) / this.zoomFactor) / 128;
                    let vy = ((this.target.sprite.y - this.sectorMap.y) / this.zoomFactor) / 128;
                    this.locations.push({
                        data: {
                            type: ELOCATION.waypoint,
                            coords: {
                                x: vx,
                                y: vy,
                                z: 0.5
                            },
                            number: this.waypointNo,
                            id: "Waypoint " + this.waypointNo
                        },
                        sprite: this.scene.add.sprite(this.sectorMap.x + (vx * 128), this.sectorMap.y + (vy * 128), "sprSymbolWaypoint")
                    });
                    let mask = this.shape.createGeometryMask();
                    this.locations[this.locations.length - 1].sprite.setMask(mask);
                    this.waypointNo += 1;
                    this.refreshWaypointConnection();
                }
            }
        }

        this.btnScanSector.update();
        this.btnDetails.update();
        this.btnVector.update();
        this.btnZoomIn.update();
        this.btnZoomOut.update();
        this.btnWaypointAdd.update();
        this.btnWaypointDel.update();
        this.btnWaypointClr.update();

        this.details.x = this.pos.x + 188 - 130;//- this.details.getTextBounds().local.width;
        this.details.y = this.pos.y - 124;//- (this.details.getTextBounds().local.height * 0.5);

        if(this.target.follow !== null){
            this.target.sprite.x = this.target.follow.sprite.x;
            this.target.sprite.y = this.target.follow.sprite.y;
        }
        let vx = (this.target.sprite.x - this.sectorMap.x) / this.zoomFactor;//this.sectorMap.x + (this.target.sprite.x / this.zoomFactor);
        let vy = (this.target.sprite.y - this.sectorMap.y) / this.zoomFactor;//this.sectorMap.y + (this.target.sprite.y / this.zoomFactor);
        this.target.txt.setText(String(vx.toFixed(0)) + "," + String(vy.toFixed(0)));
        this.target.txt.x = this.target.sprite.x < this.sectorMap.x ? this.target.sprite.x + 26 : this.target.sprite.x - 26;
        this.target.txt.setOrigin(this.target.sprite.x < this.sectorMap.x ? 0 : 1, 0.5);
        this.target.txt.y = this.target.sprite.y;

        //update locations with sectorData
        if(this.scene.sectorData !== null){
            for(let sl of this.scene.sectorData.locations){
                for(let l of this.locations){
                    //console.log(sd);
                    if(sl.id === l.data.id){
                        l.data = sl;
                    }
                }
            }
        }

        let arr = this.locations.filter((loc) => {return loc.data.id === this.scene.locationData.id;});
        if(arr.length > 0){
            let myself = arr[0];
            for(let l of this.locations){
                //course corrected view
                let xx = l.data.coords.x - myself.data.coords.x;
                if(xx > 1){xx -= 2};
                if (xx < -1) { xx += 2 };
                let yy = l.data.coords.y - myself.data.coords.y;
                if (yy > 1) { yy -= 2 };
                if (yy < -1) { yy += 2 };
                l.sprite.x = this.sectorMap.x + ((xx * 128) * this.zoomFactor);
                l.sprite.y = this.sectorMap.y + ((yy * 128) * this.zoomFactor);
            }

            this.sectorMapFg[0].setScale(this.zoomFactor);
            this.sectorMapFg[0].x = (myself.data.coords.x * -128) * this.zoomFactor;
            this.sectorMapFg[0].y = (myself.data.coords.y * -128) * this.zoomFactor;
            this.sectorMapFg[1].setScale(this.zoomFactor);
            this.sectorMapFg[1].x = ((myself.data.coords.x >= 0 ? myself.data.coords.x - 2 : myself.data.coords.x + 2) * -128) * this.zoomFactor;
            this.sectorMapFg[1].y = (myself.data.coords.y * -128) * this.zoomFactor;
            this.sectorMapFg[2].setScale(this.zoomFactor);
            this.sectorMapFg[2].x = (myself.data.coords.x * -128) * this.zoomFactor;
            this.sectorMapFg[2].y = ((myself.data.coords.y >= 0 ? myself.data.coords.y - 2 : myself.data.coords.y + 2) * -128) * this.zoomFactor;
            this.sectorMapFg[3].setScale(this.zoomFactor);
            this.sectorMapFg[3].x = ((myself.data.coords.x >= 0 ? myself.data.coords.x - 2 : myself.data.coords.x + 2) * -128) * this.zoomFactor;
            this.sectorMapFg[3].y = ((myself.data.coords.y >= 0 ? myself.data.coords.y - 2 : myself.data.coords.y + 2) * -128) * this.zoomFactor;
        }

        this.sectorHeading.setRotation(this.scene.locationData.heading);
    }

    screenToCoords(_inX, _inY){
        return {
            x: (this.sectorMap.x + _inX - this.scene.locationData.coords.x) / 128,
            y: (this.sectorMap.y + _inY - this.scene.locationData.coords.y) / 128
        }
    }

    refreshWaypointConnection(){
        this.waypointConnection.clear();
        //this.waypointConnection.moveTo(this.sectorMap.x, this.sectorMap.y);
        this.waypointConnection.lineStyle(1.5, 0xffffff);
        this.waypointConnection.beginPath();
        this.waypointConnection.lineTo(this.sectorMap.x, this.sectorMap.y);
        for(let i = 0 ; i < this.waypointNo ; i++){
            for(let l of this.locations){
                if(l.data.type === ELOCATION.waypoint){
                    if(l.data.number === i){
                        this.waypointConnection.lineTo(l.sprite.x, l.sprite.y);
                    }
                }
            }
        }
        this.waypointConnection.strokePath();

        let mask = this.shape.createGeometryMask();
        this.waypointConnection.setMask(mask);
    }

    move(){
        this.btnScanSector.move(this.pos.x + 222, this.pos.y -116);
        this.btnDetails.move(this.pos.x + 222, this.pos.y - 98);
        this.btnVector.move(this.pos.x + 222, this.pos.y - 80);
        this.btnTitleZoom.move(this.pos.x + 222, this.pos.y - 62);
        this.btnZoomIn.move(this.pos.x + 222, this.pos.y - 44);
        this.btnZoomOut.move(this.pos.x + 222, this.pos.y - 26);
        this.btnTitleWaypoint.move(this.pos.x + 222, this.pos.y - 8);
        this.btnWaypointAdd.move(this.pos.x + 222, this.pos.y + 10);
        this.btnWaypointDel.move(this.pos.x + 222, this.pos.y + 28);
        this.btnWaypointClr.move(this.pos.x + 222, this.pos.y + 46);

        this.details.x = this.pos.x + 190 - this.details.getTextBounds().local.width;
        this.details.y = this.pos.y - (this.details.getTextBounds().local.height * 0.5);

        this.sectorMap.x = this.pos.x;
        this.sectorMap.y = this.pos.y + 4;
        this.sectorMapBg.x = this.sectorMap.x;
        this.sectorMapBg.y = this.sectorMap.y;
        for (let s of this.sectorMapFg) {
            s.x = this.sectorMap.x;
            s.y = this.sectorMap.y;
        }
        this.shape.x = this.sectorMap.x;
        this.shape.y = this.sectorMap.y;
        this.sectorHeading.x = this.pos.x;
        this.sectorHeading.y = this.pos.y + 4;
        this.target.sprite.x = this.sectorMap.x + this.target.x;
        this.target.sprite.y = this.sectorMap.y + this.target.y;

        this.target.txt.x = this.pos.x;
        this.target.txt.y = this.pos.y;

        for(let l of this.locations){
            l.sprite.x = this.pos.x;
            l.sprite.y = this.pos.y;
        }

        this.waypointConnection.x = this.pos.x;
        this.waypointConnection.y = this.pos.y;

        this.sectorNameTxt.x = this.sectorMap.x - 120;
        this.sectorNameTxt.y = this.sectorMap.y + 136;

        this.zoomFactorTxt.x = this.sectorMap.x + 120;
        this.zoomFactorTxt.y = this.sectorMap.y + 136;
    }

    synchronize(){
        if(this.scene.sectorData !== null){
            if(this.target.follow === null){
                this.sectorNameTxt.setText(this.scene.sectorData.name);
            }
            if(this.sectorMapBg.alpha === 0){
                this.sectorMapBg.alpha = 0.5;
                this.sectorMapBg.setTint(this.scene.sectorData.bgColor);
                for (let s of this.sectorMapFg) {
                    s.alpha = 0.75;
                    s.setTint(this.scene.sectorData.fgColor);
                }
            }

            for(let ol of this.scene.sectorData.locations){

                let found = false;
                for(let l of this.locations){
                    if(ol.id === l.data.id){
                        l.data = ol;
                        found = true;
                    }
                }
                if(found === false){
                    let asset = "sprSymbolUnknown";
                    if(ol.unknown === false){
                        switch (ol.type) {
                            case ELOCATION.ship:
                                asset = "sprSymbolFriendlyShip";
                                break;
                            case ELOCATION.station:
                                asset = "sprSymbolFriendlyStation";
                                break;
                            case ELOCATION.planet:
                                asset = "sprSymbolFriendlyPlanet";
                                break;
                            case ELOCATION.warpcore:
                                asset = "sprSymbolWarpcore";
                                break;
                            case ELOCATION.resonanceTraces:
                                asset = "sprSymbolResonanceTraces"
                                break;
                            case ELOCATION.waypoint:
                                asset = "sprSymbolWaypoint";
                                break;
                            default:
                                break;
                        }
                    }
                    if(ol.hidden === false){
                        this.locations.push({
                            data: ol,
                            sprite: this.scene.add.sprite(this.sectorMap.x + (ol.coords.x * 128), this.sectorMap.y + (ol.coords.y * 128), asset)
                        });
                        let mask = this.shape.createGeometryMask();
                        this.locations[this.locations.length - 1].sprite.setMask(mask);
                    }
                }
            }

            this.refreshWaypointConnection();
        }
    }

    destroy(){
        this.btnScanSector.destroy();
        this.btnDetails.destroy();
        this.btnVector.destroy();
        this.btnTitleZoom.destroy();
        this.btnZoomIn.destroy();
        this.btnZoomOut.destroy();
        this.btnTitleWaypoint.destroy();
        this.btnWaypointAdd.destroy();
        this.btnWaypointDel.destroy();
        this.btnWaypointClr.destroy();

        this.details.destroy();
        this.sectorNameTxt.destroy();
        this.zoomFactorTxt.destroy();

        this.sectorMap.destroy();
        this.sectorMapBg.destroy();
        for(let s of this.sectorMapFg){
            s.destroy();
        }

        this.shape.destroy();
        //this.sectorMask.destroy();
        this.sectorHeading.destroy();
        this.target.sprite.destroy();
        this.target.txt.destroy();

        this.waypointConnection.destroy();

        for (let l of this.locations) {
            l.sprite.destroy();
        }
    }
}