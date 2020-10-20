import Button from "../lcars/button.js";
import ListButton from "../lcars/listButton.js";

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
            treePosition: -1
        }

        this.npcText = this.scene.add.bitmapText(this.pos.x, this.pos.y - 80, "pixelmix", "npcText", 8, 1).setOrigin(0.5);
        this.npcText.maxWidth = 336;

        this.npcName = "";

        this.btnOptions = [];
        //this.setConversation("bajaCaptain00", 0);
    }

    update() {
        for(let b of this.btnOptions){
            b.btn.update();
        }
    }

    createOptions(){
        for(let b of this.btnOptions){
            b.btn.destroy();
        }
        this.btnOptions = [];

        for (let [i, a] of this.conversation.file.cards[this.conversation.treePosition].answers.entries()){
            this.btnOptions.push({
                data: a,
                btn: new ListButton(this.scene, { x: this.pos.x - 150, y: this.pos.y - 8 + (i * 18)}, a.text, false, () => {
                    this.goto(a.toId);
                    socket.emit("talkToNPC", {
                        name: this.npcName,
                        treePosition: this.conversation.treePosition
                    })
                })
            });
        }
    }

    goto(_id){
        this.conversation.treePosition = _id;
        this.npcText.setText(this.conversation.file.cards[this.conversation.treePosition].text);
        this.createOptions();
    }

    setConversation(_fileName, _startId){
        this.conversation.file = this.scene.cache.json.get(_fileName)/*_fileName*/;
        this.conversation.treePosition = _startId;
        this.goto(_startId);
    }

    move() {
        this.npcText.x = this.pos.x;
        this.npcText.y = this.pos.y - 80;

        for(let [i, b] of this.btnOptions.entries()){
            b.btn.move(this.pos.x - 150, this.pos.y - 8 + (i * 18));
        }
    }

    synchronize() {
        if(this.scene.npcsData !== null){
            let arr = this.scene.npcsData.filter((n) => {return n.stationId === this.data.name})
            if(arr.length > 0){
                this.npcName = arr[0].name;
                if(this.conversation.treePosition === -1){
                    this.setConversation(arr[0].conversation.file, arr[0].conversation.treePosition);
                }else{
                    this.goto(arr[0].conversation.treePosition);
                }
            }
        }
    }

    destroy() {
        this.npcText.destroy();

        for (let b of this.btnOptions) {
            b.btn.destroy();
        }
        this.btnOptions = [];
    }
}