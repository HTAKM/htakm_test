"use strict";

function generateMSBMask(maxBits, bits) {
    var mask = 0;
    const setMask = Math.pow(2, maxBits - 1);
    for (var n = 0; n < bits; ++n) {
        mask >>= 1;
        mask |= setMask;
    }
    return mask;
}

function generateLSBMask(maxBits, bits) {
    var mask = 0;
    for (var n = 0; n < bits; ++n) {
        mask <<= 1;
        mask |= 1;
    }
    return mask;
}

function getPixelFromImageData(imageData, x, y) {
    if (x < 0) 
        x = 0;
    if (x >= imageData.width) 
        x = imageData.width - 1;
    if (y < 0) 
        y = 0;
    if (y >= imageData.height) 
        y = imageData.height - 1;
    var i = (x + y * imageData.width) * 4;
    return {r: imageData.data[i], g: imageData.data[i+1], b: imageData.data[i+2], a: imageData.data[i+3]}
}

function getPixelFromArray(array, x, y, width, height) {
    if (x < 0) 
        x = 0;
    if (x >= width) 
        x = width - 1;
    if (y < 0) 
        y = 0;
    if (y >= height) 
        y = height - 1;
    var i = (x + y * width) * 4;
    return {r: array[i], g: array[i+1], b: array[i+2], a: array[i+3]}
}

function copyImageData(inputData, outputData) {
    for (var i = 0; i < inputData.data.length; ++i)
        outputData.data[i] = inputData.data[i];
}

function arrayToImageData(sourceArray, targetImageData) {
    for (var i = 0; i < Math.min(sourceArray.length, targetImageData.data.length); ++i)
        targetImageData.data[i] = sourceArray[i];
}

function applyDivKernelGetImageData(inputData, outputData, kernel) {
    var kernelHeight = kernel.length, radiusHeight = (kernelHeight - 1) / 2;
    var kernelWidth = kernel[0].length, radiusWidth = (kernelWidth - 1) / 2;
    var divisor = 0;
    for (var j = 0; j < kernelHeight; ++j) 
        divisor += kernel[j].reduce((a, b) => a + b, 0);
    for (var x = 0; x < inputData.width; ++x) {
        for (var y = 0; y < inputData.height; ++y) {
            var kernelResult = {r: 0, g: 0, b: 0, a: 0}, pixel;
            for (var i = -radiusWidth; i <= radiusWidth; ++i) {
                for (var j = -radiusHeight; j <= radiusHeight; ++j) {
                    pixel = getPixelFromImageData(inputData, x + i, y + j);
                    kernelResult.r += pixel.r * kernel[j + radiusHeight][i + radiusWidth];
                    kernelResult.g += pixel.g * kernel[j + radiusHeight][i + radiusWidth];
                    kernelResult.b += pixel.b * kernel[j + radiusHeight][i + radiusWidth];
                    kernelResult.a += pixel.a * kernel[j + radiusHeight][i + radiusWidth];
                }
            }
            var i = (x + y * inputData.width) * 4;
            outputData.data[i]   = kernelResult.r / divisor;
            outputData.data[i+1] = kernelResult.g / divisor;
            outputData.data[i+2] = kernelResult.b / divisor;
            outputData.data[i+3] = kernelResult.a / divisor;
        }
    }
}

// Since ImageData somehow deal with clipping, we put the values to an array instead.
function applyAggKernelGetArray(inputData, outputArray, kernel) {
    var kernelHeight = kernel.length, radiusHeight = (kernelHeight - 1) / 2;
    var kernelWidth = kernel[0].length, radiusWidth = (kernelWidth - 1) / 2;
    for (var x = 0; x < inputData.width; ++x) {
        for (var y = 0; y < inputData.height; ++y) {
            var kernelResult = {r: 0, g: 0, b: 0, a: 0}, pixel;
            for (var i = -radiusWidth; i <= radiusWidth; ++i) {
                for (var j = -radiusHeight; j <= radiusHeight; ++j) {
                    pixel = getPixelFromImageData(inputData, x + i, y + j);
                    kernelResult.r += pixel.r * kernel[j + radiusHeight][i + radiusWidth];
                    kernelResult.g += pixel.g * kernel[j + radiusHeight][i + radiusWidth];
                    kernelResult.b += pixel.b * kernel[j + radiusHeight][i + radiusWidth];
                    kernelResult.a += pixel.a * kernel[j + radiusHeight][i + radiusWidth];
                }
            }
            var i = (x + y * inputData.width) * 4;
            outputArray[i]   = kernelResult.r;
            outputArray[i+1] = kernelResult.g;
            outputArray[i+2] = kernelResult.b;
            outputArray[i+3] = kernelResult.a;
        }
    }
}

function applyAggKernelToArray(inputArray, outputArray, kernel, width, height) {
    var kernelHeight = kernel.length, radiusHeight = (kernelHeight - 1) / 2;
    var kernelWidth = kernel[0].length, radiusWidth = (kernelWidth - 1) / 2;
    for (var x = 0; x < width; ++x) {
        for (var y = 0; y < height; ++y) {
            var kernelResult = {r: 0, g: 0, b: 0, a: 0}, pixel;
            for (var i = -radiusWidth; i <= radiusWidth; ++i) {
                for (var j = -radiusHeight; j <= radiusHeight; ++j) {
                    pixel = getPixelFromArray(inputArray, x + i, y + j, width, height);
                    kernelResult.r += pixel.r * kernel[j + radiusHeight][i + radiusWidth];
                    kernelResult.g += pixel.g * kernel[j + radiusHeight][i + radiusWidth];
                    kernelResult.b += pixel.b * kernel[j + radiusHeight][i + radiusWidth];
                    kernelResult.a += pixel.a * kernel[j + radiusHeight][i + radiusWidth];
                }
            }
            var i = (x + y * width) * 4;
            outputArray[i]   = kernelResult.r;
            outputArray[i+1] = kernelResult.g;
            outputArray[i+2] = kernelResult.b;
            outputArray[i+3] = kernelResult.a;
        }
    }
}