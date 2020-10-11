export default class Ball{
    constructor(_scene, _x, _y, _id){
        this.scene = _scene;
        this.pos = {
            x: _x,
            y: _y
        }
        this.vel = {
            x: 0,
            y: 0
        }
        this.id = _id;
        this.air = 0;

        //this.shadow = this.scene.add.sprite(this.pos.x, this.pos.y, "sprBallShadow");
        //this.shadow.depth = this.pos.y;

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, "sprBall");
        this.sprite.depth = this.pos.y-1;
    }

    update(){
        if(Math.abs(this.vel.x) > 0.1 || Math.abs(this.vel.y) > 0.1){
            //TODO send update to server
            let d = Phaser.Math.Distance.Between(0, 0, this.vel.x, this.vel.y);
            let a = Phaser.Math.Angle.Between(0, 0, this.vel.x, this.vel.y);
            this.pos.x += Math.cos(a) * (d/ 0.5);
            this.pos.y += Math.sin(a) * (d / 0.5);

            this.vel.x *= 0.95;
            this.vel.y *= 0.95;

            //this.shadow.x = this.pos.x;
            //this.shadow.y = this.pos.y;

            this.sprite.x = this.pos.x;
            this.sprite.y = this.pos.y;

            socket.emit("updateBall", {
                id: this.id,
                pos: {
                    x: this.pos.x,
                    y: this.pos.y
                }
            });
        }else{
            this.vel.x = 0;
            this.vel.y = 0;
        }
    }

    move(_x, _y, _vx, _vy) {
        this.pos.x = _x;
        this.pos.y = _y;

        //this.shadow.x = this.pos.x;
        //this.shadow.y = this.pos.y;

        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y + this.air;
    }

    kick(_x, _y){
        this.vel.x = _x * 0.01;
        this.vel.y = _y * 0.01;
    }

    destroy(){
        //this.shadow.destroy();
        this.sprite.destroy();
    }

    zSort(){
        //this.shadow.depth = this.pos.y;
        this.sprite.depth = this.pos.y-1;
    }
}