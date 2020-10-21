export class SliderHorizontal{
    constructor(_scene, _pos, _start, _width) {
        this.scene = _scene;
        this.pos = _pos;
        this.start = _start;
        this.width = _width;
        this.autoReturn = false;
        this.margin = 15;

        this.colors = {
            out: LCARSCOLOR.offBlue,
            over: LCARSCOLOR.blue,
            on: LCARSCOLOR.orange
        }

        this.states = {
            out: 0,
            over: 1,
            on: 2
        }
        this.state = this.states.out;
        this.active = false;
        this.value = 0;

        this.releaseFunc = () => { };
        this.changeFunc = () => { };
        this.minFunc = () => { };
        this.maxFunc = () => { };

        this.sliderEndRight = this.scene.add.sprite(this.pos.x + (this.width * 0.5) - 8, this.pos.y, "sprLcarsPipRight16");
        this.sliderEndRight.setTintFill(LCARSCOLOR.offPink);
        this.sliderEndLeft = this.scene.add.sprite(this.pos.x - (this.width * 0.5) + 8, this.pos.y, "sprLcarsPipLeft16");
        this.sliderEndLeft.setTintFill(LCARSCOLOR.offPink);

        this.range = Phaser.Math.Distance.Between(this.sliderEndLeft.x + this.margin, 0, this.sliderEndRight.x - this.margin, 0);
        this.sliderPos = {
            x: this.sliderEndLeft.x + (this.range * this.start),
            y: this.pos.y
        }
        this.sliderTarget = {
            follow: false,
            x: 0,
            y: 0
        }

        this.sliderLights = [];
        for (let i = 0; i <= this.range; i += 12) {
            this.sliderLights.push(this.scene.add.sprite(this.pos.x, this.pos.y, "sprLcarsSlider16"));
        }

        this.slider = this.scene.add.sprite(this.sliderPos.x, this.sliderPos.y, "sprLcarsSlider16");
        this.slider.setTintFill(LCARSCOLOR.gold);

        this.colorInState(this.state);
    }

    update() {
        if (this.slider.getBounds().contains(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY)) {
            if (this.scene.hand.pressed === false) {
                this.switchState(this.states.over);
                this.active = false;
            }
            if (this.scene.hand.justPressed === true) {
                this.switchState(this.states.on);
                this.sliderTarget.follow = true;
                this.active = true;
            }
            if (this.scene.hand.justReleased === true) {
                this.sliderTarget.follow = false;
                this.releaseFunc();
                this.active = false;
            }
        } else {
            if (this.active === false) {
                this.switchState(this.states.out);
            } else {
                if (this.scene.hand.justReleased === true) {
                    this.sliderTarget.follow = false;
                    this.active = false;
                    if (this.slider.x >= this.sliderEndRight.x - this.margin) {
                        //releasing on top
                        this.maxFunc();
                    } else if (this.slider.x <= this.sliderEndLeft.x + this.margin) {
                        //releasing on bottom
                        this.minFunc();
                    } else {
                        //releasing anywhere
                        this.releaseFunc();
                    }
                }
            }
        }

        for (let l of this.sliderLights) {
            if (l.x < this.slider.x) {
                l.setTintFill(LCARSCOLOR.gold);
            } else {
                l.setTintFill(0x000000);
            }
        }

        if (this.sliderTarget.follow === true) {
            this.sliderPos.x = Math.min(this.sliderEndRight.x - this.margin, Math.max(this.scene.input.activePointer.worldX, this.sliderEndLeft.x + this.margin));
            this.slider.x = this.sliderPos.x;
        } else {
            if (this.autoReturn === true) {
                if (this.slider.x > this.sliderEndLeft.x + this.margin) {
                    this.sliderPos.x -= this.range * 0.01;
                } else {
                    this.sliderPos.x = this.sliderEndLeft.x + this.margin;
                }
                this.slider.x = this.sliderPos.x;
            }
        }

        this.value = Phaser.Math.Distance.Between(this.sliderEndLeft.x + this.margin, 0, this.sliderPos.x, 0) / this.range;
    }

    switchState(_state) {
        if (this.state !== _state) {
            this.state = _state;
            this.colorInState(this.state);
        }
    }

    colorInState(_state) {
        switch (this.state) {
            case this.states.out:
                this.slider.setTintFill(this.colors.out);
                break;
            case this.states.over:
                this.slider.setTintFill(this.colors.over);
                break;
            case this.states.on:
                this.slider.setTintFill(this.colors.on);
                break;
            default:
                break;
        }
    }

    move(_x, _y) {
        this.pos.x = _x;
        this.pos.y = _y;

        this.sliderEndLeft.x = this.pos.x - (this.width * 0.5) + 8;
        this.sliderEndLeft.y = this.pos.y;
        this.sliderEndRight.x = this.pos.x + (this.width * 0.5) - 8;
        this.sliderEndRight.y = this.pos.y;

        for (let [i, l] of this.sliderLights.entries()) {
            l.x = this.sliderEndLeft.x + this.margin + (i * 12);
            l.y = this.sliderEndLeft.y;
        }
                    
        this.range = Phaser.Math.Distance.Between(this.sliderEndLeft.x + this.margin, 0, this.sliderEndRight.x - this.margin, 0);
        this.sliderPos = {
            x: this.sliderEndLeft.x + this.margin + (this.range * this.start),
            y: this.pos.y
        }

        this.sliderPos.y = this.pos.y;
        this.slider.x = this.sliderPos.x;
        this.slider.y = this.sliderPos.y;
    }

    destroy() {
        this.sliderEndLeft.destroy();
        this.sliderEndRight.destroy();
        this.slider.destroy();

        for (let l of this.sliderLights) {
            l.destroy();
        }
    }
}

export class SliderVertical {
    constructor(_scene, _pos, _start, _height) {
        this.scene = _scene;
        this.pos = _pos;
        this.start = _start;
        this.height = _height;
        this.autoReturn = false;
        this.margin = 15;

        this.colors = {
            out: LCARSCOLOR.offBlue,
            over: LCARSCOLOR.blue,
            on: LCARSCOLOR.orange
        }

        this.states = {
            out: 0,
            over: 1,
            on: 2
        }
        this.state = this.states.out;
        this.active = false;
        this.value = 0;

        this.releaseFunc = () => {};
        this.changeFunc = () => {};
        this.minFunc = () => {};
        this.maxFunc = () => {};

        this.sliderEndTop = this.scene.add.sprite(this.pos.x, this.pos.y - (this.height * 0.5) + 8, "sprLcarsPipLeft16");
        this.sliderEndTop.angle = 90;
        this.sliderEndTop.setTintFill(LCARSCOLOR.offPink);
        this.sliderEndBottom = this.scene.add.sprite(this.pos.x, this.pos.y + (this.height * 0.5) - 8, "sprLcarsPipRight16");
        this.sliderEndBottom.angle = 90;
        this.sliderEndBottom.setTintFill(LCARSCOLOR.offPink);

        this.range = Phaser.Math.Distance.Between(0, this.sliderEndTop.y + this.margin, 0, this.sliderEndBottom.y - this.margin);
        this.sliderPos = {
            x: this.pos.x,
            y: this.sliderEndBottom.y - (this.range * this.start)
        }
        this.sliderTarget = {
            follow: false,
            x: 0,
            y: 0
        }

        this.sliderLights = [];
        for(let i = 0 ; i <= this.range ; i += 12){
            this.sliderLights.push(this.scene.add.sprite(0, 0, "sprLcarsSlider16"));
            this.sliderLights[this.sliderLights.length - 1].angle = 90;
        }

        this.slider = this.scene.add.sprite(this.sliderPos.x, this.sliderPos.y, "sprLcarsSlider16");
        this.slider.angle = 90;
        this.slider.setTintFill(LCARSCOLOR.gold);

        this.colorInState(this.state);
    }

    update(){
        if (this.slider.getBounds().contains(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY)) {
            if (this.scene.hand.pressed === false) {
                this.switchState(this.states.over);
                this.active = false;
            }
            if (this.scene.hand.justPressed === true) {
                this.switchState(this.states.on);
                this.sliderTarget.follow = true;
                this.active = true;
            }
            if (this.scene.hand.justReleased === true) {
                this.sliderTarget.follow = false;
                this.releaseFunc();
                this.active = false;
            }
        } else {
            if(this.active === false){
                this.switchState(this.states.out);
            }else{
                if (this.scene.hand.justReleased === true) {
                    this.sliderTarget.follow = false;
                    this.active = false;
                    if(this.slider.y <= this.sliderEndTop.y + this.margin){
                        //releasing on top
                        this.maxFunc();
                    }else if(this.slider.y >= this.sliderEndBottom.y - this.margin){
                        //releasing on bottom
                        this.minFunc();
                    }else{
                        //releasing anywhere
                        this.releaseFunc();
                    }
                }
            }
        }

        for(let l of this.sliderLights){
            if (l.y > this.slider.y) {
                l.setTintFill(LCARSCOLOR.gold);
            } else {
                l.setTintFill(0x000000);
            }
        }
        
        if(this.sliderTarget.follow === true){
            this.sliderPos.y = Math.min(this.sliderEndBottom.y - this.margin, Math.max(this.scene.input.activePointer.worldY, this.sliderEndTop.y + this.margin));
            this.slider.y = this.sliderPos.y;
        }else{
            if(this.autoReturn === true){
                if (this.slider.y < this.sliderEndBottom.y - this.margin){
                    this.sliderPos.y += this.range * 0.01;
                }else{
                    this.sliderPos.y = this.sliderEndBottom.y - this.margin;
                }
                this.slider.y = this.sliderPos.y;
            }
        }

        this.value = Phaser.Math.Distance.Between(0, this.sliderPos.y, 0, this.sliderEndBottom.y - this.margin)/this.range;
    }

    switchState(_state) {
        if (this.state !== _state) {
            this.state = _state;
            this.colorInState(this.state);
        }
    }

    colorInState(_state) {
        switch (this.state) {
            case this.states.out:
                this.slider.setTintFill(this.colors.out);
                break;
            case this.states.over:
                this.slider.setTintFill(this.colors.over);
                break;
            case this.states.on:
                this.slider.setTintFill(this.colors.on);
                break;
            default:
                break;
        }
    }

    move(_x, _y){
        this.pos.x = _x;
        this.pos.y = _y;

        this.sliderEndTop.x = this.pos.x;
        this.sliderEndTop.y = this.pos.y - (this.height * 0.5) + 8;
        this.sliderEndBottom.x = this.pos.x;
        this.sliderEndBottom.y = this.pos.y + (this.height * 0.5) - 8;

        for(let [i, l] of this.sliderLights.entries()){
            l.x = this.sliderEndBottom.x;
            l.y = this.sliderEndBottom.y - this.margin - (i * 12);
        }

        this.range = Phaser.Math.Distance.Between(0, this.sliderEndTop.y+this.margin, 0, this.sliderEndBottom.y-this.margin);
        this.sliderPos = {
            x: this.pos.x,
            y: this.sliderEndBottom.y - this.margin - (this.range * this.start)
        }

        this.sliderPos.x = this.pos.x;
        this.slider.x = this.sliderPos.x;
        this.slider.y = this.sliderPos.y;
    }

    destroy(){
        this.sliderEndTop.destroy();
        this.sliderEndBottom.destroy();
        this.slider.destroy();

        for(let l of this.sliderLights){
            l.destroy();
        }
    }
}