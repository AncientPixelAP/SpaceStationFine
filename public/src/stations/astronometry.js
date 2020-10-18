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
        //this.sectorMask = this.shape.createGeometryMask();
        //console.log(this.sectorMask);

        this.btnScanSector = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "SCAN", false, () => {
            console.log("scanning");
            socket.emit("requestSectorLocations", {
                player: this.scene.playerData,
                id: this.scene.locationData.id,
                sector: this.scene.locationData.sector
            });
        } );

        this.btnVector = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "PLOT", false, () => {
            let vx = this.sectorMap.x + (this.target.sprite.x / this.zoomFactor);
            let vy = this.sectorMap.y + (this.target.sprite.y / this.zoomFactor);
            this.details.setText("target: " + String(vx.toFixed(0)) + "," + String(vy.toFixed(0)));
        });

        this.btnTitleZoom = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnLong64", "ZOOM", false, () => { });
        this.btnTitleZoom.colors.out = LCARSCOLOR.gold;
        this.btnTitleZoom.colorInState(this.btnTitleZoom.states.out);

        this.btnZoomIn = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "+", false, () => {
            this.zoomFactor = Math.min(this.zoomFactorMax, this.zoomFactor * 2);
            this.zoomFactorTxt.setText(String(this.zoomFactor) + "x");

            for(let w of this.waypoints){
                w.sprite.x *= this.zoomFactor;
                w.sprite.y *= this.zoomFactor;
                w.txt.x *= this.zoomFactor;
                w.txt.y *= this.zoomFactor;
            }
        });

        this.btnZoomOut = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "-", false, () => {
            this.zoomFactor = Math.max(1, this.zoomFactor / 2);
            this.zoomFactorTxt.setText(String(this.zoomFactor) + "x");
            for (let w of this.waypoints) {
                w.sprite.x /= this.zoomFactor;
                w.sprite.y /= this.zoomFactor;
                w.txt.x /= this.zoomFactor;
                w.txt.y /= this.zoomFactor;
            }
        });

        this.btnDetails = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "DETL", false, () => {
            if(this.target.follow !== null){
                let txt = this.target.follow.data.type;
                txt += "\nid: " + this.target.follow.data.id;
                txt += "\ncourse: " + this.target.follow.data.headingCoords.x + "," + this.target.follow.data.headingCoords.y + "\nat " + this.target.follow.data.spd + "km/s";
                txt += "\nshields: " + (this.target.follow.data.shields.up ? "up" : "down");
                if(this.target.follow.data.dockedAt !== ""){
                    txt += "\ndocked at: " + this.target.follow.data.dockedAt;
                }
                this.details.setText(txt);
            }else{
                this.details.setText("no target set");
            }
        });
        this.details = this.scene.add.bitmapText(99990, 0, "pixelmix", "no target set", 8, 1).setOrigin(0, 0);
        this.details.maxWidth = 128;
        this.details.setRightAlign();

        this.sectorMap = this.scene.add.sprite(this.pos.x, this.pos.y, "sprSectorGrid3d");
        this.sectorHeading = this.scene.add.sprite(this.pos.x, this.pos.y, "sprPinkSimpleHeading");
        this.target = {
            sprite: this.scene.add.sprite(this.pos.x, this.pos.y, "sprGoldTarget"),
            x: 0,
            y: 0,
            follow: null,
            txt: this.scene.add.bitmapText(99990, 0, "pixelmix", "0,0", 8, 1).setOrigin(0.5)
        }

        this.btnTitleWaypoint = new Button(this.scene, { x: this.pos.x, y: this.pos.y }, "sprLcarsBtnLong64", "WAYPTS", false, () => { });
        this.btnTitleWaypoint.colors.out = LCARSCOLOR.gold;
        this.btnTitleWaypoint.colorInState(this.btnTitleWaypoint.states.out);

        this.waypoints = [];
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

            for(let w of this.waypoints){
                w.sprite.destroy();
                w.txt.destroy();
            }
            this.waypoints = [];
        });

        this.sectorNameTxt = this.scene.add.bitmapText(99990, 0, "pixelmix", "sectorName", 8, 1).setOrigin(0, 0.5);
        this.zoomFactorTxt = this.scene.add.bitmapText(99990, 0, "pixelmix", "1x", 8, 1).setOrigin(1, 0.5);
        
        
        this.locations = [];
        socket.on("getSectorLocations", (_data) => {
            console.log(_data);

            //remove old images
            for (let l of this.locations) {
                l.sprite.destroy();
            }
            this.locations = [];
            //fill new locations
            for(let l of _data.locations){
                let asset = "sprSymbolUnknown";
                switch(l.type){
                    case "ship":
                        asset = "sprSymbolFriendlyShip";
                    break;
                    case "station":
                        asset = "sprSymbolFriendlyStation";
                    break;
                    default:
                    break;
                }
                this.locations.push({
                    data: l,
                    sprite: this.scene.add.sprite(this.sectorMap.x + (l.coords.x * 128), this.sectorMap.y + (l.coords.y * 128), asset)
                });
                //this.locations[this.locations.length-1].sprite.setMask(this.sectorMask);
                //this.locations[this.locations.length - 1].sprite.mask = new Phaser.Display.Masks.GeometryMask(this.scene, this.shape);
                let mask = this.shape.createGeometryMask();
                this.locations[this.locations.length - 1].sprite.setMask(mask);
            }
        });
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

                console.log(this.screenToCoords(this.target.sprite.x, this.target.sprite.y));

                if(this.mode === this.modes.waypointAdd){
                    this.waypoints.push({
                        x: (this.sectorMap.x - this.target.sprite.x) / 128,
                        y: (this.sectorMap.y - this.target.sprite.y) / 128,
                        txt: this.scene.add.bitmapText(99990, 0, "pixelmix", "0,0", 8, 1).setOrigin(0.5),
                        sprite: this.scene.add.sprite(this.target.sprite.x, this.target.sprite.y, "sprPinkTarget")
                    });
                    let vx = this.sectorMap.x + (this.target.sprite.x / this.zoomFactor);
                    let vy = this.sectorMap.y + (this.target.sprite.y / this.zoomFactor);
                    this.waypoints[this.waypoints.length - 1].txt.setText(String(vx.toFixed(0)) + "," + String(vy.toFixed(0)));
                    this.waypoints[this.waypoints.length - 1].txt.x = this.target.sprite.x < this.sectorMap.x ? this.target.sprite.x + 26 : this.target.sprite.x - 26;
                    this.waypoints[this.waypoints.length - 1].txt.setOrigin(this.target.sprite.x < this.sectorMap.x ? 0 : 1, 0.5);
                    this.waypoints[this.waypoints.length - 1].txt.y = this.target.sprite.y;
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
        let vx = this.sectorMap.x + (this.target.sprite.x / this.zoomFactor);
        let vy = this.sectorMap.y + (this.target.sprite.y / this.zoomFactor);
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
        }

        this.sectorHeading.setRotation(this.scene.locationData.heading);
    }

    screenToCoords(_inX, _inY){
        return {
            x: (this.sectorMap.x + _inX - this.scene.locationData.coords.x) / 128,
            y: (this.sectorMap.y + _inY - this.scene.locationData.coords.y) / 128
        }
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
        this.shape.x = this.sectorMap.x;
        this.shape.y = this.sectorMap.y;
        //this.sectorMask.x = this.sectorMap.x;
        //this.sectorMask.y = this.sectorMap.y;
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
                    switch (ol.type) {
                        case "ship":
                            asset = "sprSymbolFriendlyShip";
                            break;
                        case "station":
                            asset = "sprSymbolFriendlyStation";
                            break;
                        case "warpcore":
                            asset = "sprSymbolWarpcore";
                            break;
                        default:
                            break;
                    }
                    this.locations.push({
                        data: ol,
                        sprite: this.scene.add.sprite(this.sectorMap.x + (ol.coords.x * 128), this.sectorMap.y + (ol.coords.y * 128), asset)
                    });
                    let mask = this.shape.createGeometryMask();
                    this.locations[this.locations.length - 1].sprite.setMask(mask);
                }
            }
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
        this.shape.destroy();
        //this.sectorMask.destroy();
        this.sectorHeading.destroy();
        this.target.sprite.destroy();
        this.target.txt.destroy();

        for (let l of this.locations) {
            l.sprite.destroy();
        }

        for (let w of this.waypoints) {
            w.sprite.destroy();
            w.txt.destroy();
        }
        this.waypoints = [];

        socket.off("getSectorLocations");
    }
}