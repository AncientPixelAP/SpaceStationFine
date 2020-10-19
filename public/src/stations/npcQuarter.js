import Button from "../lcars/button.js";

export default class NPCQuarter {
    constructor(_scene, _data) {
        this.scene = _scene;
        this.data = _data;

        this.pos = {
            x: 0,
            y: 0
        }

        this.conversation = {
            file: "",
            treePosition: 0
        }

        this.npcText = this.scene.add.bitmapText(this.pos.x, this.pos.y, "pixelmix", "npcText", 8, 1).setOrigin(0.5);

        this.btnOptions = [];
    }

    update() {

    }

    createOptions(){
        for(let b of this.btnOptions){
            b.btn.destroy();
        }
        this.btnOptions = [];
    }

    setConversation(_file, _startNo){
        this.conversation.file = _file;
        this.conversation.treePosition = _startNo;
    }

    move() {
        this.npcText.x = this.pos.x;
        this.npcText.y = this.pos.y;

        for(let [i, b] of this.btnOptions){
            b.move(this.pos.x, this.pos.y + (i * 18));
        }
    }

    synchronize() {
        
    }

    destroy() {
        this.npcText.destroy();

        for (let b of this.btnOptions) {
            b.btn.destroy();
        }
        this.btnOptions = [];
    }
}