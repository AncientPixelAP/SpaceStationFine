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
            sectorData: p.sector 
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
        let loc = gameData.sectors[0].locations[0];
        gameData.players[gameData.players.length-1].setLocation(loc);
        gameData.players[gameData.players.length-1].setSector(gameData.sectors[0]);
        io.to(id).emit("getLocation", {
            playerData: gameData.players[gameData.players.length-1],
            locationData: loc
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

    socket.on("setCourse", (_data) => {
        let player = getPlayerById(id);
        if(player !== null){
            player.location.impulseFactor = _data.impulseFactor;
            player.location.spd = _data.spd;
            player.location.heading = _data.heading;
            player.location.headingCoords = _data.headingCoords;
        }
    });

    socket.on("beamPlayer", (_data) => {
        let player = getPlayerById(_data.playerId);
        let loc = getLocationById(_data.locationId)[0];
        player.setLocation(loc);

        io.to(_data.playerId).emit("getLocation", {
            playerData: player,
            locationData: loc
        });
    })

    //DISCONNECT
    socket.on("disconnect", () => {
        console.log("disconnected a client "+ id);
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



function getLocationsInSector(_sector){
    let arr = gameData.locations.filter((loc) => { return loc.sector.x === _sector.x && loc.sector.y === _sector.y && loc.sector.z === _sector.z });
    if(arr.length > 0){
        return arr;
    }else{
        return [];
    }
}

