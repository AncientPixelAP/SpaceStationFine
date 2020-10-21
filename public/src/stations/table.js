import Button from "../lcars/button.js";
import ListButton from "../lcars/listButton.js";

export default class Table {
    constructor(_scene, _data) {
        this.scene = _scene;
        this.data = _data;

        this.pos = {
            x: 0,
            y: 0
        }

        this.players = [];
    }

    update() {

    }

    move(){
        for(let [i, p] of this.players.entries()){
            p.btn.move(this.pos.x - 168, this.pos.y - 80 + (i * 18));
        }
    }

    synchronize(){
        if(this.scene.playersData !== null){
            for(let dp of this.scene.playersData){
                let found = false;
                for(let b of this.players){
                    if(b.data.name === dp.name){
                        found = true;
                    }
                }
                if(found === false){
                    //TODO filter fir rooms and station to only show players on table
                    this.players.push({
                        data: dp,
                        btn: new ListButton(this.scene, {x: this.pos.x, y: this.pos.y}, dp.name, false, () => {})
                    })
                }
            }
        }   
    }

    destroy() {

    }
}