import Button from "../lcars/button.js";

export default class Astronometry{
    constructor(_scene, _data){
        this.scene = _scene;
        this.data = _data;

        this.pos = {
            x: 0,
            y: 0
        }

        this.zooms = {
            fight: 0,
            sector: 1,
            neighbours: 2
        }
        this.zoom = this.zooms.sector;

        this.btnScanSector = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "SCAN", false, () => {
            console.log("scanning");
            socket.emit("requestSectorLocations", {
                player: this.scene.playerData,
                id: this.scene.locationData.id,
                sector: this.scene.locationData.sector
            });
        } );

        this.btnVector = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "PLOT", false, () => {
            let vx = this.sectorMap.x + this.target.sprite.x;
            let vy = this.sectorMap.y + this.target.sprite.y;
            this.details.setText("target: " + String(vx.toFixed(0)) + "," + String(vy.toFixed(0)));
        });

        this.btnDetails = new Button(this.scene, { x: this.pos.x, y: this.pos.y + 0 }, "sprLcarsBtnLong64", "DETL", false, () => {
            if(this.target.follow !== null){
                console.log(this.target.follow.data);
                let txt = this.target.follow.data.type;
                txt += "\nid: " + this.target.follow.data.id;
                txt += "\ncourse: " + this.target.follow.data.headingCoords.x + "," + this.target.follow.data.headingCoords.y + "\nat " + this.target.follow.data.spd + "km/s";
                txt += "\nshields: " + (this.target.follow.data.shields.up ? "up" : "down");
                this.details.setText(txt);
            }else{
                this.details.setText("no target set");
            }
        });
        this.details = this.scene.add.bitmapText(99990, 0, "pixelmix", "no target set", 8, 1).setOrigin(0);
        this.details.maxWidth = 128;
        this.details.setLeftAlign();

        this.sectorMap = this.scene.add.sprite(this.pos.x, this.pos.y, "sprSectorGrid3d");
        this.sectorHeading = this.scene.add.sprite(this.pos.x, this.pos.y, "sprPinkSimpleHeading");
        this.target = {
            sprite: this.scene.add.sprite(this.pos.x, this.pos.y, "sprGoldTarget"),
            x: 0,
            y: 0,
            follow: null,
            txt: this.scene.add.bitmapText(99990, 0, "pixelmix", "0,0", 8, 1).setOrigin(0.5)
        }
        
        
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
                let asset = "sprSymbolUnkown";
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
            }
        });
    }

    update(){
        if(this.sectorMap.getBounds().contains(this.scene.hand.pos.x, this.scene.hand.pos.y)){
            if(this.scene.hand.justPressed === true){
                this.target.follow = null;
            }
            if (this.scene.hand.pressed === true) {
                this.target.sprite.x = this.scene.hand.pos.x;
                this.target.sprite.y = this.scene.hand.pos.y;
            }
            if(this.scene.hand.justReleased === true){
                for(let l of this.locations){
                    if(l.sprite.getBounds().contains(this.target.sprite.x, this.target.sprite.y)){
                        this.target.follow = l;
                    }
                }
            }
        }

        this.btnScanSector.update();
        this.btnDetails.update();
        this.btnVector.update();

        if(this.target.follow !== null){
            this.target.sprite.x = this.target.follow.sprite.x;
            this.target.sprite.y = this.target.follow.sprite.y;
        }
        let vx = this.sectorMap.x + this.target.sprite.x;
        let vy = this.sectorMap.y + this.target.sprite.y;
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
                l.sprite.x = this.sectorMap.x + (xx * 128);
                l.sprite.y = this.sectorMap.y + (yy * 128);
            }
            
        }

        this.sectorHeading.setRotation(this.scene.locationData.heading);
    }

    move(){
        this.btnScanSector.move(this.pos.x + 222, this.pos.y -116);
        this.btnDetails.move(this.pos.x + 222, this.pos.y - 98);
        this.btnVector.move(this.pos.x + 222, this.pos.y - 80);

        this.details.x = this.pos.x + 136;
        this.details.y = this.pos.y - 62;

        this.sectorMap.x = this.pos.x;
        this.sectorMap.y = this.pos.y + 4;
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
    }

    synchronize(){

    }
}