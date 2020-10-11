export default class Player {
    constructor(_scene, _x, _y, _id) {
        this.scene = _scene;
        this.pos = {
            x: _x,
            y: _y
        }
        this.id = _id;
        this.spd = 0.5;
        this.state = PLAYERSTATES.NORMAL;
        this.dust = 1;

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, "sprHugtronaut");
        this.sprite.depth = this.pos.y+4;
    }

    update() {

    }

    sendPlayer(){
        socket.emit("updatePlayer", {
            pos: {
                x: this.pos.x,
                y: this.pos.y
            },
            state: this.state
        });
    }

    move(_x, _y){
        let a = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, _x, _y);

        this.sprite.x += Math.cos(a) * this.spd;
        this.sprite.y += Math.sin(a) * this.spd;

        this.pos.x = this.sprite.x;
        this.pos.y = this.sprite.y;
    }

    setPosition(_x, _y){
        this.sprite.x = _x;
        this.sprite.y = _y;

        this.pos.x = this.sprite.x;
        this.pos.y = this.sprite.y;
    }

    setState(_state) {
        this.state = _state;
        switch (this.state) {
            case PLAYERSTATES.NORMAL:
                this.sprite.setTexture("sprHugtronaut");
            break;
            case PLAYERSTATES.HUG:
                this.sprite.setTexture("sprHugtronautArms");
            break;
            case PLAYERSTATES.PUSH:
                this.sprite.setTexture("sprHugtronaut");
                break;
            default:
            break;
        }
    }

    destroy() {
        this.sprite.destroy();
    }

    zSort(){
        this.sprite.depth = this.pos.y+4;
    }
}