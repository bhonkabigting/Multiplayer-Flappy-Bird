const express = require("express");
const app = express();
const server = app.listen(8000);
const io = require("socket.io")(server);

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("index");
});

const players = [];

function remove_player(array, player){
    for(let i in array){
        if(array[i]==player){
            array.splice(i,1);
            break;
        }
    }
}

io.on("connection", function (socket) {
    socket.on("new", function (data) {
        players.push(socket.id)

        if (socket.id === players[0]) {
            socket.emit("blue");
        }
        else if (socket.id === players[1]) {
            socket.emit("red");
        }
        else {
            socket.emit("gray");
        }
    });

    socket.on("start_game", function () {
        if (socket.id === players[0] || socket.id === players[1]) {
            io.emit("game");
        }
    });

    socket.on("jump", function () {
        if (socket.id === players[0]) {
            io.emit("blue_jump");
        }
        else if (socket.id === players[1]) {
            io.emit("red_jump");
        }
    });

    socket.on("update", function () {
        if (socket.id === players[0]) {
            io.emit("updated");
        }
    });

    socket.on("move_pipe", function () {
        let y = -Math.floor(Math.random() * 208);
        io.emit("set_pipe_y", y);
    });

    socket.on("blue_wins", function () {
        let winner = {
            "msg": "Blue Bird Wins",
            "color": "#40A4D2"
        }
        io.emit("end", winner);
    });

    socket.on("red_wins", function () {
        let winner = {
            "msg": "Red Bird Wins",
            "color": "#CA0100"
        }
        io.emit("end", winner);
    });

    socket.on("disconnect", function () {

        remove_player(players, socket.id);
        socket.to(players[0]).emit("blue");
        socket.to(players[1]).emit("red");
    });
});

console.log("App is running on port 8000.");