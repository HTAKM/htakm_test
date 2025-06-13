"use strict";
let gameMap;
let canvas, ctx;
let mouseX, mouseY, mouseDown = false, cleanMode = false;
const defaultSideLength = 50;
const defaultCanvasSide = defaultSideLength * 10;


function init() {
    $("#game-canvas").attr("style", "width: 100%;");
    canvas = $("#game-canvas").get(0);
    canvas.width = canvas.height = defaultCanvasSide;
    ctx = canvas.getContext('2d');
    gameMap = new Uint8Array(defaultSideLength * defaultSideLength);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPixel() {
    ctx.fillStyle = (cleanMode) ? "black" : "white";
    ctx.fillRect(mouseX * 10, mouseY * 10, 10, 10);
}

function switchMode(event) {
    $(event.target).find("span.title").html(($(event.target).find("span.title").html() == "Fill") ? "Clean" : "Fill");
    cleanMode = !cleanMode;
}

function handleMouseDown(event) {
    mouseDown = true;
    getMoustPos(event);
    drawPixel();
}

function handleMouseMove(event) {
    if (mouseDown) {
        getMoustPos(event);
        drawPixel();
    }
}

function handleMouseUp(event) {
    mouseDown = false;
}

function getMoustPos(event) {
    let rect = canvas.getBoundingClientRect();
    let scale = canvas.width / rect.width;
    mouseX = parseInt((event.clientX - rect.left) * scale / 10);
    mouseY = parseInt((event.clientY - rect.top) * scale / 10);
} 

$(function() {
    init();
    $("#game-canvas").on('mousedown', handleMouseDown);
    $("#game-canvas").on('mousemove', handleMouseMove);
    $("#game-canvas").on('mouseup', handleMouseUp);
    $("#pixel-fill-mode").on("click", switchMode);
});