export default class OtherPlayer {
    constructor(_scene, _x, _y, _id) {
        this.scene = _scene;
        this.pos = {
            x: _x,
            y: _y
        }
        this.id = _id;
        this.state = PLAYERSTATES.NORMAL;
        this.dust = 0;

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, "sprHugtronautBlue");
        this.sprite.depth = this.y+4;
    }

    update() {
        
    }

    move(_x, _y) {
        this.sprite.x = _x;
        this.sprite.y = _y;

        this.pos.x = this.sprite.x;
        this.pos.y = this.sprite.y;
    }

    setState(_state){
        this.state = _state;
        switch(this.state){
            case PLAYERSTATES.NORMAL:
                this.sprite.setTexture("sprHugtronautBlue");
            break;
            case PLAYERSTATES.HUG:
                this.sprite.setTexture("sprHugtronautBlueArms");
            break;
            case PLAYERSTATES.PUSH:
                this.sprite.setTexture("sprHugtronautBlue");
            break;
            default:
            break;
        }
    }

    destroy(){
        this.sprite.destroy();
    }

    zSort(){
        this.sprite.depth = this.pos.y+4;
    }
}