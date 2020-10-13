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
        //let ploc = getLocationById(p.location.id);
        let secD = getLocationsInSector({x: p.location.sector.x, y: p.location.sector.y, z: p.location.sector.z});
        if(secD.length > 0){
            io.to(p.id).emit("sectorUpdate", {
                sectorData: secD
            });
        }
    }
    //io.emit("pongTest", {data: "tick"});
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
        //add freshly joined Player in GameData and send back the GameData for setup in phaser
        gameData.addPlayer(id, "Enterprise");
        let player = gameData.players.filter((p) => {return p.id === id});
        if (player.length > 0){
            let location = gameData.locations.filter((loc) => { return loc.id === player[0].location.id })
            io.to(id).emit("getLocation", {
                playerData: player[0],
                locationData: location[0]
            })
        }
    });

    socket.on("requestSectorLocations", (_data) => {
        let locs = getLocationsInSector({x: _data.sector.x, y: _data.sector.y, z: _data.sector.z});
        if(locs.length > 0){
            for (let p of gameData.players) {
                if (p.location.id === _data.id) {
                    io.to(p.id).emit("getSectorLocations", locs);
                }
            }
        }
    });

    socket.on("setCourse", (_data) => {
        let ship = getLocationById(_data.id);
        if(ship !== null){
            ship.impulseFactor = _data.impulseFactor;
            ship.spd = _data.spd;
            ship.heading = _data.heading;
            ship.headingCoords = _data.headingCoords;
        }
    });

    //DISCONNECT
    socket.on("disconnect", () => {
        console.log("disconnected a client "+ id);
        gameData.removePlayer(id);
        io.emit("kickPlayer", {
            id: id
        })
    })
});

function getLocationById(_id){
    let arr = gameData.locations.filter((loc) => { return loc.id === _id });
    if (arr.length > 0){
        return arr[0];
    }else{
        return null;
    }
}

function getLocationsInSector(_sector){
    let arr = gameData.locations.filter((loc) => { return loc.sector.x === _sector.x && loc.sector.y === _sector.y && loc.sector.z === _sector.z });
    if(arr.length > 0){
        return arr;
    }else{
        return [];
    }
}