export default class Wall{
    constructor(_scene, _x, _y, _asset){
        this.scene = _scene;
        this.pos = {
            x: _x,
            y: _y
        }

        this.sprite = this.scene.add.sprite(this.pos.x, this.pos.y, _asset);
        this.sprite.depth = this.pos.y;
    }

    setType(_type){
        switch(_type){
            case "hor":
                this.sprite.setTexture("sprWallHalfFront");
            break;
            case "ver":
                this.sprite.setTexture("sprWallHalfTop");
            break;
            case "corner":
                this.sprite.setTexture("sprWallHalfCorner");
            break;
            default:
            break;
        }
    }
}