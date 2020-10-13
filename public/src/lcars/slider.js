export class SliderHorizontal{
    constructor(_scene, _pos, _range, _width){
        this.scene = _scene;
        this.pos = _pos;
        this.range = _range;
        this.width = _width;

        this.sliderEndLeft = this.scene.add.sprite(this.pos.x, this.pos.y - (this.width * 0.5), "sprLcarsPipLeft16");
        this.sliderEndRight = this.scene.add.sprite(this.pos.x, this.pos.y + (this.width * 0.5), "sprLcarsPipRight16");
    }
}