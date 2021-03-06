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

        this.npcNameTxt = this.scene.add.bitmapText(this.pos.x, this.pos.y - 80, "pixelmix", "Name speaking to Player", 8, 1).setOrigin(0, 0);

        this.npcText = this.scene.add.bitmapText(this.pos.x, this.pos.y - 80, "pixelmix", "npcText", 8, 1).setOrigin(0, 0);
        this.npcText.maxWidth = 276;
        this.npcText.setLeftAlign();
        
        this.npcSprite = null;

        this.npcName = "";
        this.npc = null;

        this.btnOptions = [];
    }

    update() {
        for(let b of this.btnOptions){
            if (this.npc.conversation.speakingTo.id === null || this.npc.conversation.speakingTo.id === this.scene.playerData.id) {
                if (b.btn.colors.out !== LCARSCOLOR.offBlue) {
                    b.btn.colors.out = LCARSCOLOR.offBlue;
                    b.btn.colorInState(b.btn.state.out);
                }
                b.btn.update();
            }else{
                if (b.btn.colors.out !== LCARSCOLOR.offOrange){
                    b.btn.colors.out = LCARSCOLOR.offOrange;
                    b.btn.colorInState(b.btn.state.out);
                }
            }
        }
    }

    createOptions(_elem){
        for(let b of this.btnOptions){
            b.btn.destroy();
        }
        this.btnOptions = [];

        for (let [i, a] of _elem.answers.entries()){
            let valid = true;
            //check if option is valid
            if(a.checkFlag !== undefined){
                valid = false;
                //todo check if flag is set
                    valid = true;
            }
            if(a.checkPlayerInventory !== undefined){
                valid = false;
                for(let i of this.scene.playerData.inventory){
                    if(i.type === a.checkPlayerInventory.type && i.data.id === a.checkPlayerInventory.dataId){
                        valid = true;
                    }
                }
            }
            //push conversation option
            if(valid === true){
                this.btnOptions.push({
                    data: a,
                    btn: new ListButton(this.scene, { x: this.pos.x - 150, y: this.pos.y - 8 + (i * 18)}, a.text, false, () => {
                        this.interpret(a.actions.split(" "));
                        socket.emit("talkToNPC", {
                            npcName: this.npcName,
                            npcTreePosition: this.conversation.treePosition,
                            playerId: this.scene.playerData.id,
                            playerName: this.scene.playerData.name
                        });
                    })
                });
            }
        }
    }

    interpret(_actions){
        let arr = _actions;
        switch(arr[0]){
            case "GOTO":
                this.goto(Number(arr[1]));
                arr.splice(0, 2);
                break;
            default:
                arr.splice(0, 1);
                break;
        }
        if(arr.length > 0){
            this.interpret(arr);
        }
    }

    goto(_id){
        this.conversation.treePosition = _id;
        let elem = this.conversation.file.cards.filter((e) => e.id === _id)[0];
        if(elem === undefined){
            elem = this.conversation.file.cards[0];
        }
        this.npcText.setText(this.replaceCheck(elem.text));

        if(this.npcSprite !== null){
            this.npcSprite.destroy();
        }
        this.npcSprite = this.scene.add.sprite(this.pos.x - 142, this.pos.y - 85, elem.sprite);

        if (_id === 0 && this.npc.conversation.speakingTo.id !== null){
            socket.emit("stopTalkToNPC", {
                npcName: this.npc.name
            })
        }
        this.createOptions(elem);
    }

    replaceCheck(_str){
        if(this.npc !== null){
            _str = _str.replace("PLAYERNAME", this.npc.conversation.speakingTo.name !== null ? this.npc.conversation.speakingTo.name : this.scene.playerData.name);
        }else{
            _str = _str.replace("PLAYERNAME", this.scene.playerData.name);
        }
        return _str;
    }

    setConversation(_fileName, _startId){
        this.conversation.file = this.scene.cache.json.get(_fileName);
        this.conversation.treePosition = _startId;
        this.goto(_startId);
    }

    move() {
        this.npcNameTxt.x = this.pos.x - 98;
        this.npcNameTxt.y = this.pos.y + 116;

        this.npcText.x = this.pos.x - 98;
        this.npcText.y = this.pos.y - 98;

        if(this.npcSprite !== null){
            this.npcSprite.x = this.pos.x - 142;
            this.npcSprite.y = this.pos.y - 85;
        }

        for(let [i, b] of this.btnOptions.entries()){
            b.btn.move(this.pos.x - 150, this.pos.y - 8 + (i * 18));
        }

        if(this.pos.x > 0){
            if(this.npc !== null){
                this.goto(this.npc.conversation.treePosition);
                if(this.npc.conversation.speakingTo.name === this.scene.playerData.name){
                    socket.emit("stopTalkToNPC", {
                        npcName: this.npc.name
                    })
                }
            }
        }
    }

    synchronize() {
        if(this.scene.npcsData !== null){
            let arr = this.scene.npcsData.filter((n) => {return n.stationId === this.data.name})
            if(arr.length > 0){
                this.npcName = arr[0].name;
                this.npc = arr[0];
                if (this.npc.conversation.speakingTo.id === null || this.npc.conversation.speakingTo.id === this.scene.playerData.id){
                    if(this.conversation.treePosition === -1){
                        this.setConversation(this.npc.conversation.file, this.npc.conversation.treePosition);
                    }
                    this.npcNameTxt.setText("You are speaking to " + this.npc.name);
                }else{
                    if (this.conversation.treePosition === -1) {
                        this.setConversation(this.npc.conversation.file, this.npc.conversation.treePosition);
                    }else{
                        this.goto(this.npc.conversation.treePosition);
                    }
                    this.npcNameTxt.setText(this.npc.conversation.speakingTo.name + " is speaking to " + this.npc.name);
                }
            }
        }
    }

    destroy() {
        this.npcNameTxt.destroy();
        this.npcText.destroy();
        if(this.npcSprite !== null){
            this.npcSprite.destroy();
        }

        for (let b of this.btnOptions) {
            b.btn.destroy();
        }
        this.btnOptions = [];
    }
}