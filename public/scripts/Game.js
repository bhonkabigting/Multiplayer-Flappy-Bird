import Bird from "/scripts/Bird.js";
import Pipe from "/scripts/Pipe.js";

const socket = io();

const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
let animation;
let base_x = 0;

const container = document.getElementById("container");

const swoosh = new Audio("/audio/swoosh.wav");
const hit = new Audio("/audio/hit.wav");

const p1 = [
    "sprites/redbird-downflap.png",
    "sprites/redbird-midflap.png",
    "sprites/redbird-upflap.png",
    "sprites/redbird-midflap.png"
];
const p2 = [
    "sprites/bluebird-downflap.png",
    "sprites/bluebird-midflap.png",
    "sprites/bluebird-upflap.png",
    "sprites/bluebird-midflap.png"
];

const red_bird = new Bird(p1, 320);
const blue_bird = new Bird(p2, 280);
const pipe = new Pipe(288, -100);

function animate() {
    socket.emit("update");

    base_x -= 4;
    $('#base').css('background-position', `${base_x}px 0`);

    if (red_bird.posY <= 115 || red_bird.posY >= 580) {
        socket.emit("blue_wins");
    } 
    else if (blue_bird.posY <= 115 || blue_bird.posY >= 580) {
        socket.emit("red_wins");
    }
    else if ((pipe.posX <= 95 && pipe.posX >= 30) && (red_bird.posY < 320 + pipe.posY || red_bird.posY > 460 + pipe.posY)) {
        socket.emit("blue_wins");;
    }
    else if ((pipe.posX <= 95 && pipe.posX >= 30) && (blue_bird.posY < 320 + pipe.posY || blue_bird.posY > 460 + pipe.posY)) {
        socket.emit("red_wins");
    }

    if (pipe.posX < -60) {
        pipe.posX = 340;
        socket.emit("move_pipe");
        socket.on("set_pipe_y", function (data) {
            pipe.posY = data;
        });
    }
    animation = requestAnimationFrame(animate);
}

function gameOver() {
    $('#play').show();
    $('#gameover').show();
    hit.play();
    cancelAnimationFrame(animation);
}

function start() {
    $('#play').hide();
    $('#gameover').hide();
    $("#winner").hide();
    swoosh.play();

    pipe.posX = 288;
    pipe.posY = -100;

    red_bird.posY = 320;
    red_bird.velocity = 5;
    blue_bird.posY = 280;
    blue_bird.velocity = 5;
    animation = requestAnimationFrame(animate);
}

container.addEventListener("click", function (event) {
    socket.emit("jump");
});

socket.emit("new");

socket.on("blue", function () {
    $("#color").css("background-image", `url("/sprites/bluebird-midflap.png")`);
})

socket.on("red", function () {
    $("#color").css("background-image", `url("/sprites/redbird-midflap.png")`);
})

socket.on("gray", function () {
    $("#color").css("background-image", `url("/sprites/graybird-midflap.png")`);
})

socket.on("updated", function (data) {
    pipe.update();
    red_bird.update();
    blue_bird.update();
});

$("#play").click(function (event) {
    event.stopImmediatePropagation()
    socket.emit("start_game");
});

socket.on("game", function () {
    start();
});

socket.on("red_jump", function () {
    red_bird.jump();
});

socket.on("blue_jump", function () {
    blue_bird.jump();
});

socket.on("end", function (data) {
    $("#winner").text(data.msg);
    $("#winner").css("color", data.color);
    $("#winner").show();
    gameOver();
});