"use strict";
let imageData;
let canvas, ctx;

function init() {
    $("#fractral-canvas").attr("style", "width: 100%;");
    canvas = $("#fractral-canvas").get(0);
    canvas.width = canvas.height = 512;
    ctx = canvas.getContext('2d');
    imageData = new ImageData(512, 512);
    for (let i = 0; i < imageData.data.length; ++i) imageData.data[i] = 255;
    ctx.putImageData(imageData, 0, 0);
}

$(function() {
    init();
});