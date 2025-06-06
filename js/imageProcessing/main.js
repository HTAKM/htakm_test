"use strict";

const defaultWidth = 320, defaultHeight = 180;
let currentOp = "no-op";
let inputCanvas, inputCtx, inputImageData = new ImageData(defaultWidth, defaultHeight);
let outputCanvas, outputCtx, outputImageData = new ImageData(defaultWidth, defaultHeight);
let inputMemoryCanvas, inputMemoryCtx;
let outputMemoryCanvas, outputMemoryCtx;
let drawHeight;
let scaledSize;
let fileName = "";
let fileType;

if (!(window.FileReader && window.Image && window.ImageData)) {
    alert("Your browser does not support features that are crucial for this website.");
}

function init(inputCanvasId, outputCanvasId, inputMemoryCanvasId, outputMemoryCanvasId) {
    inputCanvas = $("#" + inputCanvasId).get(0);
    inputCanvas.width = defaultWidth;
    inputCanvas.height = defaultHeight;
    inputCtx = inputCanvas.getContext("2d");
    outputCanvas = $("#" + outputCanvasId).get(0);
    outputCanvas.width = defaultWidth;
    outputCanvas.height = defaultHeight;
    outputCtx = outputCanvas.getContext("2d");
    inputMemoryCanvas = $("#" + inputMemoryCanvasId).get(0);
    inputMemoryCtx = inputMemoryCanvas.getContext("2d");
    outputMemoryCanvas = $("#" + outputMemoryCanvasId).get(0);
    outputMemoryCtx = outputMemoryCanvas.getContext("2d");
}

function startUpload(event) {
    $("#input-file-select").wrap("<form>").closest('form').get(0).reset();
    $("#input-file-select").unwrap();
    $("#input-file-select").click();
}

function importImage(event) {
    $("#remark").html("");
    const validFileType = ["image/png"];
    const files = event.target.files;
    inputCanvas.width = defaultWidth;
    inputCanvas.height = defaultHeight;
    outputCanvas.width = defaultWidth;
    outputCanvas.height = defaultHeight;
    if (files.length >= 1) {
        let file = files[0];
        fileName = file.name.split('.');
        fileName.pop();
        fileName = fileName.join('.')
        fileType = file.type;
        if (validFileType.indexOf(fileType) == -1) {
            $("#remark").html("This website do not support this file.");
            return;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                scaledSize = inputCanvas.width / img.width;
                drawHeight = scaledSize * img.height;
                inputMemoryCanvas.width = img.width;
                inputMemoryCanvas.height = img.height;
                outputMemoryCanvas.width = img.width;
                outputMemoryCanvas.height = img.height;
                inputCanvas.height = drawHeight;
                outputCanvas.height = drawHeight;
                inputMemoryCtx.drawImage(img, 0, 0);
                inputImageData = inputMemoryCtx.getImageData(0, 0, img.width, img.height);
                inputCtx.scale(scaledSize, scaledSize);
                inputCtx.drawImage(inputMemoryCanvas, 0, 0);
                outputCtx.scale(scaledSize, scaledSize);
                outputImageData = new ImageData(img.width, img.height);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function replaceInputImage(event) {
    copyImageData(outputImageData, inputImageData);
    inputMemoryCtx.putImageData(inputImageData, 0, 0);
    inputCtx.drawImage(inputMemoryCanvas, 0, 0);
}

function outputImage(event) {
    const link = $('#output-file-select').get(0);
    let imageData = outputMemoryCanvas.toDataURL(fileType);
    if (imageData === null)
        imageData = outputMemoryCanvas.toDataURL('image/png');
    if (imageData === null)
        imageData = new ImageData(defaultWidth, defaultHeight);
    link.href = imageData;
    link.download = fileName + '_processed.png';
    link.click();
}

function loadOutput() {
    outputMemoryCtx.putImageData(outputImageData, 0, 0);
    outputCanvas.width = defaultWidth;
    outputCanvas.height = drawHeight;
    outputCtx.scale(scaledSize, scaledSize);
    outputCtx.drawImage(outputMemoryCanvas, 0, 0);
}

function outputUpdate(event) {
    applyOperation();
    loadOutput();
}

function changeTabs(event) {
    let target = $(event.target);
    if (target.prop("tagName") !== "A") 
        target = target.parents("a");

    target.tab("show");
    target.toggleClass("active");
    target.parents(".nav-item").find(".nav-link").toggleClass("active");
    target.parents("li").find("span.title").html(target.html());
    currentOp = target.attr("href").substring(1);
    event.preventDefault();
}

$(function() {
    init("input", "output", "input-memory", "output-memory");
    $('a.basicOp-dropdown-item').on("click", changeTabs);
    $('#change-input-image').on("click", startUpload);
    $('#output-update').on("click", outputUpdate);
    $('#input-file-select').on("change", importImage);
    $('#download-output-image').on("click", outputImage);
    $('#replace-input-image').on("click", replaceInputImage);
});