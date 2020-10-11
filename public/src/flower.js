export default class Flower{
    constructor(_scene, _x, _y){
        this.scene = _scene;
        this.pos = {
            x: _x,
            y: _y
        }

        this.glow = 0;
        this.isGlowing = false;

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, "sprFlowersBlue", 0);
        this.sprite.depth = this.pos.y-1; //-10;
    }

    update(){
        if(this.isGlowing === false){
            if(this.glow > 0){
                this.glow -= 0.01;
                this.sprite.setTexture("sprFlowersBlue", Math.floor(Math.max(0, Math.min(2, this.glow))));
            }
        }else{
            if(this.glow < 3){
                this.glow += 0.5;
                this.sprite.setTexture("sprFlowersBlue", Math.floor(Math.max(0, Math.min(2, this.glow))));
            }
        }
    }

    destroy(){
        this.sprite.destroy();
    }
}