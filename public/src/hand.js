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
    }

    update(){
        this.pos.x = this.scene.input.activePointer.worldX;
        this.pos.y = this.scene.input.activePointer.worldY;

        if(this.scene.input.activePointer.isDown){
            if(this.justPressed === false){
                this.justPressed = true;
            }else{
                this.justPressed = false;
            }
            this.justReleased = false;
            this.pressed = true;
        }else{
            if (this.justReleased === false) {
                if(this.pressed === true){
                    this.justReleased = true;
                }
            }else{
                this.justReleased = false;
            }
            this.justPressed = false;
            this.pressed = false;
        }
    }
}