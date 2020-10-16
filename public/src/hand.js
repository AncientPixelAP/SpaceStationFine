export default class Hand{
    constructor(_scene){
        this.scene = _scene;

        this.justPressed = false;
        this.pressed = false;
        this.justReleased = false;

        this.pos = {
            x: 0,
            y: 0
        }

        //this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, "sprHandOpen");
        //this.sprite.depth = 100;
    }

    update(){
        this.pos.x = this.scene.input.activePointer.worldX;
        this.pos.y = this.scene.input.activePointer.worldY;

        //this.sprite.x = this.pos.x + 8;
        //this.sprite.y = this.pos.y + 64;

        if(this.scene.input.activePointer.isDown){
            if(this.pressed === false){
                this.justPressed = true;
                this.pressed = true;
                this.justReleased = false;
            }else{
                this.justPressed = false;
            }
        }else{
            /*if (this.justReleased === false) {
                if(this.pressed === true){
                    this.justReleased = true;
                }
            }else{
                this.justReleased = false;
            }
            this.pressed = false;
            this.justPressed = false;*/
            if(this.pressed === true){
                this.pressed = false;
                this.justReleased = true;
                this.justPressed = false;
            }else{
                this.justReleased = false;
            }
        }
    }
}