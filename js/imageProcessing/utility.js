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

function getPixel(imageData, x, y) {
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

function copyImageData(inputData, outputData) {
    for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]   = inputData.data[i];
            outputData.data[i+1] = inputData.data[i+1];
            outputData.data[i+2] = inputData.data[i+2];
            outputData.data[i+3] = inputData.data[i+3];
        }
}

function applyDividingKernel(inputData, outputData, kernel) {
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
                    pixel = getPixel(inputData, x + i, y + j);
                    kernelResult.r += pixel.r * kernel[j + radiusHeight][i + radiusWidth];
                    kernelResult.g += pixel.g * kernel[j + radiusHeight][i + radiusWidth];
                    kernelResult.b += pixel.b * kernel[j + radiusHeight][i + radiusWidth];
                    kernelResult.a += pixel.a * kernel[j + radiusHeight][i + radiusWidth];
                }
            }
            var i = (x + y * outputData.width) * 4;
            outputData.data[i]   = kernelResult.r / divisor;
            outputData.data[i+1] = kernelResult.g / divisor;
            outputData.data[i+2] = kernelResult.b / divisor;
            outputData.data[i+3] = kernelResult.a / divisor;
        }
    }
}

function applyAggregatingKernel(inputData, outputData, kernel) {
    var kernelHeight = kernel.length, radiusHeight = (kernelHeight - 1) / 2;
    var kernelWidth = kernel[0].length, radiusWidth = (kernelWidth - 1) / 2;
    for (var x = 0; x < inputData.width; ++x) {
        for (var y = 0; y < inputData.height; ++y) {
            var kernelResult = {r: 0, g: 0, b: 0, a: 0}, pixel;
            for (var i = -radiusWidth; i <= radiusWidth; ++i) {
                for (var j = -radiusHeight; j <= radiusHeight; ++j) {
                    pixel = getPixel(inputData, x + i, y + j);
                    kernelResult.r += pixel.r * kernel[j + radiusHeight][i + radiusWidth];
                    kernelResult.g += pixel.g * kernel[j + radiusHeight][i + radiusWidth];
                    kernelResult.b += pixel.b * kernel[j + radiusHeight][i + radiusWidth];
                    kernelResult.a += pixel.a * kernel[j + radiusHeight][i + radiusWidth];
                }
            }
            var i = (x + y * outputData.width) * 4;
            outputData.data[i]   = (kernelResult.r > 255) ? 255 : (kernelResult.r < 0) ? 0 : kernelResult.r;
            outputData.data[i+1] = (kernelResult.g > 255) ? 255 : (kernelResult.g < 0) ? 0 : kernelResult.g;
            outputData.data[i+2] = (kernelResult.b > 255) ? 255 : (kernelResult.b < 0) ? 0 : kernelResult.b;
            outputData.data[i+3] = (kernelResult.a > 255) ? 255 : (kernelResult.a < 0) ? 0 : kernelResult.a;
        }
    }
}