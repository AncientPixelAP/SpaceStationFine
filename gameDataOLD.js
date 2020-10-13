class GameData {
    constructor() {
        this.states = {
            NORMAL: 0,
            HUG: 1,
            PUSH: 2
        };
        this.players = [];
        this.level = {balls: [{
                id: 0,
                pos: {
                    x: 48,
                    y: 16
                },
                vel: {
                    x: 0,
                    y: 0
                }
            }],
            crates: [],
            buttons: [],
            glowies: [],
            glowTree: {
                dust: 0
            }
        }
    }

    createPlayer(_x, _y, _id){
        this.players.push({
            pos: {
                x: _x,
                y: _y
            },
            id: _id,
            state: this.states.NORMAL
        })
    }

    kickPlayer(_id){
        for(let i = this.players.length-1 ; i >= 0 ; i--){
            if(this.players[i].id === _id){
                this.players.splice(i, 1);
            }
        }
    }

    setPosition(_id, _x, _y){
        for(let p of this.players){
            if(p.id === _id){
                p.pos.x = _x;
                p.pos.y = _y;
            }
        }
    }

    setPlayer(_data){
        for (let p of this.players) {
            if (p.id === _data.id) {
                p.pos.x = _data.pos.x;
                p.pos.y = _data.pos.y;
                p.state = _data.state;
            }
        }
    }

    getPosition(_id){
        let ret = {
            x: 0,
            y: 0
        }
        let arr = this.players.filter((p) => {return p.id === _id});
        if(arr.length > 0){
            ret.x = arr[0].pos.x;
            ret.y = arr[0].pos.y;
            //console.log(arr[0]);
        }
        return ret;
    }

    addDustTree(_dust){
        this.level.glowTree.dust += _dust;
    }

    setBall(_data) {
        /*for (let b of this.level.players) {
            if (p.id === _data.id) {
                p.pos.x = _data.pos.x;
                p.pos.y = _data.pos.y;
                p.state = _data.state;
            }
        }*/
        let arr = this.level.balls.filter((o) => {return o.id === _data.id});
        if(arr.length > 0){
            arr[0].pos.x = _data.pos.x;
            arr[0].pos.y = _data.pos.y;
        }
    }
}
module.exports = GameData;