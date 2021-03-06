var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
let server = app.listen(port, () => {
    console.log("running on port " + String(port));
});

app.use(express.static(__dirname  + "/public"));

let socket = require("socket.io");
let io = socket(server);

let GameData = require("./gameData");
let gameData = new GameData();

let tick = setInterval(() => { 
    gameData.update();

    for(let p of gameData.players){
        //get sector update
        io.to(p.id).emit("sectorUpdate", {
            sectorData: p.sector, 
            playersAtLocation: getPlayersAtLocation(p.locationId),
            npcsAtLocation: getNPCsAtLocation(p.locationId),
            groupData: gameData.group
        });
    }
}, 1000);

io.on("connection", socket => {
    console.log(socket.id);
    let id = socket.id;

    

    //TEST
    socket.on("pingTest", (_data) => {
        console.log("ping!");
        io.emit("pongTest", _data);
    });
    socket.on("foo", () => {
        console.log("foobar!");
        io.emit("bar", {text: "bar"});
    });


    //PLAYERS
    socket.on("joinPlayer", (_data) => {
        gameData.spawnPlayer(id);
        let loc = getLocationById(_data.locationId);
        if(loc.length <= 0){
            loc = gameData.sectors[0].locations;
        }
        let sec = getSectorById(loc.sectorId);
        if(sec.length <= 0){
            sec = gameData.sectors;
        }
        gameData.players[gameData.players.length-1].setLocation(loc[0]);
        gameData.players[gameData.players.length-1].setSector(sec[0]);
        gameData.players[gameData.players.length-1].setName(_data.name);
        io.to(id).emit("getLocation", {
            playerData: gameData.players[gameData.players.length-1],
            locationData: loc[0],
            effect: "none"
        });
    });

    socket.on("requestPlayersAtLocation", (_data) => {
        let players = getPlayersAtLocation(_data.id);
        io.to(id).emit("getPlayersAtLocation", players);
    });

    socket.on("requestSectorLocations", (_data) => {
        for (let p of gameData.players) {
            if (p.location.id === _data.id) {
                io.to(p.id).emit("getSectorLocations", p.sector);
            }
        }
    });

    socket.on("revealSectorLocations", (_data) => {
        for(let l of _data.locationIds){
            let loc = getLocationById(l);
            if(loc.length > 0){
                loc[0].unknown = false;
                loc[0].hidden = false;
            }
        }
    });

    socket.on("setCourse", (_data) => {
        let player = getPlayerById(id);
        if(player !== null){
            player.location.impulseFactor = _data.impulseFactor;
            player.location.spd = _data.spd;
            //player.location.heading = _data.heading;
            player.location.target.heading = _data.heading;
            player.location.headingCoords = _data.headingCoords;
        }
    });

    socket.on("beamPlayer", (_data) => {
        let player = getPlayerById(_data.playerId);
        let loc = getLocationById(_data.locationId)[0];
        player.setLocation(loc);

        io.to(_data.playerId).emit("getLocation", {
            playerData: player,
            locationData: loc,
            effect: "beamed"
        });

        io.to(_data.playerId).emit("quickMessage", {
            txt: "you got beamed to " + loc.id
        });
    });

    socket.on("movePlayer", (_data) => {
        let player = getPlayerById(_data.playerId);
        let loc = getLocationById(_data.locationId)[0];
        player.setLocation(loc);

        io.to(_data.playerId).emit("getLocation", {
            playerData: player,
            locationData: loc,
            effect: "moved"
        });

        io.to(_data.playerId).emit("quickMessage", {
            txt: "you entered " + loc.id
        });
    });

    socket.on("moveCargoToLocation", (_data) => {
        let loc = getLocationById(_data.locationId)[0];
        loc.addInventory(_data.cargo);
    });

    socket.on("removeLocation", (_data) => {
        /*todo remove location from sector*/
    });

    socket.on("readyDockingAt", (_data) => {
        let loc = getLocationById(_data.locationId);
        let at = getLocationById(_data.otherId);
        loc[0].readyDockingAt(at[0]);
    });

    socket.on("dockAt", (_data) => {
        let loc = getLocationById(_data.locationId);
        let at = getLocationById(_data.otherId);
        loc[0].dockAt(at[0]);

        for(let p of gameData.players){
            if(p.locationId === _data.locationId){
                io.to(p.id).emit("quickMessage", {
                    txt: "docking at " + at[0].id
                });
            }
        }
    });

    socket.on("undockFrom", (_data) => {
        let loc = getLocationById(_data.locationId);
        let from = getLocationById(_data.fromId);
        loc[0].undockFrom(from[0]);

        for(let p of gameData.players){
            if(p.locationId === _data.locationId){
                io.to(p.id).emit("quickMessage", {
                    txt: "undocked from " + from[0].id
                });
            }
        }
    });

    socket.on("setAlert", (_data) => {
        getLocationById(_data.locationId)[0].alert = _data.alert;
    });

    socket.on("quickMessage", (_data) => {
        for(let p of gameData.players){
            if(p.locationId === _data.locationId){
                io.to(p.id).emit("quickMessage", {
                    txt: _data.txt
                });
            }
        }
    });

    socket.on("addToPlayerInventory", (_data) => {
        let player = getPlayerById(_data.playerId);
        if(player !== null){
            player.addInventory(_data.item, _data.amount, _data.unique);
            //item must has a name, type, and data object
        }
    });

    socket.on("talkToNPC", (_data) => {
        let npc = getNPCByName(_data.npcName);
        if(npc !== null){
            if (npc.conversation.speakingTo.id === null || npc.conversation.speakingTo.id === id){
                npc.conversation.treePosition = _data.npcTreePosition;
                npc.conversation.speakingTo = {
                    name: _data.playerName,
                    id: _data.playerId
                }
            }
            io.to(id).emit("npcUpdate", {
                npc: npc
            });
        }
    });

    socket.on("stopTalkToNPC", (_data) => {
        let npc = getNPCByName(_data.npcName);
        if(npc !== null){
            //if (npc.conversation.speakingTo.id === null || npc.conversation.speakingTo.id === id) {
                npc.conversation.speakingTo = {
                    name: null,
                    id: null
                }
            //}
            io.to(id).emit("npcUpdate", {
                npc: npc
            });
        }
    });

    //DISCONNECT
    socket.on("disconnect", () => {
        console.log("disconnected a client "+ id);

        //remove player id from npc if talking while connected
        for(let n of gameData.npcs){
            if(n.conversation.speakingTo.id === id){
                n.conversation.speakingTo = {
                    name: null,
                    id: null
                }
            }
        }

        gameData.removePlayer(id);
        io.emit("kickPlayer", {
            id: id
        })
    })
});


function getPlayerById(_id){
    let arr = gameData.players.filter((p) => {return p.id === _id});
    if(arr.length > 0){
        return arr[0];
    }else{
        return null;
    }
}

function getLocationById(_id){
    let found = [];
    for(let s of gameData.sectors){
        let arr = s.locations.filter((loc) => { return loc.id === _id });
        if (arr.length > 0){
            found.push(arr[0]);
        }
    }
    return found;
}

function getPlayersAtLocation(_id) {
    let found = [];
    let loc = getLocationById(_id);
    if(loc.length > 0){
        let arr = gameData.players.filter((p) => { return p.locationId === _id });
        if (arr.length > 0) {
            for(let a of arr){
                found.push(a);
            }
        }
    }
    return found;    
}

function getNPCByName(_name) {
    let arr = gameData.npcs.filter((p) => { return p.name === _name });
    if (arr.length > 0) {
        return arr[0];
    } else {
        return null;
    }
}

function getNPCsAtLocation(_id) {
    let found = [];
    let loc = getLocationById(_id);
    if (loc.length > 0) {
        let arr = gameData.npcs.filter((p) => { return p.locationId === _id });
        if (arr.length > 0) {
            for (let a of arr) {
                found.push(a);
            }
        }
    }
    return found;
}

function getSectorById(_id){
    return gameData.sectors.filter((s) => { return s.name === _id });
}

function getLocationsInSector(_sector){
    let arr = gameData.locations.filter((loc) => { return loc.sector.x === _sector.x && loc.sector.y === _sector.y && loc.sector.z === _sector.z });
    if(arr.length > 0){
        return arr;
    }else{
        return [];
    }
}

