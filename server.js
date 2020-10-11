var port = 3000;
var express = require('express');
var path = require('path');
var app = express();
let server = app.listen(port);
//var server = require("http").createServer(app);

/*server.listen(port, function() {
    console.log("running on port " + String(port));
});*/

app.use(express.static(path.join(__dirname, 'public')));

let socket = require("socket.io");
let io = socket(server);

let GameData = require("./gameData");
let gameData = new GameData();

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
        gameData.createPlayer(_data.pos.x, _data.pos.y, socket.id);
        io.to(socket.id).emit("joinGame", {
            players: gameData.players,
            level: gameData.level,
            you: socket.id
        })
    });

    socket.on("updateBall", (_data) => {
        gameData.setBall({
            id: _data.id,
            pos: {
                x: _data.pos.x,
                y: _data.pos.y
            }
        })
    });

    socket.on("updateTree", (_data) => {
        gameData.addDustTree(_data.dust);
    })

    socket.on("updatePlayer", (_data) => {
        gameData.setPlayer({
            id: id,
            pos: {
                x: _data.pos.x,
                y: _data.pos.y
            },
            state: _data.state,
            dust: _data.dust
        });
    })

    socket.on("requestUpdate", () => {
        io.to(socket.id).emit("getUpdate", {
            players: gameData.players,
            level: gameData.level
        });
    });
   

    //DISCONNECT
    socket.on("disconnect", () => {
        console.log("disconnected a client "+ id);
        gameData.kickPlayer(id);
        io.emit("kickPlayer", {
            id: id
        })
    })
});


/*

let port = 3000;

var express = require('express');
var path = require('path');
var app = express();
let server = app.listen(port);
app.use(express.static(path.join(__dirname, 'public')));

let socket = require("socket.io");
let io = socket(server);

let Ship = require("./ship");
let ship = new Ship();

io.on("connection", socket => {
    
    console.log(socket.id);

    //TEST
    socket.on("ping", (_data) => {
        console.log("ping!");
        io.emit("pong", _data);
    });

    //CHAT
    socket.on("chatSend", (_data) => {
        io.emit("chatReceive", _data);
    });

    //GET SHIP
    socket.on("getShip", () => {
        io.emit("setShip", ship);
    });

    //NAV
    socket.on("navSetPosition", (_data) => {
        ship.position.x = _data.x;
        ship.position.y = _data.y;
        ship.position.z = _data.z;
        ship.ressources.deuterium -= _data.deuterium;
        io.emit("setShip", ship);
    });
    socket.on("navSetCourse", (_data) => {
        io.emit("setCourse", _data);
    });

    socket.on("opsAddDeuterium", (_data) => {
        ship.ressources.deuterium += _data.deuterium;
        io.emit("setDeuterium", {
            deuterium: ship.ressources.deuterium
        })
    })

});

*/