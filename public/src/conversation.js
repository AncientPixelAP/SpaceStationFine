export default class Conversation{
    constructor(_scene){
        this.scene = _scene;

        this.text = this.scene.add.bitmapText(0, -48, "pixelmix", "TEST test\nNewLine 097ü", 8, 1).setOrigin(0.5);
        this.answers = [];
        this.currentId = 0;
    }

    loadFile(_filename){
        this.file = this.scene.cache.json.get(_filename);
        console.log(this.file);
    }

    display(_id){
        //destroy old answers
        for (let a of this.answers) {
            a.destroy();
        }

        //check if next sentence to be displayed
        if(_id !== -1){
            this.currentId = _id;
            let data = this.file.conversation[this.currentId];
            this.text.setText(data.text);

            let yy = 0;
            for(let a of data.answers){
                this.answers.push(new Answer(this, this.scene, yy, a));
                yy += this.answers[this.answers.length-1].text.height + 8;
            }

            //interpret actions
            if (data.actions !== undefined) {
                this.interpretActions(data.actions);
            }
        }else{
            //no further text
            this.text.setText("");
        }

        
    }

    interpretActions(_arr){
        switch(_arr[0]){
            case "END":
                console.log("end conversation");
                _arr.splice(0, 1);
            break;
            default:
            break;
        }
        if(_arr.length > 0){
            this.interpretActions(_arr);
        }
    }
}

class Answer{
    constructor(_conversation, _scene, _y, _data){
        this.conversation = _conversation;
        this.scene = _scene;
        this.data = _data;

        this.text = this.scene.add.bitmapText(0, _y, "pixelmix", _data.text, 8, 1).setOrigin(0.5);
        this.text.setInteractive();
        this.text.on("pointerup", () => {
            if(this.data.actions !== undefined){
                this.conversation.interpretActions(this.data.actions);
            }
            this.conversation.display(this.data.target);
        }, this);
    }

    destroy(){
        this.text.destroy();
    }
}