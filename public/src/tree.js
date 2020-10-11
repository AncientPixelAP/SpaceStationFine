export default class CrateTree{
    constructor(_scene, _x, _y, _dust){
        this.scene = _scene;
        this.pos = {
            x: _x,
            y: _y
        }       
        this.dust = _dust;
        this.lastPlayerTouched = null;

        this.base = this.scene.add.sprite(this.pos.x, this.pos.y, "sprTreeBase");
        this.base.setOrigin(0.5, 1);
        this.base.depth = this.pos.y-4;

        this.trunk = this.scene.add.sprite(this.pos.x, this.pos.y-8, "sprTreeTrunk");
        this.trunk.setOrigin(0.5, 1);
        this.trunk.depth = this.pos.y-4;

        this.top = this.scene.add.sprite(this.pos.x, this.pos.y - 32, "sprTreeTop");
        this.top.setOrigin(0.5, 1);
        this.top.depth = this.pos.y-4;
    }

    update(){
        /*if(this.dust > 0){
            this.top.setTexture("sprTreeTop", 1);
        }*/
    }

    addDust(_dust){
        this.dust += _dust;
        socket.emit("updateTree", {
            dust: this.dust
        });
    }

    getDust(_dust){
        this.dust = _dust;
        this.top.setTexture("sprTreeTop", Math.max(0, Math.min(1, Math.floor(this.dust))));
    }
}